# Smart Commit User Guide

Step-by-step guide to using Smart Commit effectively in your workflow.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Operations](#basic-operations)
- [Common Workflows](#common-workflows)
- [Advanced Techniques](#advanced-techniques)
- [Tips and Best Practices](#tips-and-best-practices)
- [Keyboard Shortcuts Reference](#keyboard-shortcuts-reference)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Getting Started

### First Time Setup

After [installing Smart Commit](INSTALLATION.md), follow these steps to get started:

#### Step 1: Open a Git Repository

Smart Commit requires an active Git repository:

- Open an existing Git project folder
- Or initialize a new repository:
  ```bash
  git init
  ```

#### Step 2: Locate the Change Lists View

1. Open Source Control panel: `Ctrl+Shift+G` / `Cmd+Shift+G`
2. Look for the **Change Lists** section
3. You should see a "Default" change list

#### Step 3: Make Your First Change

1. Modify an existing file or create a new one
2. The file appears in the "Default" change list automatically
3. You're ready to organize!

---

## Basic Operations

### Creating a Change List

Create named containers for organizing your work:

**Method 1: Via View Header**

1. Click the **+** button in the Change Lists view header
2. Enter a descriptive name (e.g., "Feature: User Login")
3. Press Enter

**Method 2: Via Command Palette**

1. Open Command Palette: `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type "Smart Commit: Create Change List"
3. Press Enter
4. Enter your change list name

**Method 3: Via Context Menu**

1. Right-click in empty space of the Change Lists view
2. Select **Create Change List**
3. Enter name

**Naming Tips:**
- Use descriptive names that indicate the purpose
- Include issue/ticket numbers: "Bugfix: #123 Login Error"
- Categorize: "Feature:", "Bugfix:", "Refactor:", etc.
- Keep names under 30 characters for readability

---

### Moving Files Between Lists

Organize your changes by moving files to appropriate lists:

**Method 1: Drag-and-Drop**

1. Click and hold a file in any change list
2. Drag to the destination change list
3. Release when the target list is highlighted
4. File moves instantly

**Method 2: Context Menu**

1. Right-click a file
2. Select **Move to Change List**
3. Choose destination from submenu
4. Or select **Create New...** to create a list on-the-fly

**Method 3: Multi-Select**

1. Select multiple files:
   - `Ctrl+Click` / `Cmd+Click` to toggle individual files
   - `Shift+Click` to select a range
2. Right-click any selected file
3. Select **Move to Change List**
4. All selected files move together

---

### Setting the Active List

The active list automatically receives new changes:

**Method 1: Context Menu**

1. Right-click a change list
2. Select **Set as Active Change List**
3. The list is marked with a checkmark

**Method 2: Keybinding**

1. Press `Ctrl+Shift+L` / `Cmd+Shift+L`
2. Quick-pick shows all lists
3. Select the list to activate
4. Press Enter

**Method 3: Status Bar**

1. Click the status bar item (shows current active list)
2. Quick-pick appears
3. Select new active list

**When to Use:**
- Set as active when starting work on a specific task
- New modifications will automatically appear in this list
- Files staged externally also assign to the active list

---

### Renaming a Change List

Change list names can be updated anytime:

1. Right-click a change list
2. Select **Rename Change List**
3. Enter new name
4. Press Enter

**Notes:**
- All file associations are preserved
- Active status remains if the list is active
- Status bar updates immediately

---

### Deleting a Change List

Remove lists you no longer need:

1. Right-click a change list (not the Default list)
2. Select **Delete Change List**
3. Confirm if the list is non-empty
4. Files are reassigned to the Default list

**Cannot Delete:**
- The Default list (permanently protected)
- You can rename it, but not delete it

---

### Staging and Committing

Prepare changes for commit:

**Step 1: Stage a Change List**

1. Right-click a change list
2. Select **Stage Change List**
3. All files in the list are staged
4. Check VS Code's "Staged Changes" section to verify

**Step 2: Write Commit Message**

1. Navigate to the standard Git view (above Change Lists)
2. Focus the commit message input box
3. Type your commit message

**Step 3: Commit**

**Option A: With Guard (Recommended)**

Press `Ctrl+Enter` / `Cmd+Enter` in the commit input box
- If `commitGuard.interceptCommit` is enabled, validation runs
- Warns if files from multiple lists are staged
- Options: Unstage extras, Commit anyway, or Cancel

**Option B: Without Guard**

Click the checkmark button in the Git view
- Standard commit (no validation)
- All staged files are committed

**Step 4: Post-Commit**

- Smart Commit automatically removes committed files from change lists
- Your change list is now empty and ready for new work

---

### Switching View Modes

Toggle between flat and hierarchical displays:

**Via View Header:**

1. Click the tree/list icon button in the Change Lists header
2. View switches instantly

**Via Command Palette:**

1. `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Run: `Smart Commit: Toggle List/Tree View`

**List Mode:**
- Flat display of all files
- Fast scanning
- Good for small change sets (<50 files)

**Tree Mode:**
- Hierarchical directory structure
- Project context
- Good for large change sets or architectural changes

**State Persistence:**
- Your choice is remembered per workspace
- Expansion state saved separately for each mode

---

## Common Workflows

### Workflow 1: Parallel Feature Development

Work on multiple features without premature commits.

**Scenario:** You're developing two features simultaneously: "User Authentication" and "Dark Mode Theme".

**Steps:**

1. **Create Change Lists**
   ```
   - Create "Feature: Authentication"
   - Create "Feature: Dark Mode"
   ```

2. **Start with Authentication**
   ```
   - Set "Feature: Authentication" as active
   - Implement login screen → files auto-assign to this list
   - Implement JWT validation → files auto-assign to this list
   ```

3. **Switch to Dark Mode**
   ```
   - Set "Feature: Dark Mode" as active
   - Create theme provider → files auto-assign to this list
   - Update UI components → files auto-assign to this list
   ```

4. **Toggle Between Features**
   ```
   - Click status bar to quickly switch active lists
   - Files stay organized in their respective lists
   - No confusion about which changes belong where
   ```

5. **Commit Each Feature Separately**
   ```
   - Stage "Feature: Authentication"
   - Commit with message: "feat: Implement user authentication"
   - Stage "Feature: Dark Mode"
   - Commit with message: "feat: Add dark mode theme"
   ```

**Benefits:**
- Clean, focused commits
- Easy to review changes for each feature
- Can commit one feature while continuing work on the other

---

### Workflow 2: Hot Fix During Feature Development

Handle urgent bug fixes without disrupting feature work.

**Scenario:** You're working on "Feature X" when a critical bug is reported.

**Steps:**

1. **Current State**
   ```
   - Active list: "Feature X"
   - Files in progress: auth.ts, profile.tsx, api.ts
   ```

2. **Create Hotfix List**
   ```
   - Create "Hotfix: Critical Bug #456"
   - Set as active immediately
   ```

3. **Fix the Bug**
   ```
   - Identify bug file: validation.ts
   - Make fix → file auto-assigns to Hotfix list
   - Test fix → test file auto-assigns to Hotfix list
   ```

4. **Commit Hotfix Immediately**
   ```
   - Stage "Hotfix: Critical Bug #456"
   - Commit: "fix: Resolve validation crash (#456)"
   - Push to remote
   ```

5. **Return to Feature Work**
   ```
   - Set "Feature X" as active again
   - Continue where you left off
   - Feature X files remain untouched in their list
   ```

**Benefits:**
- Clean separation of hotfix and feature work
- Hotfix can be deployed independently
- Feature work remains intact and uncommitted

---

### Workflow 3: Code Review Preparation

Organize changes into logical commits for easier review.

**Scenario:** You've made many changes that should be separated into multiple commits for clarity.

**Steps:**

1. **Review Current Changes**
   ```
   - All changes are in "Default" list
   - 15 files modified across database, API, and UI layers
   ```

2. **Create Logical Groupings**
   ```
   - Create "Refactor: Database Layer"
   - Create "API: New Endpoints"
   - Create "UI: Component Updates"
   - Create "Docs: API Documentation"
   ```

3. **Organize Files**
   ```
   - Drag database files to "Refactor: Database Layer"
   - Drag API files to "API: New Endpoints"
   - Drag UI files to "UI: Component Updates"
   - Drag docs to "Docs: API Documentation"
   ```

4. **Commit in Logical Order**
   ```
   1. Stage "Refactor: Database Layer" → Commit
   2. Stage "API: New Endpoints" → Commit
   3. Stage "UI: Component Updates" → Commit
   4. Stage "Docs: API Documentation" → Commit
   ```

5. **Create Pull Requests**
   ```
   - Each commit is focused and reviewable
   - Reviewers can understand changes incrementally
   - Easier to discuss and request changes
   ```

**Benefits:**
- Clear commit history
- Easier code review
- Logical progression of changes
- Can revert individual changes if needed

---

### Workflow 4: Experimental Changes

Isolate experimental code without creating branches.

**Scenario:** You want to try a performance optimization but aren't sure if it'll work.

**Steps:**

1. **Create Experiment List**
   ```
   - Create "Experiment: Cache Optimization"
   - Set as active
   ```

2. **Implement Experiment**
   ```
   - Add caching layer → auto-assigns to Experiment list
   - Modify data access → auto-assigns to Experiment list
   - Update tests → auto-assigns to Experiment list
   ```

3. **Test Results**
   ```
   - Run benchmarks
   - Measure performance improvement
   ```

4. **Decision Point**

   **If Successful:**
   ```
   - Stage "Experiment: Cache Optimization"
   - Commit: "perf: Add caching layer for 50% speedup"
   - Celebrate!
   ```

   **If Failed:**
   ```
   - Delete "Experiment: Cache Optimization" list
   - Discard all changes in the list
   - No cleanup required, no branch to delete
   ```

**Benefits:**
- No branch overhead
- Easy to discard entire experiment
- Can have multiple experiments running simultaneously
- Clean separation from production code

---

### Workflow 5: Context Switching

Quickly switch between different tasks throughout the day.

**Scenario:** You work on multiple tasks: features, bugs, code reviews, documentation.

**Setup:**

```
- "Feature: User Dashboard" (active)
- "Bugfix: Form Validation"
- "Code Review: PR #123"
- "Docs: API Guide"
```

**Usage Pattern:**

**Morning: Feature Work**
```
- Status bar shows: [Feature: User Dashboard]
- Make changes, they auto-assign to Feature list
- 10:00 AM: Bug report comes in
```

**Mid-Morning: Bug Fix**
```
- Click status bar → Select "Bugfix: Form Validation"
- Fix bug, files auto-assign to Bugfix list
- Stage Bugfix list → Commit → Push
- Click status bar → Return to "Feature: User Dashboard"
```

**Afternoon: Code Review**
```
- Reviewer requests changes to your PR
- Click status bar → Select "Code Review: PR #123"
- Make requested changes
- Stage Code Review list → Amend commit → Force push
- Return to "Feature: User Dashboard"
```

**End of Day: Documentation**
```
- Click status bar → Select "Docs: API Guide"
- Update documentation
- Leave uncommitted for tomorrow
```

**Benefits:**
- Seamless context switching
- No mental overhead tracking what belongs where
- Status bar always shows current context
- Can resume any task instantly

---

## Advanced Techniques

### Using the Commit Guard Effectively

Protect yourself from mixed commits:

**Setup:**

```json
{
  "smartCommit.commitGuard.enabled": true,
  "smartCommit.commitGuard.interceptCommit": true
}
```

Restart VS Code after enabling.

**Usage:**

1. Stage files from "Feature A"
2. Accidentally stage a file from "Bugfix B"
3. Press `Ctrl+Enter` / `Cmd+Enter` to commit
4. Guard shows warning:
   ```
   ⚠️ Mixed Change Lists Detected
   You're about to commit files from:
     • Feature A (3 files) ← primary
     • Bugfix B (1 file)

   [Unstage Extra Files]  [Commit Anyway]  [Cancel]
   ```
5. Choose **Unstage Extra Files** to keep commit clean

**Best Practices:**
- Always use `Ctrl+Enter` instead of the commit button
- Review staged files before committing
- Use guard as a safety net, not a primary workflow

---

### Batch File Operations

Move many files efficiently:

**Multi-Select Techniques:**

```
- Ctrl+Click / Cmd+Click: Toggle individual files
- Shift+Click: Select range from last selected to clicked file
- Ctrl+A / Cmd+A: Select all in current list (when view focused)
```

**Batch Move:**

1. Select 10 files in "Default" list
2. Right-click any selected file
3. Move to Change List → "Feature X"
4. All 10 files move at once

---

### External Git Integration

Smart Commit works alongside command-line Git:

**Scenario: Stage via Command Line**

```bash
git add src/authentication.ts
```

**Smart Commit Response:**
- Detects staging operation
- Assigns file to active change list
- Updates tree view

**Scenario: Commit via Command Line**

```bash
git commit -m "feat: Add authentication"
```

**Smart Commit Response:**
- Detects commit
- Removes committed files from change lists
- Cleans up automatically

**Best Practices:**
- Mix GUI and CLI freely
- Smart Commit stays synchronized
- No manual cleanup required

---

### Working with Large Changelists

Optimize for large projects:

**Use List Mode:**
- Tree construction overhead is higher
- List mode renders faster
- Switch to tree only when needed

**Disable Debug Logging:**
```json
{
  "smartCommit.debug.enableLogging": false
}
```

**Organize Aggressively:**
- Don't let Default list grow beyond 20 files
- Create granular change lists
- Commit frequently

---

## Tips and Best Practices

### Naming Conventions

**Use Prefixes:**
```
✓ Feature: User Profile
✓ Bugfix: Login Timeout
✓ Refactor: Database Access
✓ Docs: API Reference
```

**Include Issue Numbers:**
```
✓ Hotfix: #456 Validation Error
✓ Feature: #123 Dark Mode
```

**Be Descriptive:**
```
✗ Stuff
✗ Changes
✗ Fix
✓ Bugfix: Resolve login timeout on slow networks
```

---

### When to Create a New List

**Create a new list when:**
- Starting a new feature or bug fix
- Changes are logically distinct from current work
- You need to switch contexts
- Preparing for separate commits

**Don't create a new list when:**
- Changes are part of current work
- One or two file modifications
- Quick typo fixes in current context

---

### Commit Frequency

**Commit Early, Commit Often:**
- Finish a logical unit → Stage → Commit
- Don't wait until everything is perfect
- Small commits are easier to review and revert

**When to Commit:**
- Feature is complete and tested
- Bug is fixed and verified
- Refactoring compiles and tests pass
- Documentation is written

---

### Keeping Change Lists Clean

**Delete Completed Lists:**
- After committing, delete the list (files are already committed)
- Or reuse the list for similar work

**Avoid List Bloat:**
- Don't accumulate 50+ change lists
- Keep 3-5 active lists at most
- Archive or delete old lists

**Regular Cleanup:**
- Once a week, review all lists
- Delete obsolete lists
- Merge similar lists if needed

---

### Active List Strategy

**Single Active List:**
- Only one list is active at a time
- Be intentional about which list is active
- Status bar reminds you of current context

**Switch Frequently:**
- Don't leave Default as active
- Switch to match your current task
- Use status bar for quick switching

---

### Integration with Other Extensions

**Commit Message Extensions:**
- Smart Commit works with commit message templates
- Use VS Code's native commit input
- Extensions like "Conventional Commits" work perfectly

**GitLens:**
- Full compatibility
- Use GitLens for blame, history, comparisons
- Use Smart Commit for organization

**Git Graph:**
- View commit history graphically
- Smart Commit commits appear normally
- No conflicts or issues

---

## Keyboard Shortcuts Reference

### Default Keybindings

| Action | Windows/Linux | macOS | Context |
|--------|--------------|-------|---------|
| Set Active List | `Ctrl+Shift+L` | `Cmd+Shift+L` | Change Lists view |
| Move to List | `Alt+Shift+M` | `Alt+Shift+M` | File selected |
| Guarded Commit | `Ctrl+Enter` | `Cmd+Enter` | SCM input focused (if enabled) |
| Open SCM | `Ctrl+Shift+G` | `Cmd+Shift+G` | Anywhere |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` | Anywhere |

### Customizing Keybindings

**Edit Keybindings:**

1. File → Preferences → Keyboard Shortcuts
2. Search for "Smart Commit"
3. Click pencil icon to change binding
4. Press desired key combination

**Example Custom Binding:**

```json
{
  "key": "ctrl+alt+c",
  "command": "smartCommit.createList"
}
```

---

## Troubleshooting Common Issues

### Files Not Auto-Assigning to Active List

**Issue:** New changes appear in Default instead of active list.

**Solutions:**
1. Check that a list is actually set as active (checkmark icon)
2. Verify `autoAssignStagedFiles` is enabled (default)
3. Check debug logs for assignment skips

---

### Changes Not Appearing in Change Lists

**Issue:** Modified files don't show up in any list.

**Solutions:**
1. Ensure Git repository is initialized
2. Check that built-in Git extension is enabled
3. Refresh manually: Click refresh button
4. Check file is not ignored by `.gitignore`

---

### Commit Guard Not Triggering

**Issue:** Can commit mixed change lists without warning.

**Solutions:**
1. Enable guard: `commitGuard.enabled: true`
2. Enable interception: `commitGuard.interceptCommit: true` (restart required)
3. Use `Ctrl+Enter` keybinding, not the commit button
4. Or use Command Palette: "Smart Commit: Commit (with Guard)"

---

### Files Stuck in Wrong List

**Issue:** Can't move file to correct list.

**Solutions:**
1. Right-click file → Move to Change List → Select destination
2. Or drag-and-drop to correct list
3. Refresh view if UI is stale
4. Check debug logs for errors

---

## Next Steps

- **Explore Features:** See [FEATURES.md](FEATURES.md) for detailed feature docs
- **Configure Settings:** Check [CONFIGURATION.md](CONFIGURATION.md) for all options
- **Get Help:** Visit [FAQ.md](FAQ.md) for common questions
- **Report Issues:** [GitHub Issues](https://github.com/maxinne-dev/vscode-smart-commit/issues)

---

Happy organizing! ✓
