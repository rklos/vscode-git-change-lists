# Feature: Integrated Staging Workflow

> **Status: ✓ Implemented in v1.0.0**
>
> This document describes the integrated staging workflow that replaced direct commits with a staging-based flow that integrates with VS Code's native commit UI and other extensions.

## Overview

Instead of committing directly from the extension, the new workflow:
1. Stages files from a change list
2. Lets the user commit via VS Code's standard SCM input (which can be enhanced by other extensions)
3. Watches for external staging operations and auto-assigns files to the active change list
4. Guards against accidentally committing files from multiple change lists

## User Stories

### 1. Stage and Commit via Native UI
> As a user, I want to stage a change list and then use VS Code's commit input, so I can benefit from commit message extensions (AI suggestions, templates, etc.)

**Flow:**
1. User right-clicks a change list → "Stage Change List"
2. Extension stages all files in that list
3. User writes commit message in VS Code's SCM input
4. User clicks the commit button (or uses Ctrl+Enter)
5. After commit, extension removes committed files from the change list

### 2. External Staging Detection
> As a user, when I stage files manually or through other extensions, I want them automatically assigned to my active change list.

**Flow:**
1. User stages a file via VS Code's file explorer or command palette
2. Extension detects the staging operation
3. File is automatically assigned to the active change list
4. Tree view updates to show the file in the active list

### 3. Commit Guard
> As a user, I want to be warned if I'm about to commit files from different change lists, so I don't accidentally mix unrelated changes.

**Flow:**
1. User stages files from "Feature A" change list
2. User also stages a file from "Bugfix B" change list (manually or by accident)
3. User attempts to commit
4. Extension blocks the commit and shows a dialog:
   - "You're about to commit files from multiple change lists: Feature A (3 files), Bugfix B (1 file)"
   - Options: "Unstage Bugfix B files" | "Commit Anyway" | "Cancel"
5. If user chooses "Unstage", extension unstages the extra files
6. If user chooses "Commit Anyway", proceed with the commit

## Technical Implementation

### 1. Watching for Git Index Changes

```typescript
// In GitService
private watchIndexChanges(): void {
  // Listen to repository state changes
  this.repository.state.onDidChange(() => {
    const stagedFiles = this.repository.state.indexChanges;
    this.handleStagedFilesChange(stagedFiles);
  });
}

private handleStagedFilesChange(stagedFiles: Change[]): void {
  for (const file of stagedFiles) {
    const existingList = this.changeListManager.getListForFile(file.uri.fsPath);
    if (!existingList) {
      // File was staged externally, assign to active list
      const activeList = this.changeListManager.getActiveList();
      this.changeListManager.assignFile(file.uri.fsPath, activeList.id);
    }
  }
}
```

### 2. Pre-Commit Hook via Git Extension

The VS Code Git extension doesn't expose a pre-commit hook API. Instead, we can:

**Option A: Override the commit command**
- Register a command that intercepts `git.commit`
- Check staged files before allowing commit
- Restore original behavior after validation

**Option B: Watch for commit attempts**
- Monitor `repository.state.HEAD` for changes
- Detect when a commit is about to happen
- Show warning if guard conditions are met

**Option C: Use Git hooks (recommended)**
- Install a `pre-commit` hook in `.git/hooks/`
- Hook communicates with extension via file or socket
- Extension can block or allow the commit

**Recommended: Option A (Command Override)**
```typescript
// Register a wrapper around git.commit
vscode.commands.registerCommand('smartCommit.guardedCommit', async () => {
  const validation = await this.validateStagedFiles();

  if (!validation.valid) {
    const choice = await this.showGuardDialog(validation);
    if (choice === 'unstage') {
      await this.unstageExtraFiles(validation.extraFiles);
    } else if (choice === 'cancel') {
      return;
    }
  }

  // Proceed with original commit
  await vscode.commands.executeCommand('git.commit');
});
```

### 3. Staged Files Validation

```typescript
interface ValidationResult {
  valid: boolean;
  stagedLists: Map<string, string[]>;  // listId -> filePaths
  extraFiles: string[];                 // Files not in primary list
  primaryListId: string;                // List with most staged files
}

function validateStagedFiles(): ValidationResult {
  const stagedFiles = this.gitService.getStagedFiles();
  const stagedLists = new Map<string, string[]>();

  for (const file of stagedFiles) {
    const listId = this.changeListManager.getListForFile(file);
    if (!stagedLists.has(listId)) {
      stagedLists.set(listId, []);
    }
    stagedLists.get(listId)!.push(file);
  }

  // Find the list with most files (primary)
  let primaryListId = '';
  let maxFiles = 0;
  for (const [listId, files] of stagedLists) {
    if (files.length > maxFiles) {
      maxFiles = files.length;
      primaryListId = listId;
    }
  }

  // Collect extra files (not in primary list)
  const extraFiles: string[] = [];
  for (const [listId, files] of stagedLists) {
    if (listId !== primaryListId) {
      extraFiles.push(...files);
    }
  }

  return {
    valid: stagedLists.size <= 1,
    stagedLists,
    extraFiles,
    primaryListId,
  };
}
```

