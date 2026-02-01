import * as vscode from 'vscode';
import type { ChangeListManager } from './changeListManager';
import type { GitService } from './gitService';
import type { ConfigService } from './configService';
import { logger } from '../utils/logger';

/**
 * Result of validating staged files
 */
export interface ValidationResult {
  valid: boolean;
  stagedLists: Map<string, vscode.Uri[]>; // listId -> file URIs
  extraFiles: vscode.Uri[]; // Files not in primary list
  primaryListId: string | undefined; // List with most staged files
  primaryListName: string | undefined;
}

/**
 * User's choice from the guard dialog
 */
export type GuardChoice = 'unstage' | 'commit' | 'cancel';

/**
 * Service for guarding commits to prevent mixing change lists
 */
export class CommitGuardService implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];
  private originalCommitCommand: ((...args: unknown[]) => unknown) | undefined;

  constructor(
    private readonly changeListManager: ChangeListManager,
    private readonly gitService: GitService,
    private readonly configService: ConfigService
  ) { }

  /**
   * Initialize the commit guard by intercepting the git.commit command
   */
  initialize(): void {
    // We'll intercept at the point of commit by registering our own command
    // that wraps the git.commit command
    this.disposables.push(
      vscode.commands.registerCommand(
        'gitChangeLists.guardedCommit',
        async () => this.handleGuardedCommit()
      )
    );
  }

  /**
   * Handle a guarded commit attempt
   */
  private async handleGuardedCommit(): Promise<void> {
    logger.debug('CommitGuard: Guarded commit initiated');

    if (!this.configService.getCommitGuardEnabled()) {
      logger.debug('CommitGuard: Guard disabled, proceeding with commit');
      // Guard disabled, proceed directly
      await vscode.commands.executeCommand('git.commit');
      return;
    }

    const validation = this.validateStagedFiles();
    logger.debug('CommitGuard: Validation result', {
      valid: validation.valid,
      listCount: validation.stagedLists.size,
      extraFileCount: validation.extraFiles.length,
    });

    if (validation.valid) {
      logger.info('CommitGuard: Validation passed, proceeding with commit');
      // All staged files are from the same list (or no list), proceed
      await vscode.commands.executeCommand('git.commit');
      return;
    }

    logger.warn('CommitGuard: Multiple change lists detected in staged files');

    // Show guard dialog
    const choice = await this.showGuardDialog(validation);
    logger.debug('CommitGuard: User choice', { choice });

    switch (choice) {
      case 'unstage':
        logger.info('CommitGuard: Unstaging extra files', { count: validation.extraFiles.length });
        await this.gitService.unstageFiles(validation.extraFiles);
        // Proceed with commit after unstaging
        await vscode.commands.executeCommand('git.commit');
        break;
      case 'commit':
        logger.info('CommitGuard: User chose to commit anyway');
        // User chose to commit anyway
        await vscode.commands.executeCommand('git.commit');
        break;
      case 'cancel':
        logger.info('CommitGuard: User cancelled commit');
        // Do nothing
        break;
    }
  }

  /**
   * Validate that all staged files belong to the same change list
   */
  validateStagedFiles(): ValidationResult {
    const stagedChanges = this.gitService.getStagedFiles();
    const stagedLists = new Map<string, vscode.Uri[]>();

    for (const change of stagedChanges) {
      const list = this.changeListManager.getListForFile(change.uri.fsPath);
      const listId = list?.id ?? '__unassigned__';

      if (!stagedLists.has(listId)) {
        stagedLists.set(listId, []);
      }
      stagedLists.get(listId)!.push(change.uri);
    }

    // Find the list with most files (primary)
    let primaryListId: string | undefined;
    let maxFiles = 0;
    for (const [listId, files] of stagedLists) {
      if (files.length > maxFiles) {
        maxFiles = files.length;
        primaryListId = listId;
      }
    }

    // Collect extra files (not in primary list)
    const extraFiles: vscode.Uri[] = [];
    for (const [listId, files] of stagedLists) {
      if (listId !== primaryListId) {
        extraFiles.push(...files);
      }
    }

    const primaryList = primaryListId && primaryListId !== '__unassigned__'
      ? this.changeListManager.getList(primaryListId)
      : undefined;

    return {
      valid: stagedLists.size <= 1,
      stagedLists,
      extraFiles,
      primaryListId: primaryListId === '__unassigned__' ? undefined : primaryListId,
      primaryListName: primaryList?.name,
    };
  }

  /**
   * Show the guard dialog and get user's choice
   */
  private async showGuardDialog(validation: ValidationResult): Promise<GuardChoice> {
    const listDetails: string[] = [];

    for (const [listId, files] of validation.stagedLists) {
      const list = listId === '__unassigned__'
        ? { name: 'Unassigned' }
        : this.changeListManager.getList(listId);
      const listName = list?.name ?? 'Unknown';
      const isPrimary = listId === validation.primaryListId;
      const suffix = isPrimary ? ' (primary)' : '';
      listDetails.push(`• ${listName}: ${files.length} file${files.length > 1 ? 's' : ''}${suffix}`);
    }

    const message = [
      'You are about to commit files from multiple change lists:',
      '',
      ...listDetails,
      '',
      'This might mix unrelated changes in a single commit.',
    ].join('\n');

    const unstageOption = `Unstage Extra Files (${validation.extraFiles.length})`;
    const commitOption = 'Commit Anyway';
    const cancelOption = 'Cancel';

    const choice = await vscode.window.showWarningMessage(
      message,
      { modal: true },
      unstageOption,
      commitOption,
      cancelOption
    );

    if (choice === unstageOption) {
      return 'unstage';
    } else if (choice === commitOption) {
      return 'commit';
    }
    return 'cancel';
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }
}
