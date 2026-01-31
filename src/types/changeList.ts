import * as vscode from 'vscode';

/**
 * Represents a change list - a named container for organizing file changes
 */
export interface ChangeList {
  /** Unique identifier (UUID v4) */
  readonly id: string;
  /** User-editable display name */
  name: string;
  /** Optional description/notes for the change list */
  description?: string;
  /** Optional color for the change list icon */
  color?: string;
  /** Whether this list receives new unassigned changes */
  isActive: boolean;
  /** Whether this is the system default list (cannot be deleted) */
  readonly isDefault: boolean;
  /** Timestamp when the list was created */
  readonly createdAt: number;
  /** Timestamp of last modification */
  updatedAt: number;
  /** Whether the list is read-only (e.g. Unversioned Files) */
  readonly isReadOnly?: boolean;
}

/**
 * Represents a tracked file change with its change list association
 */
export interface TrackedChange {
  /** Absolute file path */
  readonly resourceUri: vscode.Uri;
  /** Relative path from workspace root */
  readonly relativePath: string;
  /** ID of the change list this file belongs to */
  changeListId: string;
  /** Git status of the file */
  readonly gitStatus: GitFileStatus;
  /** Original path for renamed files */
  readonly originalUri?: vscode.Uri;
}

/**
 * Git file status types
 */
export enum GitFileStatus {
  Modified = 'M',
  Added = 'A',
  Deleted = 'D',
  Renamed = 'R',
  Copied = 'C',
  Untracked = '?',
  Ignored = '!',
  Conflict = 'U',
}

/**
 * Persisted state structure for change lists
 */
export interface ChangeListState {
  /** Schema version for migration support */
  version: number;
  /** All change lists */
  lists: ChangeList[];
  /** Maps file paths to change list IDs */
  fileMapping: Record<string, string>;
}

/**
 * View mode for displaying files
 */
export type ViewMode = 'list' | 'tree';

/**
 * Tree node types for the change list view
 */
export type TreeNodeType = 'changeList' | 'directory' | 'file';

/**
 * Base interface for tree nodes
 */
export interface TreeNode {
  readonly type: TreeNodeType;
  readonly id: string;
  readonly label: string;
}

/**
 * Change list tree node (root level)
 */
export interface ChangeListNode extends TreeNode {
  readonly type: 'changeList';
  readonly changeList: ChangeList;
  readonly fileCount: number;
  readonly counts: {
    modified: number;
    added: number;
    deleted: number;
    renamed: number;
    untracked: number;
  };
}

/**
 * Directory tree node (for tree view mode)
 */
export interface DirectoryNode extends TreeNode {
  readonly type: 'directory';
  readonly changeListId: string;
  readonly path: string;
  readonly childCount: number;
}

/**
 * File tree node (leaf)
 */
export interface FileNode extends TreeNode {
  readonly type: 'file';
  readonly change: TrackedChange;
}

/**
 * Union type for all tree node types
 */
export type AnyTreeNode = ChangeListNode | DirectoryNode | FileNode;

/**
 * Event fired when change list state changes
 */
export interface ChangeListChangeEvent {
  readonly type: 'created' | 'deleted' | 'renamed' | 'activated' | 'filesMoved' | 'refresh';
  readonly changeListId?: string;
  readonly affectedFiles?: string[];
}
