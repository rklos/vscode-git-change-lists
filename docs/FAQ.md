# Smart Commit FAQ

Frequently asked questions and troubleshooting guide.

---

## Table of Contents

- [General Questions](#general-questions)
- [Usage Questions](#usage-questions)
- [Technical Questions](#technical-questions)
- [Troubleshooting](#troubleshooting)
- [Compatibility](#compatibility)

---

## General Questions

### What is a change list?

A **change list** is a named container that groups related uncommitted file changes together. Think of it as a way to organize your Git working directory into logical categories (features, bug fixes, experiments, etc.) instead of just "staged" and "unstaged".

**Example:**
```
📁 Feature: User Login (3 files)
   - auth.ts
   - login.tsx
   - api/users.ts

📁 Bugfix: Validation (1 file)
   - validators.ts

📁 Default (2 files)
   - README.md
   - package.json
```

---

### How is this different from Git staging?

Git staging is a binary state: files are either staged or unstaged. Change lists add a layer of *organization* on top of Git:

**Git Staging:**
- Staged: Ready to commit
- Unstaged: Not ready to commit

**Change Lists:**
- Organize unstaged files into logical groups
- Multiple groups can coexist
- Stage entire groups at once
- Commit groups separately

**They work together:**
1. Organize files into change lists
2. Stage a change list
3. Commit the staged files
4. Repeat for other change lists

---

### Why not just use Git branches?

Branches are for long-lived parallel work streams. Change lists are for *organizing work within a branch*.

**Use branches when:**
- Feature will take days or weeks
- Need to share work with team
- Want to isolate from main codebase
- Need to merge later

**Use change lists when:**
- Working on multiple small tasks simultaneously
- Need to commit different parts separately
- Organizing code review commits
- Trying experiments without branch overhead

**Best Practice:** Use both! Change lists organize commits within a branch.

---

### Can I use this with other Git extensions?

Yes! Smart Commit is designed to work alongside other Git extensions:

**Compatible with:**
- GitLens (full compatibility)
- Git Graph (full compatibility)
- GitHub Pull Requests (full compatibility)
- GitKraken (via Git operations)
- Any extension using VS Code's Git API

**Works with external tools:**
- Command-line Git
- Git GUI clients
- Tower, SourceTree, GitKraken apps
- CI/CD systems

Smart Commit *extends* Git, it doesn't replace it.

---

### Does this modify my Git history or repository?

**No!** Smart Commit only organizes your *uncommitted* changes. It doesn't:

- ❌ Modify commit history
- ❌ Alter `.git` directory (except standard operations like staging)
- ❌ Change remote repository
- ❌ Affect collaboration with teammates

**What it does:**
- ✓ Organizes working directory files
- ✓ Uses standard Git commands (stage, commit)
- ✓ Stores organization metadata in VS Code's workspace storage
- ✓ Works invisibly to Git and other tools

---

### Where is the change list data stored?

Change list organization is stored in **VS Code's workspace storage**:

**Storage Location:**
- Scope: Per-workspace (not global, not in Git repo)
- Format: JSON in VS Code's internal SQLite database
- Path: Managed by VS Code, not directly accessible

**What's stored:**
- Change list names and IDs
- Which files belong to which lists
- Active list designation
- View mode and expansion state

**What's NOT stored in Git:**
- Change lists are local to your machine
- Not shared with teammates
- Not committed to repository
- Each developer has independent organization

---

## Usage Questions

### How do I move files between change lists?

**Three methods:**

**1. Drag-and-Drop (Easiest)**
- Click and hold a file
- Drag to destination change list
- Release when highlighted

**2. Context Menu**
- Right-click a file
- Select "Move to Change List"
- Choose destination

**3. Multi-Select**
- Select multiple files (Ctrl+Click)
- Right-click any selected file
- Move all at once

See [USER_GUIDE.md](USER_GUIDE.md#moving-files-between-lists) for details.

---

### Why aren't my files showing up in change lists?

**Common causes:**

1. **No Git repository**
   - Solution: Initialize Git (`git init`) or open a Git repo

2. **Files not modified**
   - Solution: Make a change, add a file, or modify existing files

3. **Files in .gitignore**
   - Solution: Unignored files don't appear (expected behavior)

4. **Git extension disabled**
   - Solution: Enable built-in Git extension

5. **Extension not activated**
   - Solution: Check Output → Smart Commit for errors

**Debug Steps:**
1. Check Git status: `git status`
2. Enable debug logging: `smartCommit.debug.enableLogging: true`
3. Check Output → Smart Commit
4. Refresh manually (click refresh button)

---

### What's the difference between active and default lists?

**Default List:**
- Special system list
- Cannot be deleted (can be renamed)
- Captures unassigned changes
- Fallback for files without explicit assignment

**Active List:**
- User-designated list (can be any list, including Default)
- Receives newly detected changes automatically
- Only one list can be active at a time
- Marked with checkmark icon
- Shown in status bar

**Example:**
```
Active List: "Feature X"

When you modify a file:
  → File goes to "Feature X" (active)

When you stage a file externally:
  → File assigns to "Feature X" (if autoAssignStagedFiles is enabled)

Unassigned files:
  → Fall back to Default list
```

---

### Can I commit without staging first?

No, Smart Commit follows Git's standard workflow:

**Workflow:**
1. Organize files into change lists (Smart Commit)
2. Stage a change list (Smart Commit → Git staging area)
3. Write commit message (VS Code Git UI)
4. Commit staged files (Git)

**Why?**
- Staging is a Git concept, not a Smart Commit concept
- VS Code's commit UI expects staged files
- Compatible with all Git tools and workflows

---

### Why can't I delete the Default list?

The Default list is a **system list** that serves as a fallback:

**Reasons:**
- Ensures all changes are always visible
- Captures unassigned files
- Prevents "lost" changes
- Provides a starting point for organization

**You can:**
- Rename it to anything you like
- Move files out of it
- Set other lists as active (so new files bypass it)

**You cannot:**
- Delete it
- Remove its fallback behavior

---

### How do I organize many files quickly?

**Batch Operations:**

**1. Multi-Select**
```
- Ctrl+Click: Toggle files one by one
- Shift+Click: Select range
- Ctrl+A: Select all in current list
- Right-click → Move to Change List
```

**2. Create Lists First**
```
- Plan your organization (Feature A, Bug B, Refactor C)
- Create all lists upfront
- Batch move files to each list
```

**3. Use Active List**
```
- Set "Feature A" as active
- Stage files related to Feature A externally (command line)
- They auto-assign to Feature A
- Switch to "Bug B" and repeat
```

---

## Technical Questions

### Does this work with multi-root workspaces?

Yes, with **isolated state** per workspace folder:

**Current Support (v0.0.1):**
- Each root has independent change lists
- Cannot move files between roots
- Each root's state is stored separately

**Future Plans:**
- Unified view across all roots
- Cross-repository change lists (if related)

---

### What happens if I commit outside VS Code?

Smart Commit detects external commits and cleans up automatically:

**Example:**
```bash
git add .
git commit -m "feat: Add feature"
```

**Smart Commit Response:**
1. Detects HEAD change (commit happened)
2. Identifies which files were committed
3. Removes those files from change lists
4. Updates tree view
5. Logs cleanup event

**Result:** Your change lists stay clean without manual intervention.

---

### Does Smart Commit work with Git command line?

Yes! Full bidirectional compatibility:

**CLI → Smart Commit:**
- `git add file.ts` → Detects staging, assigns to active list
- `git commit` → Detects commit, cleans up change lists
- `git reset` → Detects unstaging, updates view

**Smart Commit → CLI:**
- Create/move files in UI → No effect on Git (organization only)
- Stage change list → Files visible in `git status` as staged
- Commit via UI → Standard Git commit (visible in `git log`)

**Best of Both Worlds:**
- Use GUI for organization
- Use CLI for commands you prefer
- No conflicts or sync issues

---

### Can other team members see my change lists?

**No.** Change lists are local to your machine:

**Not Shared:**
- Change list names
- File assignments
- Active list designation
- View preferences

**Shared (via Git):**
- Commits (once you commit)
- Staged files (if you push staging area)
- Repository history

**Collaboration:**
- Each developer organizes independently
- Commits are the synchronization point
- No "change list sync" needed or desired

---

## Troubleshooting

### Extension not activating

**Symptoms:** Change Lists view doesn't appear.

**Solutions:**

1. **Open a Git repository**
   - Extension only activates with Git repos
   - Run `git init` or open existing repo

2. **Check activation events**
   - View → Output → Select "Smart Commit"
   - Look for activation errors

3. **Restart VS Code**
   - Developer: Reload Window
   - Or close and reopen

4. **Verify Git extension is enabled**
   - Extensions → Search "Git"
   - Built-in Git should be enabled

---

### Files not appearing in change lists

**Already covered above.** See [Why aren't my files showing up?](#why-arent-my-files-showing-up-in-change-lists)

---

### Commit guard not working

**Symptoms:** Can commit mixed change lists without warning.

**Solutions:**

1. **Enable guard**
   ```json
   {
     "smartCommit.commitGuard.enabled": true
   }
   ```

2. **Enable interception** (optional but recommended)
   ```json
   {
     "smartCommit.commitGuard.interceptCommit": true
   }
   ```
   Restart VS Code after enabling.

3. **Use keybinding, not button**
   - Press `Ctrl+Enter` / `Cmd+Enter` (guard intercepts this)
   - Or: Command Palette → "Smart Commit: Commit (with Guard)"
   - Don't click native commit button (guard can't intercept it)

4. **Check logs**
   - Output → Smart Commit
   - Look for guard activation messages

---

### Status bar not showing

**Symptoms:** No `[Active List]` indicator in status bar.

**Solutions:**

1. **Enable status bar**
   ```json
   {
     "smartCommit.showStatusBar": true
   }
   ```

2. **Open a Git repository**
   - Status bar only appears with active repos

3. **Check workspace**
   - Status bar is per-workspace setting
   - Check workspace settings aren't overriding

---

### Drag-and-drop not working

**Symptoms:** Can't drag files between lists.

**Solutions:**

1. **Use context menu instead**
   - Right-click → Move to Change List
   - Drag-and-drop is optional convenience

2. **Check for conflicts**
   - Another extension may interfere
   - Disable other extensions temporarily to test

3. **Restart VS Code**
   - Tree view controller may need refresh

---

### Performance issues with large repos

**Symptoms:** Slow tree view updates, lag when switching views.

**Solutions:**

1. **Use list mode**
   ```json
   {
     "smartCommit.defaultViewMode": "list"
   }
   ```
   - List mode has less overhead than tree mode

2. **Disable debug logging**
   ```json
   {
     "smartCommit.debug.enableLogging": false
   }
   ```
   - Reduces log volume in Output channel

3. **Organize aggressively**
   - Don't let change lists grow beyond 50 files
   - Commit more frequently
   - Create granular change lists

4. **Upgrade hardware**
   - More RAM helps with large repos
   - SSD improves Git operations

---

### Settings not taking effect

**Symptoms:** Changed settings but behavior unchanged.

**Solutions:**

1. **Check setting scope**
   - Workspace settings override user settings
   - Check both User and Workspace settings

2. **Restart VS Code** (for some settings)
   - `commitGuard.interceptCommit` requires restart
   - View mode changes are immediate

3. **Verify JSON syntax**
   - Invalid JSON causes settings to be ignored
   - Check for syntax errors in `settings.json`

4. **Clear and re-apply**
   - Remove setting entirely
   - Reload VS Code
   - Re-add setting

---

## Compatibility

### Which VS Code versions are supported?

**Minimum:** 1.103.0
**Tested:** 1.103.0+
**Recommended:** Latest stable

**Version Check:**
- Help → About → Version number
- Update: Help → Check for Updates

---

### Does this work on Linux/macOS/Windows?

**Yes!** Full cross-platform support:

**Tested On:**
- Windows 10/11
- macOS 12+ (Monterey, Ventura, Sonoma)
- Linux (Ubuntu, Fedora, Arch)

**Platform-specific notes:**
- Keybindings adapt (Ctrl vs Cmd)
- File paths handled correctly (\ vs /)
- No platform-specific bugs known

---

### Which editors are supported?

See [INSTALLATION.md](INSTALLATION.md#supported-editors) for full list:

- Visual Studio Code ✓
- Cursor ✓
- Kiro ✓
- Windsurf ✓
- Trae ✓
- VSCodium ✓
- Google Antigravity ✓

All editors based on VS Code's Extension API are compatible.

---

### Can I use this with WSL (Windows Subsystem for Linux)?

**Yes!** Smart Commit works with remote development:

**Setup:**
1. Install Remote - WSL extension
2. Connect to WSL
3. Install Smart Commit in WSL (not Windows)
4. Open Git repo in WSL

**Note:** Extension must be installed in remote environment, not local Windows.

**Same applies to:**
- Remote - SSH
- Remote - Containers
- GitHub Codespaces

---

### Does this work with GitHub Codespaces?

**Yes!** Install Smart Commit in the Codespace:

1. Open Codespace
2. Extensions → Search "Smart Commit"
3. Install
4. Works identical to local VS Code

---

## Still Have Questions?

- **Check Documentation:** [README.md](../README.md), [USER_GUIDE.md](USER_GUIDE.md), [FEATURES.md](FEATURES.md)
- **Search Issues:** [GitHub Issues](https://github.com/maxinne-dev/vscode-smart-commit/issues)
- **Ask Community:** [GitHub Discussions](https://github.com/maxinne-dev/vscode-smart-commit/discussions)
- **Report Bug:** [Open an Issue](https://github.com/maxinne-dev/vscode-smart-commit/issues/new)

---

**Tip:** Enable debug logging when troubleshooting! See [DEBUGGING.md](DEBUGGING.md) for details.
