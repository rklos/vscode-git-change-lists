/**
 * Type definitions for the vscode.git extension API
 * Based on: https://github.com/microsoft/vscode/blob/main/extensions/git/src/api/git.d.ts
 */

import { Uri, Event, Disposable } from 'vscode';

export interface GitExtension {
  readonly enabled: boolean;
  readonly onDidChangeEnablement: Event<boolean>;
  getAPI(version: 1): Git;
}

export interface Git {
  readonly repositories: Repository[];
  readonly onDidOpenRepository: Event<Repository>;
  readonly onDidCloseRepository: Event<Repository>;
  getRepository(uri: Uri): Repository | null;
}

export interface Repository {
  readonly rootUri: Uri;
  readonly inputBox: InputBox;
  readonly state: RepositoryState;
  readonly ui: RepositoryUIState;

  getConfigs(): Promise<{ key: string; value: string }[]>;
  getConfig(key: string): Promise<string>;
  setConfig(key: string, value: string): Promise<string>;

  show(ref: string, path: string): Promise<string>;
  getCommit(ref: string): Promise<Commit>;

  add(resources: Uri[]): Promise<void>;
  revert(resources: Uri[]): Promise<void>;
  clean(resources: Uri[]): Promise<void>;

  apply(patch: string, reverse?: boolean): Promise<void>;
  diff(cached?: boolean): Promise<string>;
  diffWithHEAD(): Promise<Change[]>;
  diffWithHEAD(path: string): Promise<string>;
  diffWith(ref: string): Promise<Change[]>;
  diffWith(ref: string, path: string): Promise<string>;
  diffIndexWithHEAD(): Promise<Change[]>;
  diffIndexWithHEAD(path: string): Promise<string>;
  diffIndexWith(ref: string): Promise<Change[]>;
  diffIndexWith(ref: string, path: string): Promise<string>;
  diffBlobs(object1: string, object2: string): Promise<string>;
  diffBetween(ref1: string, ref2: string): Promise<Change[]>;
  diffBetween(ref1: string, ref2: string, path: string): Promise<string>;

  hashObject(data: string): Promise<string>;

  createBranch(name: string, checkout: boolean, ref?: string): Promise<void>;
  deleteBranch(name: string, force?: boolean): Promise<void>;
  getBranch(name: string): Promise<Branch>;
  getBranches(query: BranchQuery): Promise<Ref[]>;
  setBranchUpstream(name: string, upstream: string): Promise<void>;

  status(): Promise<void>;
  checkout(treeish: string): Promise<void>;

  addRemote(name: string, url: string): Promise<void>;
  removeRemote(name: string): Promise<void>;
  renameRemote(name: string, newName: string): Promise<void>;

  fetch(options?: FetchOptions): Promise<void>;
  fetch(remote?: string, ref?: string, depth?: number): Promise<void>;
  pull(unshallow?: boolean): Promise<void>;
  push(remoteName?: string, branchName?: string, setUpstream?: boolean, force?: ForcePushMode): Promise<void>;

  blame(path: string): Promise<string>;
  log(options?: LogOptions): Promise<Commit[]>;

  commit(message: string, opts?: CommitOptions): Promise<void>;
}

export interface InputBox {
  value: string;
}

export interface RepositoryState {
  readonly HEAD: Branch | undefined;
  readonly refs: Ref[];
  readonly remotes: Remote[];
  readonly submodules: Submodule[];
  readonly rebaseCommit: Commit | undefined;

  readonly mergeChanges: Change[];
  readonly indexChanges: Change[];
  readonly workingTreeChanges: Change[];

  readonly onDidChange: Event<void>;
}

export interface RepositoryUIState {
  readonly selected: boolean;
  readonly onDidChange: Event<void>;
}

export interface Branch extends Ref {
  readonly upstream?: Ref;
  readonly ahead?: number;
  readonly behind?: number;
}

export interface Ref {
  readonly type: RefType;
  readonly name?: string;
  readonly commit?: string;
  readonly remote?: string;
}

export const enum RefType {
  Head,
  RemoteHead,
  Tag,
}

export interface Remote {
  readonly name: string;
  readonly fetchUrl?: string;
  readonly pushUrl?: string;
  readonly isReadOnly: boolean;
}

export interface Submodule {
  readonly name: string;
  readonly path: string;
  readonly url: string;
}

export interface Commit {
  readonly hash: string;
  readonly message: string;
  readonly parents: string[];
  readonly authorDate?: Date;
  readonly authorName?: string;
  readonly authorEmail?: string;
  readonly commitDate?: Date;
}

export interface Change {
  readonly uri: Uri;
  readonly originalUri: Uri;
  readonly renameUri: Uri | undefined;
  readonly status: Status;
}

export const enum Status {
  INDEX_MODIFIED,
  INDEX_ADDED,
  INDEX_DELETED,
  INDEX_RENAMED,
  INDEX_COPIED,

  MODIFIED,
  DELETED,
  UNTRACKED,
  IGNORED,
  INTENT_TO_ADD,
  INTENT_TO_RENAME,
  TYPE_CHANGED,

  ADDED_BY_US,
  ADDED_BY_THEM,
  DELETED_BY_US,
  DELETED_BY_THEM,
  BOTH_ADDED,
  BOTH_DELETED,
  BOTH_MODIFIED,
}

export interface BranchQuery {
  readonly remote?: boolean;
  readonly pattern?: string;
  readonly count?: number;
  readonly contains?: string;
}

export interface FetchOptions {
  readonly remote?: string;
  readonly ref?: string;
  readonly all?: boolean;
  readonly prune?: boolean;
  readonly depth?: number;
}

export const enum ForcePushMode {
  Force,
  ForceWithLease,
  ForceWithLeaseIfIncludes,
}

export interface LogOptions {
  readonly maxEntries?: number;
  readonly path?: string;
  readonly reverse?: boolean;
}

export interface CommitOptions {
  readonly all?: boolean | 'tracked';
  readonly amend?: boolean;
  readonly signoff?: boolean;
  readonly signCommit?: boolean;
  readonly empty?: boolean;
  readonly noVerify?: boolean;
  readonly requireUserConfig?: boolean;
  readonly useEditor?: boolean;
  readonly verbose?: boolean;
  readonly postCommitCommand?: string;
}