### 4. Post-Commit Cleanup

```typescript
// Watch for successful commits
this.repository.state.onDidChange(() => {
  const currentHead = this.repository.state.HEAD?.commit;
  if (currentHead !== this.lastKnownHead) {
    // A commit happened
    this.handleCommitCompleted();
    this.lastKnownHead = currentHead;
  }
});

private handleCommitCompleted(): void {
  // Get files that were just committed (no longer staged, not modified)
  const committedFiles = this.getRecentlyCommittedFiles();

  for (const file of committedFiles) {
    // Remove from change list tracking
    this.changeListManager.removeFile(file);
  }

  this.treeDataProvider.refresh();
}
```

## Configuration

### New Settings

```json
{
  "smartCommit.commitGuard.enabled": {
    "type": "boolean",
    "default": true,
    "description": "Warn when staging files from multiple change lists before commit"
  },
  "smartCommit.commitGuard.interceptCommit": {
    "type": "boolean",
    "default": false,
    "description": "Intercept the native Git commit command to apply the commit guard"
  },
  "smartCommit.autoAssignStagedFiles": {
    "type": "boolean",
    "default": true,
    "description": "Automatically assign externally staged files to the active change list"
  }
}
```

### Commit Guard Limitation

**Important:** When `commitGuard.interceptCommit` is enabled, the guard only intercepts commits made via:
- **Keyboard shortcut** (`Ctrl+Enter` / `Cmd+Enter`) in the SCM input box
- **Command palette** (`Smart Commit: Commit (with Guard)`)

Clicking the native **commit button** (checkmark icon) in the SCM view will **not** trigger the guard. This is a VS Code API limitation - there is no stable API to intercept the native commit button.

**Workaround:** Train yourself to use `Ctrl+Enter` instead of the button, or always use "Stage Change List" first and review staged files before committing.

### Updated Constants

```typescript
export const CONFIG = {
  // ... existing
  COMMIT_GUARD_ENABLED: 'commitGuard.enabled',
  AUTO_ASSIGN_STAGED: 'autoAssignStagedFiles',
} as const;
```

## UI Changes

### 1. Rename Command
- Old: "Commit Change List"
- New: "Stage Change List" (already exists, becomes primary action)

### 2. Remove Direct Commit
- Remove `smartCommit.commitList` command
- Keep `smartCommit.stageList` as the main action

### 3. Guard Dialog

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Mixed Change Lists Detected                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  You're about to commit files from multiple change lists:   │
│                                                             │
│  • Feature A (3 files) ← primary                            │
│  • Bugfix B (1 file)                                        │
│                                                             │
│  This might mix unrelated changes in a single commit.       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Unstage Extra Files]  [Commit Anyway]  [Cancel]           │
└─────────────────────────────────────────────────────────────┘
```

### 4. Inline Actions Update

Change list header buttons:
- **Before:** ➕ Create | 🔄 Toggle View | ↻ Refresh
- **After:** Same (Stage is via context menu or inline button on each list)

Each change list inline action:
- **Before:** ✓ Commit
- **After:** ⬆️ Stage

## Implementation Checklist

> **All items completed in v0.0.1**

- [x] Add `autoAssignStagedFiles` configuration option ✓
- [x] Add `commitGuard.enabled` configuration option ✓
- [x] Implement Git index change watcher in `GitService` ✓
- [x] Implement auto-assignment of externally staged files ✓
- [x] Implement `validateStagedFiles()` function ✓
- [x] Create guard dialog UI ✓
- [x] Implement command override for commit guard ✓
- [x] Implement `unstageFiles()` function ✓
- [x] Implement post-commit cleanup (remove committed files from lists) ✓
- [x] Remove or repurpose `commitList` command ✓
- [x] Update `stageList` to be the primary action ✓
- [x] Update inline action icons ✓
- [x] Update documentation ✓

## Edge Cases

1. **Empty active list**: If no active list exists when external staging happens, create a new "Staged Changes" list or use Default.

2. **File in multiple operations**: If a file is staged, unstaged, and staged again rapidly, debounce the detection.

3. **Partial staging**: VS Code allows staging specific lines. The guard should still work at the file level.

4. **Amend commits**: The guard should also apply when amending.

5. **Merge/rebase in progress**: Disable the guard during merge/rebase operations.

## Migration

For existing users:
- The `commitList` command will show a deprecation notice pointing to the new workflow
- After 2 minor versions, remove the command entirely

---

## See Also

- [USER_GUIDE.md](USER_GUIDE.md) - Practical usage instructions for staging workflow
- [FEATURES.md](FEATURES.md#commit-guard) - Complete commit guard feature documentation
- [CONFIGURATION.md](CONFIGURATION.md) - Configuration options for staging and commit guard
