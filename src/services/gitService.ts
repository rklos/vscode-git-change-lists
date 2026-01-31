import * as vscode from 'vscode';
import type { GitExtension, Git, Repository, Change } from '../types/git';
import { REFRESH_DEBOUNCE_MS } from '../utils/constants';
import { debounce } from '../utils/helpers';
import { logger } from '../utils/logger';

/**
 * Represents a newly staged file detected by the service
 */
export interface StagedFileChange {
  uri: vscode.Uri;
  isNew: boolean; // true if file was not staged before
}

/**
 * Service for interacting with the Git extension
 */
export class GitService implements vscode.Disposable {
  private gitApi: Git | undefined;
  private repository: Repository | undefined;
  private disposables: vscode.Disposable[] = [];

  private readonly _onDidChangeState = new vscode.EventEmitter<void>();
  readonly onDidChangeState = this._onDidChangeState.event;

  private readonly _onDidStageFiles = new vscode.EventEmitter<StagedFileChange[]>();
  readonly onDidStageFiles = this._onDidStageFiles.event;

  private readonly _onDidCommit = new vscode.EventEmitter<string[]>();
  readonly onDidCommit = this._onDidCommit.event;

  private debouncedEmitChange: () => void;

  // Track previously staged files to detect new staging
  private previouslyStagedFiles = new Set<string>();
  private lastKnownHead: string | undefined;

  constructor() {
    this.debouncedEmitChange = debounce(() => {
      this._onDidChangeState.fire();
    }, REFRESH_DEBOUNCE_MS);
  }

  /**
   * Initialize the Git service and connect to the Git extension
   */
  async initialize(): Promise<boolean> {
    try {
      logger.debug('GitService: Looking for vscode.git extension...');
      const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');

      if (!gitExtension) {
        logger.warn('GitService: vscode.git extension not found');
        return false;
      }

      // Wait for the extension to activate
      if (!gitExtension.isActive) {
        logger.debug('GitService: Activating vscode.git extension...');
        await gitExtension.activate();
      }

      const extension = gitExtension.exports;
      if (!extension.enabled) {
        logger.debug('GitService: Waiting for Git to be enabled...');
        // Wait for Git to be enabled
        await new Promise<void>((resolve) => {
          const disposable = extension.onDidChangeEnablement((enabled) => {
            if (enabled) {
              logger.debug('GitService: Git enabled');
              disposable.dispose();
              resolve();
            }
          });
        });
      }

      this.gitApi = extension.getAPI(1);
      logger.debug('GitService: Got Git API (version 1)');

      // Get the first repository
      this.setupRepository();

      // Listen for repository changes
      this.disposables.push(
        this.gitApi.onDidOpenRepository(() => {
          logger.event('GitService', 'Repository opened');
          this.setupRepository();
        }),
        this.gitApi.onDidCloseRepository(() => {
          logger.event('GitService', 'Repository closed');
          this.setupRepository();
        })
      );

      logger.info('GitService: Initialization successful');
      return true;
    } catch (error) {
      logger.error('GitService: Failed to initialize', error);
      return false;
    }
  }

  /**
   * Set up the current repository
   */
  private setupRepository(): void {
    // Clean up previous repository listeners
    this.disposeRepositoryListeners();

    if (!this.gitApi || this.gitApi.repositories.length === 0) {
      logger.debug('GitService: No repositories available');
      this.repository = undefined;
      return;
    }

    // Use the first repository (multi-root support can be added later)
    this.repository = this.gitApi.repositories[0];
    logger.info('GitService: Repository set up', {
      rootUri: this.repository.rootUri.fsPath,
      repositoryCount: this.gitApi.repositories.length,
    });

    // Initialize tracking state
    this.initializeTrackingState();

    // Listen for state changes
    if (this.repository) {
      this.disposables.push(
        this.repository.state.onDidChange(() => {
          this.handleRepositoryStateChange();
          this.debouncedEmitChange();
        })
      );
    }

    this._onDidChangeState.fire();
  }

  /**
   * Initialize tracking state from current repository
   */
  private initializeTrackingState(): void {
    if (!this.repository) {
      return;
    }

    // Track currently staged files
    this.previouslyStagedFiles = new Set(
      this.repository.state.indexChanges.map((c) => c.uri.fsPath)
    );

    // Track current HEAD
    this.lastKnownHead = this.repository.state.HEAD?.commit;
  }

