/**
 * Extension constants
 */

/** Extension identifier */
export const EXTENSION_ID = 'smart-commit';

/** View identifiers */
export const VIEW_ID = 'smartCommit.changeLists';

/** Command identifiers */
export const COMMANDS = {
  CREATE_LIST: 'smartCommit.createList',
  DELETE_LIST: 'smartCommit.deleteList',
  RENAME_LIST: 'smartCommit.renameList',
  SET_ACTIVE_LIST: 'smartCommit.setActiveList',
  MOVE_TO_LIST: 'smartCommit.moveToList',
  COMMIT_LIST: 'smartCommit.commitList',
  STAGE_LIST: 'smartCommit.stageList',
  TOGGLE_VIEW_MODE: 'smartCommit.toggleViewMode',
  APPLY_PATCH: 'smartCommit.applyPatch',
  CREATE_PATCH: 'smartCommit.createPatch',
  REFRESH: 'smartCommit.refresh',
  GUARDED_COMMIT: 'smartCommit.guardedCommit',
  SET_LIST_COLOR: 'smartCommit.setListColor',
} as const;

/** Configuration keys */
export const CONFIG = {
  SECTION: 'smartCommit',
  DEFAULT_VIEW_MODE: 'defaultViewMode',
  SHOW_STATUS_BAR: 'showStatusBar',
  CONFIRM_DELETE_NON_EMPTY: 'confirmDeleteNonEmpty',
  AUTO_ACTIVATE_NEW: 'autoActivateNew',
  COMMIT_GUARD_ENABLED: 'commitGuard.enabled',
  INTERCEPT_COMMIT: 'commitGuard.interceptCommit',
  AUTO_ASSIGN_STAGED: 'autoAssignStagedFiles',
  DEBUG_LOGGING: 'debug.enableLogging',
} as const;

/** Storage keys */
export const STORAGE_KEYS = {
  CHANGE_LIST_STATE: 'smartCommit.changeListState',
  VIEW_MODE: 'smartCommit.viewMode',
  EXPANSION_STATE: 'smartCommit.expansionState',
} as const;

/** Context keys for when clauses */
export const CONTEXT_KEYS = {
  LIST_IS_DEFAULT: 'listIsDefault',
  LIST_IS_ACTIVE: 'listIsActive',
  HAS_CHANGES: 'smartCommit.hasChanges',
} as const;

/** Default change list name */
export const DEFAULT_LIST_NAME = 'Default';

/** Unversioned files list ID */
export const UNVERSIONED_LIST_ID = 'virtual-unversioned-files-list';

/** Current schema version for state persistence */
export const STATE_SCHEMA_VERSION = 1;

/** Debounce delay for refresh operations (ms) */
export const REFRESH_DEBOUNCE_MS = 150;

/** MIME type for drag and drop operations */
export const DRAG_MIME_TYPE = 'application/vnd.code.tree.smartcommit.changelists';

/** Tree item context values */
export const CONTEXT_VALUES = {
  CHANGE_LIST: 'changeList',
  CHANGE_LIST_DEFAULT: 'changeListDefault',
  CHANGE_LIST_ACTIVE: 'changeListActive',
  CHANGE_LIST_READONLY: 'changeListReadOnly',
  DIRECTORY: 'changeListDirectory',
  FILE: 'changeListFile',
} as const;
