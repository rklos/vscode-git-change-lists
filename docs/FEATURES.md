# Smart Commit Features

Comprehensive documentation of all features available in Smart Commit v1.0.0.

---

## Table of Contents

- [Change List Management](#change-list-management)
- [File Organization](#file-organization)
- [View Modes](#view-modes)
- [Git Integration](#git-integration)
- [Commit Guard](#commit-guard)
- [Status Bar Integration](#status-bar-integration)
- [User Interface](#user-interface)
- [Event-Driven Architecture](#event-driven-architecture)
- [State Persistence](#state-persistence)
- [Multi-Root Workspace Support](#multi-root-workspace-support)
- [Feature Limitations](#feature-limitations)

---

## Change List Management

Change lists are the core organizational unit in Smart Commit. They allow you to group related file changes together, independent of Git's staging area.

### Creating Change Lists

Create as many change lists as you need to organize your work:

**Methods:**
1. **Via View Header**: Click the **+** icon in the Change Lists view header
2. **Via Context Menu**: Right-click in empty space → **Create Change List**
3. **Via Command Palette**: `Smart Commit: Create Change List`

**Name Requirements:**
- Must be unique within the workspace
- Can contain Unicode characters (international characters supported)
- Cannot be empty
- Recommended: Use descriptive names like "Feature: Authentication" or "Bugfix: Login validation"

**Result:**
- New list appears in the Change Lists view
- If `autoActivateNew` is enabled (default), the new list becomes active automatically
- Empty lists are shown with a "0 files" indicator

### Renaming Change Lists

Change lists can be renamed at any time:

**Method:** Right-click a change list → **Rename Change List**

**Behavior:**
- All file associations are preserved (internal ID remains stable)
- New name must be unique
- Active status is maintained if the list is currently active
- Status bar updates immediately if renaming the active list

### Deleting Change Lists

Remove change lists you no longer need:

**Method:** Right-click a change list → **Delete Change List**

**Safety Features:**
- **Non-empty lists**: Prompt for confirmation if `confirmDeleteNonEmpty` is enabled (default)
- **Default list**: Cannot be deleted (greyed out in context menu)
- **Active list**: Can be deleted (active status moves to Default list)

**Result:**
- List is removed from the view
- Files are reassigned to the Default list
- State is persisted immediately

### Active List System

The **active change list** is a special designation that determines where newly detected changes automatically appear.

#### Setting the Active List

**Methods:**
1. **Via Context Menu**: Right-click a change list → **Set as Active Change List**
2. **Via Keybinding**: `Ctrl+Shift+L` / `Cmd+Shift+L` (opens quick-pick)
3. **Via Status Bar**: Click the status bar item showing the current active list

**Behavior:**
- Only one list can be active at a time
- Setting a list as active automatically deactivates the previous active list
- Active status persists across VS Code restarts
- Active list is marked with a checkmark icon

#### Auto-Assignment to Active List

When a file is modified or created:
- If the file is not yet assigned to any change list, it's assigned to the active list
- If the file is already in a change list, it remains there (no automatic reassignment)

When a file is staged externally (via command line, file explorer, etc.):
- If `autoAssignStagedFiles` is enabled (default), the file is assigned to the active list
- This keeps change lists synchronized with external Git operations

#### Visual Indicators

- **Tree View**: Active list has a checkmark icon (✓) and bold text
- **Status Bar**: Shows active list name (click to switch)
- **Context Menu**: "Set as Active" option is disabled for the currently active list

### Default Change List

The **Default** list is a special system-managed change list:

#### Characteristics

- **Always exists**: Cannot be deleted
- **Fallback container**: Captures all unassigned changes
- **Can be renamed**: You can rename it to anything you like
- **Can be set as active**: Works like any other list for active status
- **Special icon**: Shown with a folder icon (no special visual distinction)

#### When Files Appear in Default

- Newly detected changes when no active list is set
- Files explicitly moved to Default by the user
- Files from deleted change lists (reassigned automatically)
- Files without explicit list assignment

#### Purpose

The Default list ensures that:
- No changes are ever "lost" or hidden
- Users always have a starting point for organization
- The extension degrades gracefully if users don't create custom lists

---

## File Organization

Smart Commit provides multiple ways to move files between change lists, catering to different workflow preferences.

### Drag-and-Drop

Intuitive direct manipulation for visual thinkers:

#### Basic Drag-and-Drop

1. Click and hold a file in any change list
2. Drag to another change list header or body
3. Release when the target is highlighted
4. File moves instantly

#### Multi-Select Drag

1. Select multiple files using:
   - **Ctrl/Cmd+Click**: Toggle individual files
   - **Shift+Click**: Select range
2. Drag any selected file
3. All selected files move together

#### Visual Feedback

- **Source item**: Ghosted/translucent while dragging
- **Valid drop target**: Highlighted with border or background color
- **Invalid target**: No highlight, cursor shows "not allowed"
- **Post-drop**: Immediate count update on both source and destination lists

#### Implementation Details

- Uses VS Code's `TreeDragAndDropController` API
- MIME type: `application/vnd.code.tree.smartcommit.changelists`
- Supports only file-to-list drops (no list-to-list reordering)

### Context Menu

Keyboard-friendly alternative to drag-and-drop:

#### Move to Change List

1. Right-click a file (or multi-select files and right-click)
2. Select **Move to Change List**
3. Choose destination from submenu

**Submenu Contents:**
- All available change lists (current list excluded)
- **Create New...** option at the bottom (opens name input)

**Batch Operations:**
- If multiple files are selected, all move to the chosen list atomically

### Automatic Assignment

Files can be automatically assigned to change lists without manual intervention:

#### Externally Staged Files

When `autoAssignStagedFiles` is enabled (default):

**Scenario:** User stages a file using:
- Command line: `git add file.ts`
- File explorer: Right-click → Stage Changes
- Another extension's staging command

**Behavior:**
- Smart Commit detects the staging operation
- File is assigned to the active change list
- Tree view updates to reflect the assignment
- Log entry created (visible in debug mode)

**Why This Matters:**
- Maintains consistency between command-line Git and Smart Commit
- Prevents confusion when switching between workflows
- Keeps change lists synchronized with Git state

#### New Modifications

When a file is modified:
- If the file is not currently in any change list, it's assigned to the active list
- If the file is already in a change list, it stays there (no automatic reassignment)

### Movement Semantics

File movement behavior and edge cases:

#### Metadata Preservation

When moving files:
- **Diff hunks**: Not stored in change lists (computed on-demand from Git)
- **Original path**: Preserved for renamed files
- **Git status**: Updated dynamically (Modified, Added, Deleted, etc.)
- **File URI**: Remains unchanged (only list membership changes)

#### Conflict Handling

If attempting operations that could conflict:
- **Moving to current list**: No-op (silently ignored)
- **Moving staged files**: Allowed (doesn't unstage them)
- **Moving during merge**: Allowed (files remain in merge state)

---

## View Modes

Smart Commit supports two presentation modes for change list contents, optimized for different scenarios.

### List Mode (Default)

Flat presentation of all files in a change list:

#### Characteristics

- **Structure**: Change list → files (one level)
- **Sorting**: Alphabetical by filename (configurable in future versions)
- **Density**: High information density, many files visible at once
- **Navigation**: Fast scrolling, type-ahead search

#### Optimized For

- Small to medium change sets (<50 files)
- Users who know filenames by memory
- Quick scanning of what's changed
- Minimal cognitive overhead

#### Visual Layout

```
📁 Feature A (3 files)
   📄 authentication.ts
   📄 login.tsx
   📄 user-service.ts
📁 Bugfix B (1 file)
   📄 validation.ts
```

### Tree Mode

Hierarchical presentation preserving project structure:

#### Characteristics

- **Structure**: Change list → directories → subdirectories → files
- **Expansion**: Collapsible folders with persistent state
- **Navigation**: Tree-based, similar to file explorer
- **Context**: Shows where files are located in project structure

#### Optimized For

- Large change sets (>50 files)
- Changes spanning many directories
- Understanding architectural impact
- Users who think in terms of project structure

#### Visual Layout

```
📁 Feature A (3 files)
   📂 src/
      📂 components/
         📄 login.tsx
      📂 services/
         📄 authentication.ts
         📄 user-service.ts
📁 Bugfix B (1 file)
   📂 src/
      📂 utils/
         📄 validation.ts
```

#### Tree Construction

Files are organized into a prefix tree (trie):
- Common path prefixes are collapsed into folder nodes
- Empty intermediate directories are created as needed
- Folders show badge with child count

### Toggling View Modes

#### Methods

1. **Via View Header**: Click the tree/list icon button
2. **Via Command Palette**: `Smart Commit: Toggle List/Tree View`

#### Behavior

- **Instant switch**: No loading delay
- **Selection preservation**: Selected file remains selected (scrolled into view if needed)
- **Expansion state**: Separately persisted per mode

**Example:**
- You expand `src/components/` in tree mode
- Switch to list mode (all files flat)
- Switch back to tree mode
- `src/components/` is still expanded

### View State Persistence

All view state is persisted across VS Code sessions:

#### Per-Workspace Storage

- **Current mode**: List or tree (stored per workspace)
- **Expansion state**: Which folders are expanded in tree mode
- **Scroll position**: Restored when possible

#### Independent State

- List mode state doesn't affect tree mode state
- Each workspace has its own view preferences
- Global default can be set via `defaultViewMode` configuration

---

## Git Integration

Smart Commit integrates deeply with Git without replacing VS Code's built-in functionality.

### Real-Time Synchronization

Change lists stay synchronized with Git state:

#### What Triggers Updates

- **File system changes**: Modify, create, delete files
- **Git operations**: Stage, unstage, commit, reset
- **External operations**: Command-line Git, other extensions
- **Branch switches**: Checkout, merge, rebase

#### Debounced Refreshes

To prevent excessive updates:
- Git state changes are debounced (150ms default)
- Rapid changes trigger only one refresh
- UI remains responsive during bulk operations

#### Event Flow

1. Git extension detects repository state change
2. Fires `onDidChange` event
3. Smart Commit's `GitService` receives the event
4. `ChangeListManager` recomputes file assignments
5. `TreeDataProvider` refreshes the view
6. UI updates instantly

### Git File Status Mapping

Smart Commit displays Git status for each file:

#### Supported Statuses

| Git Status | Icon | Description |
|------------|------|-------------|
| Modified (M) | ✏️ | File content changed |
| Added (A) | ➕ | New file staged |
| Deleted (D) | ➖ | File removed |
| Renamed (R) | 🔄 | File moved/renamed |
| Copied (C) | 📋 | File copied |
| Untracked (??) | ❓ | New file not staged |
| Conflicted (U) | ⚠️ | Merge conflict |

#### Visual Indicators

- **Icon prefix**: Status icon appears before filename
- **Color coding**: Uses VS Code's theme colors for Git status
- **Tooltip**: Hover shows full status description

### Staging Workflow

Smart Commit enhances VS Code's native staging workflow:

#### Stage Change List

**Command**: Right-click a change list → **Stage Change List**

**Behavior:**
1. All files in the list are staged using `git add`
2. Files become visible in VS Code's "Staged Changes" section
3. Change list view updates to show staged status
4. Ready for commit via SCM input box

**Use Case:**
- Stage an entire logical group of changes at once
- Prepare for commit using VS Code's commit UI
- Compatible with commit message extensions

#### Individual File Staging

Users can still stage files individually:
- Via VS Code's file explorer: Right-click → Stage Changes
- Via command line: `git add file.ts`
- Via SCM view: Click the + icon

**Smart Commit's Response:**
- Detects the staging operation
- Assigns file to active change list (if enabled)
- Updates view to show staged status

### Post-Commit Cleanup

After a successful commit, Smart Commit automatically cleans up:

#### Detection Method

- Watches `repository.state.HEAD` for changes
- Compares current HEAD commit hash with previous
- When HEAD changes, a commit has occurred

#### Cleanup Actions

1. **Identify committed files**: Compare working directory with last known HEAD
2. **Remove from change lists**: Delete committed files from all lists
3. **Refresh UI**: Update tree view to reflect changes
4. **Log event**: Record cleanup in debug logs

#### Why This Matters

- Keeps change lists clean and relevant
- No manual cleanup required
- Committed work automatically "graduates" out of change lists
- Focus remains on uncommitted work

### Compatibility

Smart Commit works alongside other Git tools:

#### Command-Line Git

- All command-line operations are detected
- State synchronization is bidirectional
- No conflicts or race conditions

#### Other Extensions

- GitLens: Full compatibility
- Git Graph: Full compatibility
- GitHub Pull Requests: Full compatibility
- Any extension using VS Code's Git API: Compatible

#### External Tools

- Git GUI clients: Compatible
- IDEs with Git integration: Compatible
- Git hooks: Work as expected
- CI/CD systems: No interference

### Patch Management

Smart Commit allows you to share code snippets or transfer changes between lists using standard Git patches.

#### Creating Patches

You can generate a patch file from any change list, including untracked files.

**Methods:**
1. Right-click a change list -> **Create Patch...**
2. Choose destination:
   - **Copy to Clipboard**: For quick sharing via instant messaging
   - **Save to File**: Creates a `.patch` file on disk

**Features:**
- Includes all files in the list (Modified, Added, Deleted, Renamed)
- **Untracked Files**: Automatically detected and included (via `intent-to-add`)
- **Binary Files**: Handled correctly if Git supports them
- **Encoding**: Properly handles non-ASCII filenames

#### Applying Patches

Import changes from a patch file directly into a specific change list.

**Methods:**
1. Right-click a change list -> **Apply Patch...**
   - Or use Command Palette: `Smart Commit: Apply Patch`
2. Choose source:
   - **From Clipboard**: Pastes patch content from clipboard
   - **From File**: Select a `.patch` or `.diff` file from disk

**Behavior:**
- Applies the patch to the working directory (via `git apply`)
- Automatically detects affected files (including new/untracked ones)
- Moves all affected files to the target change list
- Preserves file tracking status where possible

---

## Commit Guard

The Commit Guard prevents accidentally committing mixed changes from different change lists.

### Purpose

**Problem:** You stage files from "Feature A", then accidentally stage a file from "Bugfix B", then commit everything together.

**Result:** Your commit mixes unrelated changes, making history harder to understand and revert.

**Solution:** Commit Guard validates staged files before commit and warns you about mixed change lists.

### How It Works

#### Pre-Commit Validation

When you trigger a guarded commit:

1. **Collect staged files**: Get all files in Git's staging area
2. **Map to change lists**: Determine which change list each file belongs to
3. **Check for mixed lists**: If files are from multiple lists, validation fails
4. **Show warning dialog**: Present options to the user

#### Warning Dialog

When mixed change lists are detected:

```
⚠️ Mixed Change Lists Detected

You're about to commit files from multiple change lists:
  • Feature A (3 files) ← primary
  • Bugfix B (1 file)

This might mix unrelated changes in a single commit.

[Unstage Extra Files]  [Commit Anyway]  [Cancel]
```

#### User Options

1. **Unstage Extra Files**
   - Unstages files not in the primary list
   - Primary list = list with most staged files
   - You can review and commit again

2. **Commit Anyway**
   - Proceeds with the commit as-is
   - Use when you intentionally want to commit multiple lists

3. **Cancel**
   - Aborts the commit
   - Nothing is unstaged or modified

### Using the Guard

#### Via Keybinding (Recommended)

**Keybinding:** `Ctrl+Enter` / `Cmd+Enter` in the SCM input box

**Prerequisites:**
- `commitGuard.enabled` must be `true` (default)
- `commitGuard.interceptCommit` must be `true`
- Requires VS Code restart after enabling `interceptCommit`

**Workflow:**
1. Stage files from a change list
2. Write commit message in SCM input box
3. Press `Ctrl+Enter` / `Cmd+Enter`
4. Validation runs before commit
5. Commit proceeds or shows warning

#### Via Command Palette

**Command:** `Smart Commit: Commit (with Guard)`

**Behavior:**
- Runs validation regardless of `interceptCommit` setting
- Shows warning dialog if mixed lists detected
- Always available

### Configuration

#### Enable/Disable Guard

**Setting:** `smartCommit.commitGuard.enabled`
- **Type:** Boolean
- **Default:** `true`
- **Effect:** When `false`, guard is completely bypassed

#### Intercept Native Commit

**Setting:** `smartCommit.commitGuard.interceptCommit`
- **Type:** Boolean
- **Default:** `false`
- **Effect:** When `true`, intercepts `Ctrl+Enter` commits
- **Requires:** VS Code restart to take effect

### Limitations

#### Cannot Intercept Commit Button

**Issue:** The native commit button (checkmark icon) in VS Code's SCM view cannot be intercepted.

**Reason:** VS Code's Extension API doesn't provide a stable hook for this button.

**Workaround:**
- Use `Ctrl+Enter` / `Cmd+Enter` keybinding instead
- Or use Command Palette: `Smart Commit: Commit (with Guard)`
- Train yourself to avoid the button when guard is needed

#### Partial Staging

VS Code allows staging specific lines of a file (hunks):
- Guard works at the file level, not hunk level
- If any part of a file is staged, the entire file is considered in validation
- Mixed hunks within a single file are not detected

---

## Status Bar Integration

The status bar provides at-a-glance information about your active change list.

### What's Displayed

**Content:** Active change list name

**Example:** `[Feature A]` or `[Default]`

**Truncation:** Long names are truncated to 16 characters
- Full name is shown in tooltip on hover

### Behavior

#### Click to Switch

Clicking the status bar item opens a quick-pick:
- Lists all available change lists
- Shows current active list with a checkmark
- Select a list to set it as active instantly

#### Automatic Updates

Status bar updates immediately when:
- Active list changes
- Active list is renamed
- Active list is deleted (shows new active list)

### Configuration

**Setting:** `smartCommit.showStatusBar`
- **Type:** Boolean
- **Default:** `true`
- **Effect:** When `false`, status bar item is hidden

**Visibility Context:**
- Only shown when a Git repository is open
- Hidden when no workspace is open

### Position

**Location:** Left side of the status bar
- **Priority:** 100 (near Git branch indicator)
- **Alignment:** Left
- **Color:** Uses default status bar colors

---

## User Interface

Smart Commit's UI is integrated into VS Code's Source Control Management (SCM) panel.

### Tree View

Located in the SCM panel, below the standard Git view:

#### View Structure

```
SOURCE CONTROL
  ├─ Git (native)
  │  ├─ Staged Changes
  │  └─ Changes
  └─ Change Lists (Smart Commit)
     ├─ Feature A (3 files)
     ├─ Default (2 files)
     └─ Bugfix B (1 file)
```

#### Collapsible Sections

- **Change list headers**: Click to expand/collapse
- **Directories** (tree mode): Click to expand/collapse
- **Expansion state**: Persisted across sessions

#### Badges

- **File count**: Shows number of files in each list
- **Status icons**: Git status for each file
- **Active marker**: Checkmark for active list

### Context Menus

Right-click menus provide quick access to operations:

#### Change List Context Menu

Available when right-clicking a change list header:

- **Set as Active Change List** (if not already active)
- **Stage Change List**
- **Commit Change List** (deprecated, may be removed)
- **Apply Patch** (placeholder, not yet implemented)
- **Create Patch** (placeholder, not yet implemented)
- **Rename Change List**
- **Delete Change List** (disabled for Default list)

#### File Context Menu

Available when right-clicking a file:

- **Move to Change List** (submenu with destinations)
- **Open File**
- **Open Diff** (shows changes compared to HEAD)
- **Discard Changes** (via Git)
- **Stage File** (via Git)

### Toolbar Buttons

Located in the view header:

| Icon | Command | Description |
|------|---------|-------------|
| ➕ | Create Change List | Opens name input |
| 🔄 | Toggle View Mode | Switch between list and tree |
| 🔃 | Refresh | Manually refresh view |

### Icons and Theming

Smart Commit uses VS Code's built-in icons:
- **Folder icon**: Change list containers
- **File icons**: Based on file extension (via icon theme)
- **Git status icons**: Standard Git decorations
- **Checkmark**: Active list indicator

**Theme Compatibility:**
- Works with all VS Code themes
- Respects theme colors for Git status
- No custom colors (uses theme-provided values)

---

## Event-Driven Architecture

Smart Commit is built on an event-driven architecture for reactive UI updates.

### Event Sources

#### Git Extension Events

| Event | Source | Trigger | Smart Commit Response |
|-------|--------|---------|----------------------|
| `onDidChange` | Git repository | File changes, Git operations | Refresh change lists, reassign files |
| `onDidStageFiles` | Git API | Files staged | Auto-assign to active list (if enabled) |
| `onDidCommit` | Git API | Successful commit | Cleanup committed files from lists |

#### Internal Events

| Event | Source | Trigger | Subscribers |
|-------|--------|---------|-------------|
| `onDidChangeState` | ChangeListManager | List created, renamed, deleted | TreeDataProvider, StatusBarIntegration |
| `onDidChangeActiveList` | ChangeListManager | Active list changed | StatusBarIntegration, Logger |
| `onDidMoveFile` | ChangeListManager | File moved between lists | TreeDataProvider |

#### Configuration Events

| Event | Source | Trigger | Smart Commit Response |
|-------|--------|---------|----------------------|
| `onDidChangeConfiguration` | VS Code | Settings changed | Re-read config, apply changes |

### Event Flow Example

User stages a file via command line:

1. User runs `git add src/app.ts`
2. Git modifies the index
3. Git extension detects index change
4. Fires `onDidChange` event
5. Smart Commit's `GitService` receives event
6. Detects `src/app.ts` is newly staged
7. Checks if file is in a change list (not assigned yet)
8. Gets active change list from `ChangeListManager`
9. Assigns file to active list
10. Fires `onDidChangeState` event
11. `TreeDataProvider` receives event
12. Refreshes tree view
13. UI shows file in active list

### Debouncing

To prevent excessive updates:
- Git state changes are debounced (150ms)
- Multiple rapid file changes trigger only one refresh
- User sees smooth, responsive UI without flickering

### Disposables

All event listeners are properly disposed:
- Registered in `context.subscriptions`
- Cleaned up on extension deactivation
- No memory leaks or zombie listeners

---

## State Persistence

Smart Commit persists all change list state across VS Code sessions.

### Storage Mechanism

Uses `ExtensionContext.workspaceState`:
- **Scope:** Workspace-specific (not global)
- **Format:** JSON serialization
- **Storage:** VS Code's internal storage (SQLite database)

### Persisted Data

#### Change List State

```typescript
interface ChangeListState {
  version: number;                    // Schema version (currently 1)
  lists: {
    id: string;                       // UUID v4
    name: string;                     // User-facing name
    isDefault: boolean;               // Default list flag
    isActive: boolean;                // Active status
    createdAt: number;                // Unix timestamp
    updatedAt: number;                // Unix timestamp
  }[];
  fileMapping: {
    [filePath: string]: string;       // filePath -> listId
  };
}
```

#### View State

- **View mode:** List or tree (per workspace)
- **Expansion state:** Which folders are expanded in tree mode
- **Selected items:** (Not persisted, cleared on restart)

### When State is Saved

State is written to disk:
- **On change list creation** (immediately)
- **On change list rename** (immediately)
- **On change list deletion** (immediately)
- **On file move** (immediately)
- **On active list change** (immediately)
- **On extension deactivation** (atomic final write)

### Atomic Writes

To prevent corruption:
- State is serialized to JSON
- Written atomically via VS Code's API
- No partial writes or race conditions

### Schema Versioning

State includes a `version` field:
- Current version: `1`
- Future versions can migrate old state
- Unsupported versions trigger reset (with user warning)

### Migration Strategy (Future)

When schema changes:
1. Detect old version on load
2. Apply transformation (e.g., add new fields with defaults)
3. Update version number
4. Save migrated state

### Cleanup

Stale data is cleaned up:
- **Non-existent files:** Removed from `fileMapping` on load
- **Orphaned lists:** Lists with no files are retained (user may add files later)
- **Invalid list IDs:** References to deleted lists are removed

---

## Multi-Root Workspace Support

Smart Commit is prepared for multi-root workspaces, though support is currently minimal.

### Current Status

**Version 0.0.1:**
- Single-root workspaces: Fully supported
- Multi-root workspaces: Basic support (each root has isolated state)

### How It Works

#### Independent State

Each workspace folder has its own:
- Change lists
- Active list
- File mappings
- View state

**No cross-repository operations** are supported:
- Cannot move files between roots
- Cannot create lists spanning multiple roots
- Each root is treated as a separate project

#### Repository Detection

On activation:
1. Smart Commit queries all workspace folders
2. For each folder, checks if a Git repository exists
3. Creates isolated context for each repository
4. Registers separate tree views (if multiple roots)

### Future Enhancements

Planned for future versions:
- **Unified view**: Single tree view showing all roots
- **Cross-repository lists**: Lists spanning multiple repositories (if related)
- **Root-specific settings**: Per-root configuration overrides

---

## Feature Limitations

### Known Limitations in v0.0.1

#### Commit Guard

- **Cannot intercept commit button**: Guard only works with keybindings, not the native commit button in SCM view
- **File-level only**: Cannot detect mixed hunks within a single file

#### Patch Management

- **Not implemented**: Patch application and generation are planned for v0.1.0
- Placeholder commands exist but show "not yet implemented" messages

#### Untracked Files

- **No special handling**: Untracked files appear in the Default list
- No dedicated "Unversioned Files" list yet

#### Change List Colors

- **Not supported**: Cannot assign custom colors to lists for visual identification
- Planned for v0.1.0

#### Change List Descriptions

- **Not editable**: Lists have descriptions in data model, but no UI to edit them
- Planned for future version

### Performance Considerations

#### Large Repositories

For repositories with 1000+ files:
- Initial load may take 1-2 seconds
- Tree view construction is fast but not optimized for extreme scale
- Debug logging can increase noise (disable if needed)

**Recommendation:** Use list mode for very large change sets

#### Many Change Lists

- No hard limit on number of lists
- UI remains responsive with 50+ lists
- Quick-pick dropdowns may become unwieldy with 100+ lists

### API Constraints

#### VS Code Extension API

- **Commit button interception**: Not possible with stable API
- **Partial staging detection**: Limited hunk-level introspection
- **Custom SCM providers**: Not used (Smart Commit extends Git, doesn't replace it)

#### Git Extension Dependency

- **Requires `vscode.git`**: Built-in Git extension must be active
- **No fallback**: If Git extension is disabled, Smart Commit won't work

---

## Summary

Smart Commit v0.0.1 delivers a robust foundation for change list management:

- ✓ **Complete core functionality**: All essential features implemented
- ✓ **Stable and tested**: Works across 7 different editors
- ✓ **Non-invasive**: Extends Git without replacing it
- ✓ **Persistent state**: Survives restarts and session changes
- ✓ **Intuitive UI**: Familiar patterns for JetBrains users
- ✓ **Extensible architecture**: Ready for future enhancements

**Next Steps:**
- See [USER_GUIDE.md](USER_GUIDE.md) for workflow examples
- See [CONFIGURATION.md](CONFIGURATION.md) for settings reference
- See [Roadmap](../README.md#roadmap) for upcoming features

Have a feature request? [Open an issue](https://github.com/maxinne-dev/vscode-smart-commit/issues)!

- [GitHub Repository](https://github.com/maxinne-dev/vscode-smart-commit)