  /**
   * Handle repository state changes to detect staging and commits
   */
  private handleRepositoryStateChange(): void {
    if (!this.repository) {
      return;
    }

    const state = this.repository.state;

    // Check for new staged files
    const currentlyStagedFiles = new Set(
      state.indexChanges.map((c) => c.uri.fsPath)
    );

    const newlyStagedFiles: StagedFileChange[] = [];
    for (const filePath of currentlyStagedFiles) {
      if (!this.previouslyStagedFiles.has(filePath)) {
        const change = state.indexChanges.find((c) => c.uri.fsPath === filePath);
        if (change) {
          newlyStagedFiles.push({
            uri: change.uri,
            isNew: true,
          });
        }
      }
    }

    if (newlyStagedFiles.length > 0) {
      logger.debug('GitService: New files staged', {
        count: newlyStagedFiles.length,
        files: newlyStagedFiles.map(f => f.uri.fsPath),
      });
      this._onDidStageFiles.fire(newlyStagedFiles);
    }

    this.previouslyStagedFiles = currentlyStagedFiles;

    // Check for commits (HEAD changed)
    const currentHead = state.HEAD?.commit;
    if (currentHead && currentHead !== this.lastKnownHead && this.lastKnownHead) {
      // A commit happened - emit the files that were staged before
      const committedFiles = Array.from(this.previouslyStagedFiles);
      logger.debug('GitService: Commit detected', {
        newHead: currentHead.substring(0, 8),
        oldHead: this.lastKnownHead.substring(0, 8),
        committedFileCount: committedFiles.length,
      });
      this._onDidCommit.fire(committedFiles);
    }
    this.lastKnownHead = currentHead;
  }

  /**
   * Dispose of repository-specific listeners
   */
  private disposeRepositoryListeners(): void {
    // Disposables are collected in the main array and cleaned up together
  }

  /**
   * Check if a repository is available
   */
  hasRepository(): boolean {
    return this.repository !== undefined;
  }

  /**
   * Get the workspace root URI
   */
  getWorkspaceRoot(): vscode.Uri | undefined {
    return this.repository?.rootUri;
  }

  /**
   * Get currently staged files (index changes)
   */
  getStagedFiles(): Change[] {
    if (!this.repository) {
      return [];
    }
    return [...this.repository.state.indexChanges];
  }

  /**
   * Get all modified files (working tree + index)
   */
  async getModifiedFiles(): Promise<Change[]> {
    if (!this.repository) {
      return [];
    }

    const state = this.repository.state;
    const changes: Change[] = [];

    // Working tree changes (unstaged)
    changes.push(...state.workingTreeChanges);

    // Index changes (staged)
    changes.push(...state.indexChanges);

    // Merge changes (conflicts)
    changes.push(...state.mergeChanges);

    // Deduplicate by URI (prefer working tree over index)
    const seen = new Set<string>();
    const deduped: Change[] = [];

    for (const change of changes) {
      const key = change.uri.fsPath;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(change);
      }
    }

    return deduped;
  }

  /**
   * Stage specific files
   */
  async stageFiles(uris: vscode.Uri[]): Promise<void> {
    if (!this.repository || uris.length === 0) {
      return;
    }

    logger.debug('GitService: Staging files', {
      count: uris.length,
      files: uris.map(u => u.fsPath),
    });

    await this.repository.add(uris);
    logger.info('GitService: Files staged successfully', { count: uris.length });
  }

  /**
   * Unstage specific files
   */
  async unstageFiles(uris: vscode.Uri[]): Promise<void> {
    if (!this.repository || uris.length === 0) {
      return;
    }

    logger.debug('GitService: Unstaging files', {
      count: uris.length,
      files: uris.map(u => u.fsPath),
    });

    await this.repository.revert(uris);
    logger.info('GitService: Files unstaged successfully', { count: uris.length });
  }

  /**
   * Commit staged files
   */
  async commit(message: string): Promise<void> {
    if (!this.repository) {
      throw new Error('No repository available');
    }

    logger.debug('GitService: Committing with message', { message });

    await this.repository.commit(message);
    logger.info('GitService: Commit successful');
  }

  /**
   * Get the diff for a file
   */
  async getDiff(uri: vscode.Uri): Promise<string> {
    if (!this.repository) {
      return '';
    }

    try {
      return await this.repository.diffWithHEAD(uri.fsPath);
    } catch {
      return '';
    }
  }

  /**
   * Apply a patch
   */
  async applyPatch(patch: string): Promise<void> {
    if (!this.repository) {
      throw new Error('No repository available');
    }

    await this.repository.apply(patch);
  }

  /**
   * Get repository input box value
   */
  getInputBoxValue(): string {
    return this.repository?.inputBox.value ?? '';
  }

  /**
   * Set repository input box value
   */
  setInputBoxValue(value: string): void {
    if (this.repository) {
      this.repository.inputBox.value = value;
    }
  }

  /**
   * Refresh repository state
   */
  async refreshRepository(): Promise<void> {
    if (this.repository) {
      await this.repository.status();
    }
  }

  dispose(): void {
    this._onDidChangeState.dispose();
    this._onDidStageFiles.dispose();
    this._onDidCommit.dispose();
    this.disposables.forEach((d) => d.dispose());
  }
}
