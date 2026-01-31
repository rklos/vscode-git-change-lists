![Smart Commit Cover](static/cover.png)

# Smart Commit

> JetBrains-style Change Lists for VS Code and compatible editors

**Smart Commit** brings the powerful change list management from JetBrains IDEs (IntelliJ IDEA, WebStorm, PHPStorm, etc.) to Visual Studio Code, Cursor, Kiro, Windsurf, Trae, VSCodium, and Google Antigravity. Organize your uncommitted changes into named lists, work on multiple features in parallel, and commit only related changes together.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/maxinne-dev/vscode-smart-commit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/maxinne-dev/vscode-smart-commit.svg)](https://github.com/maxinne-dev/vscode-smart-commit/stargazers)

---

## Table of Contents

- [Overview](#overview)
- [Why Use Smart Commit?](#why-use-smart-commit)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Features](#core-features)
- [Commands and Keybindings](#commands-and-keybindings)
- [Configuration](#configuration)
- [Use Cases and Workflows](#use-cases-and-workflows)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## Overview

Smart Commit transforms how you organize Git changes by introducing **change lists**—named containers that group related files together. Instead of VS Code's simple staged/unstaged binary model, you can maintain multiple logical groupings of changes simultaneously, just like in JetBrains IDEs.

### Key Features

- ✓ **Custom Named Change Lists** - Create unlimited change lists to organize your work
- ✓ **Active List Auto-Assignment** - New changes automatically go to your active list
- ✓ **Drag-and-Drop Organization** - Move files between lists with intuitive gestures
- ✓ **Patch Management** - Generate and apply patches per change list
- ✓ **List & Tree View Modes** - Switch between flat and hierarchical file displays
- ✓ **Commit Guard** - Warns when staging files from multiple lists
- ✓ **Git Integration** - Works seamlessly with VS Code's built-in Git
- ✓ **Status Bar Integration** - See your active list at a glance
- ✓ **Multi-Editor Support** - Works on VS Code, Cursor, Kiro, Windsurf, Trae, VSCodium, and Antigravity

---

## Why Use Smart Commit?

### The Problem

Traditional Git workflows force you to choose between:
1. **Committing prematurely** to separate unrelated changes
2. **Using branches for everything**, even small experiments
3. **Managing a messy staged/unstaged area** with hard-to-track changes

### The Solution

Change lists let you:

- **Work on multiple features simultaneously** without premature commits
- **Organize changes by logical context**, not just file status
- **Stage and commit exactly what belongs together**
- **Isolate experimental changes** without creating branches
- **Maintain focus** by activating the relevant change list

### Coming from JetBrains IDEs?

If you're a WebStorm, IntelliJ IDEA, or PHPStorm user who's had to switch to VS Code, you've probably missed the change lists feature. Smart Commit brings that familiar workflow to your editor, with:

- Similar UI patterns (drag-and-drop, context menus)
- Active list concept with auto-assignment
- Default list that captures unassigned changes
- Staging-based workflow that integrates with VS Code's native Git

---

## Installation

### 1. From VS Code Marketplace
1. Open VS Code, Cursor, Kiro, Windsurf, Trae, VSCodium, or Antigravity.
2. Search for **Smart Commit** in the Extensions view (`Ctrl+Shift+X`).
3. Click **Install**.

### 2. From VSIX File
1. Download the latest `.vsix` file from [Releases](https://github.com/maxinne-dev/vscode-smart-commit/releases).
2. Open the Command Palette (`Ctrl+Shift+P`) and run `Extensions: Install from VSIX...`.
3. Select the downloaded file.

### Verification

After installation:
1. Open a Git repository
2. Look for the **Change Lists** view in the Source Control panel (SCM)
3. The default change list should appear with your uncommitted changes

For detailed installation instructions for specific editors, see [docs/INSTALLATION.md](docs/INSTALLATION.md).

---

## Quick Start

### 1. Open a Git Repository

Smart Commit activates automatically when a Git repository is detected.

### 2. Create Your First Change List

- Click the **+** icon in the Change Lists view header, or
- Open Command Palette (`Ctrl+Shift+P`) and run `Smart Commit: Create Change List`
- Enter a name like "Feature: User Authentication"

### 3. Move Files to Your List

- **Drag and drop** files from the "Default" list to your new list, or
- Right-click a file → **Move to Change List** → Select your list

### 4. Set Your List as Active

- Right-click your list → **Set as Active Change List**, or
- Press `Ctrl+Shift+L` (or `Cmd+Shift+L`) and select your list

Now any new changes will automatically appear in your active list!

### 5. Stage and Commit

- Right-click your list → **Stage Change List**
- Write your commit message in the SCM input box
- Press `Ctrl+Enter` (or `Cmd+Enter`) to commit with the guard, or click the commit button

The committed files are automatically removed from your change list.

---

## Core Features

### Change List Management

#### Creating Change Lists

Create named containers to organize your changes:
- Click the **+** icon in the view header
- Use Command Palette: `Smart Commit: Create Change List`
- Enter a descriptive name (e.g., "Feature X", "Bugfix: Login", "Refactor DB")

#### Active List

The **active change list** automatically receives newly detected changes:
- Set any list as active via right-click → **Set as Active Change List**
- Keybinding: `Ctrl+Shift+L` / `Cmd+Shift+L`
- Active list is marked with a checkmark and shown in the status bar
- Only one list can be active at a time

#### Default List

The **Default** list is special:
- Always exists and cannot be deleted
- Captures changes not assigned to any other list
- Can be renamed but retains its default behavior

#### List Operations

- **Rename**: Right-click → **Rename Change List**
- **Delete**: Right-click → **Delete Change List** (requires confirmation if non-empty)
- **Stage All**: Right-click → **Stage Change List** (stages all files in the list)

### File Organization

#### Drag-and-Drop

Move files between change lists by dragging:
- Drag a file from one list to another
- Multi-select files (Ctrl/Cmd+Click) and drag together
- Visual feedback shows valid drop targets

#### Context Menu

Right-click a file → **Move to Change List**:
- See all available lists
- Select destination or create a new list inline

#### Automatic Assignment

When `autoAssignStagedFiles` is enabled (default):
- Files staged externally (via command line, file explorer, etc.) are automatically assigned to the active list
- Keeps your change lists synchronized with Git operations

### View Modes

#### List Mode (Default)

Flat view showing all files in each change list:
- Optimized for small-to-medium change sets
- Quick scanning of filenames
- Fast navigation

#### Tree Mode

Hierarchical view preserving project structure:
- Better for large change sets
- Shows directory organization
- Collapsible folders with badges showing child counts

**Toggle**: Click the tree/list icon in the view header, or use `Smart Commit: Toggle List/Tree View`

View mode and expansion state persist across sessions.

### Git Integration

Smart Commit extends VS Code's Git integration without replacing it:

#### Real-Time Synchronization

- Detects Git state changes automatically
- Updates change lists when files are modified, staged, or committed
- Works alongside command-line Git and other extensions

#### Staging Workflow

1. Right-click a change list → **Stage Change List**
2. All files in the list are staged
3. Use VS Code's standard commit UI (compatible with commit message extensions)
4. After commit, files are automatically removed from change lists

#### Post-Commit Cleanup

- Watches for successful commits
- Removes committed files from change lists automatically
- Keeps your change lists clean and up-to-date

### Commit Guard

Prevents accidentally committing mixed changes:

#### How It Works

When `commitGuard.enabled` is true (default):
1. Before committing, validates all staged files
2. If files are from multiple change lists, shows a warning dialog
3. Options:
   - **Unstage Extra Files**: Unstages files not in the primary list
   - **Commit Anyway**: Proceeds with the mixed commit
   - **Cancel**: Aborts the commit

#### Using the Guard

- **Via Keybinding**: `Ctrl+Enter` / `Cmd+Enter` in the SCM input box (if `commitGuard.interceptCommit` is enabled)
- **Via Command**: `Smart Commit: Commit (with Guard)`

**Note**: The guard cannot intercept the native commit button click due to VS Code API limitations. Use the keybinding for guarded commits.

### Status Bar Integration

The status bar shows:
- Current active change list name (truncated if long)
- Full name in tooltip on hover
- Click to quickly switch active lists

Toggle visibility with `smartCommit.showStatusBar` setting.

### Multi-Root Workspace Support

Smart Commit works with multi-root workspaces:
- Each workspace folder has independent change lists
- State is isolated per repository
- Seamless switching between folders

---

## Commands and Keybindings

### Available Commands

| Command | ID | Description | Default Keybinding |
|---------|-----|-------------|-------------------|
| Create Change List | `smartCommit.createList` | Create a new named change list | — |
| Set as Active Change List | `smartCommit.setActiveList` | Mark a list as active for auto-assignment | `Ctrl+Shift+L` / `Cmd+Shift+L` |
| Move to Change List | `smartCommit.moveToList` | Move selected file(s) to another list | `Alt+Shift+M` |
| Rename Change List | `smartCommit.renameList` | Rename a change list | — |
| Delete Change List | `smartCommit.deleteList` | Delete a change list (with confirmation) | — |
| Stage Change List | `smartCommit.stageList` | Stage all files in a change list | — |
| Toggle List/Tree View | `smartCommit.toggleViewMode` | Switch between flat and hierarchical views | — |
| Commit (with Guard) | `smartCommit.guardedCommit` | Commit with validation of staged files | `Ctrl+Enter` / `Cmd+Enter` (in SCM input) |
| Refresh Change Lists | `smartCommit.refresh` | Manually refresh the view | — |

### Customizing Keybindings

Modify keybindings in **File → Preferences → Keyboard Shortcuts** or edit `keybindings.json`:

```json
{
  "key": "ctrl+shift+l",
  "command": "smartCommit.setActiveList",
  "when": "view == smartCommit.changeLists"
}
```

---

## Configuration

Smart Commit can be configured via **File → Preferences → Settings** or `settings.json`.

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smartCommit.defaultViewMode` | `"list"` `"tree"` | `"list"` | Default view mode for displaying files |
| `smartCommit.showStatusBar` | `boolean` | `true` | Show the active change list in the status bar |
| `smartCommit.confirmDeleteNonEmpty` | `boolean` | `true` | Ask for confirmation before deleting non-empty lists |
| `smartCommit.autoActivateNew` | `boolean` | `true` | Automatically set newly created lists as active |
| `smartCommit.commitGuard.enabled` | `boolean` | `true` | Warn when committing files from multiple lists |
| `smartCommit.commitGuard.interceptCommit` | `boolean` | `false` | Intercept native commit command (requires restart) |
| `smartCommit.autoAssignStagedFiles` | `boolean` | `true` | Auto-assign externally staged files to active list |
| `smartCommit.debug.enableLogging` | `boolean` | `false` | Enable verbose debug logging to output channel |

### Example Configuration

```json
{
  "smartCommit.defaultViewMode": "tree",
  "smartCommit.showStatusBar": true,
  "smartCommit.autoActivateNew": true,
  "smartCommit.commitGuard.enabled": true,
  "smartCommit.autoAssignStagedFiles": true,
  "smartCommit.debug.enableLogging": false
}
```

For detailed configuration guidance, see [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

---

## Use Cases and Workflows

### Parallel Feature Development

Work on multiple features without premature commits:

1. Create change lists: "Feature A", "Feature B"
2. Set "Feature A" as active
3. Work on Feature A (files auto-assign to it)
4. Switch to "Feature B" as active
5. Work on Feature B (files auto-assign to it)
6. Stage and commit Feature A independently
7. Continue working on Feature B

### Bug Fix During Feature Development

Handle urgent bug fixes without disrupting feature work:

1. Currently working on "Feature X" (active list)
2. Bug report comes in
3. Create "Hotfix: Critical Bug" list, set as active
4. Fix the bug (changes go to Hotfix list)
5. Stage and commit Hotfix independently
6. Set "Feature X" back to active, continue work

### Code Review Preparation

Organize changes for clear, focused pull requests:

1. Create change lists by logical component:
   - "Refactor: Database Layer"
   - "Feature: User Profile"
   - "Docs: API Documentation"
2. Stage and commit each list separately
3. Create focused PRs from each commit
4. Easier for reviewers to understand changes

### Experimental Changes

Isolate experimental code without creating branches:

1. Create "Experiment: Performance Optimization"
2. Make experimental changes
3. If it works: commit it
4. If it doesn't: discard the entire change list
5. No branch overhead, clean commit history

### Mixed Workflows

Combine with traditional Git workflows:

- Use change lists for local organization
- Still use branches for long-lived work
- Change lists organize commits within a branch
- Commit guard prevents mixing unrelated work

---

## Roadmap

Smart Commit is actively developed. Here's what's planned for future releases:

### Version 1.0.0 (In Progress)

#### Enhanced UI
- **Change List Colors**: Assign custom colors to lists for visual identification
- **Change Count Badges**: Show modified/added/deleted file counts per list
- **Inline File Previews**: Quick diff preview on hover
- **Search and Filter**: Find files across all change lists

### Version 2.0.0 (Planned)

#### Advanced Git Integration
- **Shelving/Stashing**: Temporarily shelve a change list to clean working directory
- **Branch Integration**: Associate change lists with specific branches
- **Rebase Support**: Handle change lists during interactive rebases
- **Conflict Resolution**: Visual tools for resolving merge conflicts within change lists

#### Automation
- **Rule-Based Assignment**: Auto-assign files to lists based on path patterns or file types
- **Time-Based Lists**: Automatically create lists based on time of day or date
- **Branch Name Detection**: Suggest change list names from branch names

### Version 3.0.0 (Planned)

#### Collaboration
- **Change List Sharing**: Export/import change lists with team members
- **Review Mode**: Prepare change lists specifically for code review
- **Integration with PR Tools**: Link change lists to GitHub/GitLab PRs

#### Performance
- **Large Repository Optimizations**: Improved performance for repos with 1000+ files
- **Lazy Loading**: Progressive loading of change list contents
- **Caching Improvements**: Smarter diff caching strategies

### Future Considerations

- **Unversioned Files List**: Special list for untracked files with "Add to VCS" actions
- **Context Snapshot**: Preserve IDE state (open files, cursor positions) with lists
- **Commit Templates**: Pre-fill commit messages based on change list content
- **External Tracker Integration**: Link change lists to Jira, Linear, or GitHub issues

**Want to contribute to the roadmap?** See [Contributing](#contributing) below!

---

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Installation Guide](docs/INSTALLATION.md)** - Detailed installation for all supported editors
- **[User Guide](docs/USER_GUIDE.md)** - Step-by-step usage instructions and workflows
- **[Features](docs/FEATURES.md)** - Complete feature documentation
- **[Configuration](docs/CONFIGURATION.md)** - All settings explained in detail
- **[Debugging](docs/DEBUGGING.md)** - Debug logging and troubleshooting
- **[FAQ](docs/FAQ.md)** - Frequently asked questions
- **[Contributing](docs/CONTRIBUTING.md)** - Guide for contributors
- **[Development](docs/DEVELOPMENT.md)** - Developer setup and architecture
- **[Changelog](docs/CHANGELOG.md)** - Version history and release notes

---

## Contributing

Contributions are welcome! Smart Commit is an open-source project and benefits from community input.

### How to Contribute

- **Report Bugs**: Open an issue on [GitHub](https://github.com/maxinne-dev/vscode-smart-commit/issues)
- **Request Features**: Describe your use case in an issue
- **Improve Documentation**: Submit PRs for typos, clarifications, or new guides
- **Write Code**: See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for development setup

### Development Setup

```bash
git clone https://github.com/maxinne-dev/vscode-smart-commit.git
cd vscode-smart-commit
npm install
npm run compile
```

Press F5 in VS Code to launch the Extension Development Host.

For detailed development instructions, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

---

## Support

### Getting Help

- **Documentation**: Check the [docs](docs/) folder first
- **FAQ**: See [docs/FAQ.md](docs/FAQ.md) for common questions
- **Issues**: Search [existing issues](https://github.com/maxinne-dev/vscode-smart-commit/issues) or open a new one
- **Discussions**: Join [GitHub Discussions](https://github.com/maxinne-dev/vscode-smart-commit/discussions) for community support

### Reporting Bugs

When reporting bugs, please include:
1. Extension version (`0.0.1`)
2. Editor name and version (VS Code, Cursor, etc.)
3. Steps to reproduce the issue
4. Expected vs actual behavior
5. Debug logs (see [docs/DEBUGGING.md](docs/DEBUGGING.md))

### Feature Requests

We love hearing about new use cases! When requesting features:
1. Describe the problem you're trying to solve
2. Explain your current workaround (if any)
3. Suggest a potential solution
4. Include any relevant screenshots or examples

---

## License

Smart Commit is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2026 Smart Commit Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgments

- Inspired by JetBrains IDEs' change list feature
- Built on VS Code's Extension API
- Thanks to all contributors and users

---

Made with ✓ for developers who want better Git workflows

[Report Bug](https://github.com/maxinne-dev/vscode-smart-commit/issues) • [Request Feature](https://github.com/maxinne-dev/vscode-smart-commit/issues) • [View Documentation](docs/)
