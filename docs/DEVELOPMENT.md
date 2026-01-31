# Smart Commit Development Guide

Comprehensive guide for developers working on Smart Commit.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Development Workflow](#development-workflow)
- [Debugging](#debugging)
- [Adding Features](#adding-features)
- [Testing](#testing)
- [Packaging and Publishing](#packaging-and-publishing)
- [Troubleshooting Development](#troubleshooting-development)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Recommended | Download |
|----------|----------------|-------------|----------|
| **Node.js** | 20.0.0 | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0.0 | Latest | Bundled with Node.js |
| **Git** | 2.0.0 | 2.40+ | [git-scm.com](https://git-scm.com/) |
| **VS Code** | 1.103.0 | Latest | [code.visualstudio.com](https://code.visualstudio.com/) |
| **TypeScript** | 5.x | 5.x | `npm install -g typescript` |

### Verify Installation

```bash
node --version    # v20.x.x
npm --version     # 9.x.x
git --version     # 2.x.x
code --version    # 1.103.0+
tsc --version     # 5.x.x
```

---

## Setup

### Clone Repository

```bash
git clone https://github.com/maxinne-dev/vscode-smart-commit.git
cd vscode-smart-commit
```

### Install Dependencies

```bash
npm install
```

This installs:
- **Runtime**: `simple-git`, `uuid`
- **Dev**: TypeScript, ESLint, `@types` packages, VSCE

### Compile TypeScript

```bash
npm run compile
```

Output is written to `out/` directory.

### Open in VS Code

```bash
code .
```

---

## Project Structure

```
vscode-smart-commit/
├── .vscode/                  # VS Code configuration
│   ├── launch.json          # Debug configurations
│   ├── settings.json        # Editor settings
│   └── tasks.json           # Build tasks
├── docs/                     # Documentation
│   ├── CHANGELOG.md
│   ├── FEATURES.md
│   ├── USER_GUIDE.md
│   └── ...
├── src/                      # TypeScript source code
│   ├── extension.ts         # Entry point
│   ├── commands/            # Command handlers
│   │   └── index.ts
│   ├── services/            # Core business logic
│   │   ├── changeListManager.ts
│   │   ├── gitService.ts
│   │   ├── commitGuardService.ts
│   │   └── configService.ts
│   ├── providers/           # VS Code providers
│   │   ├── treeDataProvider.ts
│   │   └── dragDropController.ts
│   ├── types/               # TypeScript interfaces
│   │   ├── changeList.ts
│   │   ├── git.d.ts
│   │   └── index.ts
│   └── utils/               # Utility functions
│       ├── constants.ts
│       ├── helpers.ts
│       └── logger.ts
├── out/                      # Compiled JavaScript (gitignored)
├── node_modules/             # Dependencies (gitignored)
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript configuration
├── .eslintrc.json            # ESLint rules
├── .gitignore                # Git ignore patterns
├── LICENSE                   # MIT License
└── README.md                 # Main documentation
```

### Key Files

#### package.json

Extension manifest defining:
- Metadata (name, version, publisher)
- Activation events
- Contributed commands, views, configuration
- Dependencies
- Scripts

#### src/extension.ts

Entry point with two exports:
- `activate(context)`: Called when extension activates
- `deactivate()`: Called when extension deactivates

#### tsconfig.json

TypeScript compiler configuration:
- Target: ES2020
- Module: CommonJS
- Output directory: `out/`
- Source maps enabled

---

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────┐
│           VS Code Extension Host             │
├─────────────────────────────────────────────┤
│  extension.ts (Entry Point)                  │
├─────────────────────────────────────────────┤
│  Commands                                    │
│  - createList, deleteList, renameList        │
│  - moveToList, stageList, setActiveList      │
├─────────────────────────────────────────────┤
│  Services (Business Logic)                   │
│  ┌────────────────────────────────────────┐ │
│  │ ChangeListManager                       │ │
│  │ - State management                      │ │
│  │ - CRUD operations                       │ │
│  │ - Active list enforcement               │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ GitService                              │ │
│  │ - Git extension integration             │ │
│  │ - Repository monitoring                 │ │
│  │ - File status tracking                  │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ CommitGuardService                      │ │
│  │ - Staged file validation                │ │
│  │ - Mixed list detection                  │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ ConfigService                           │ │
│  │ - Settings management                   │ │
│  │ - Configuration change handling         │ │
│  └────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  Providers (UI Integration)                  │
│  ┌────────────────────────────────────────┐ │
│  │ TreeDataProvider                        │ │
│  │ - Tree view data source                 │ │
│  │ - List/Tree mode switching              │ │
│  │ - Node generation                       │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ TreeDragAndDropController               │ │
│  │ - Drag-and-drop handling                │ │
│  │ - Data transfer logic                   │ │
│  └────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  Types & Utils                               │
│  - Type definitions                          │
│  - Constants                                 │
│  - Logging                                   │
│  - Helpers                                   │
└─────────────────────────────────────────────┘
         │                   │
         │                   │
         v                   v
┌──────────────────┐  ┌──────────────────┐
│  VS Code APIs    │  │  Git Extension   │
│  - workspace     │  │  - Repository    │
│  - window        │  │  - Status        │
│  - commands      │  │  - Operations    │
└──────────────────┘  └──────────────────┘
```

### Component Responsibilities

#### ChangeListManager

**Role:** Core state management and business logic

**Responsibilities:**
- Maintain in-memory list of change lists
- Enforce active list singleton pattern
- Persist state to workspace storage
- Emit change events for UI updates
- Handle CRUD operations (create, rename, delete)
- Manage file assignments

**Key Methods:**
- `createList(name)`: Create new change list
- `deleteList(id)`: Remove list and reassign files
- `setActiveList(id)`: Set singleton active list
- `moveFile(filePath, targetListId)`: Reassign file
- `getListForFile(filePath)`: Query file's list
- `saveState()`: Persist to storage

**Events:**
- `onDidChangeState`: Fired on list or file changes
- `onDidChangeActiveList`: Fired on active list change

---

#### GitService

**Role:** Integration with VS Code's Git extension

**Responsibilities:**
- Detect and access Git repositories
- Monitor Git state changes (modifications, staging, commits)
- Map Git file statuses to change lists
- Emit events for Git operations

**Key Methods:**
- `initialize()`: Find and connect to Git extension
- `getRepository()`: Access current repository
- `getChanges()`: Get modified files with status
- `stageFiles(files)`: Stage files via Git API
- `onDidChange`: Event for Git state changes
- `onDidStageFiles`: Event for staging operations
- `onDidCommit`: Event for successful commits

**Integration:**
- Uses `vscode.git` extension API
- Subscribes to Git repository events
- Debounces rapid changes (150ms)

---

#### CommitGuardService

**Role:** Validate staged files before commit

**Responsibilities:**
- Validate staged files belong to same change list
- Show warning dialog for mixed lists
- Provide unstage/commit/cancel options
- Intercept commit command (optional)

**Key Methods:**
- `validateStagedFiles()`: Check for mixed lists
- `showGuardDialog(validation)`: Present options to user
- `unstageExtraFiles(files)`: Remove non-primary files from staging

**Flow:**
1. User triggers commit
2. Service validates staged files
3. If mixed lists detected, show dialog
4. User chooses action (unstage/commit/cancel)
5. Proceed or abort based on choice

---

#### TreeDataProvider

**Role:** Data source for tree view

**Responsibilities:**
- Implement `vscode.TreeDataProvider<TreeNode>`
- Generate tree structure from change lists
- Switch between list and tree modes
- Handle expansions and refresh

**Key Methods:**
- `getChildren(element?)`: Return child nodes
- `getTreeItem(element)`: Create `TreeItem` representation
- `refresh()`: Trigger UI update
- `reveal(file)`: Scroll to and select file

**Node Types:**
- `ChangeListNode`: Change list headers
- `DirectoryNode`: Folders (tree mode only)
- `FileNode`: Individual files

---

### Data Flow

#### File Assignment Flow

```
1. User modifies file.ts
   ↓
2. Git extension detects change
   ↓
3. GitService receives onDidChange event
   ↓
4. GitService queries ChangeListManager for file's list
   ↓
5. If unassigned, ChangeListManager assigns to active list
   ↓
6. ChangeListManager fires onDidChangeState
   ↓
7. TreeDataProvider receives event
   ↓
8. TreeDataProvider calls refresh()
   ↓
9. Tree view updates UI
```

#### Commit Flow with Guard

```
1. User stages files from change list "Feature A"
   ↓
2. User presses Ctrl+Enter
   ↓
3. CommitGuardService intercepts
   ↓
4. Service validates staged files
   ↓
5. Detects file from "Bug B" also staged
   ↓
6. Shows warning dialog
   ↓
7. User selects "Unstage Extra Files"
   ↓
8. Service unstages "Bug B" file
   ↓
9. Commit proceeds with only "Feature A" files
   ↓
10. GitService detects commit
   ↓
11. ChangeListManager removes committed files
   ↓
12. TreeDataProvider refreshes UI
```

---

## Development Workflow

### Watch Mode (Recommended)

Keep TypeScript compiler running:

```bash
npm run watch
```

- Automatically recompiles on save
- Shows compilation errors in terminal
- Faster iteration

### Running Extension

**Method 1: F5 Keyboard Shortcut**

1. Open project in VS Code
2. Press `F5`
3. Extension Development Host launches
4. Test your changes

**Method 2: Debug View**

1. View → Run (`Ctrl+Shift+D`)
2. Select "Run Extension" from dropdown
3. Click green play button

### Reloading Extension

After making changes:

**In Extension Development Host:**
- Press `Ctrl+R` (Windows/Linux) / `Cmd+R` (macOS)
- Or: Developer → Reload Window

No need to restart; reload picks up recompiled code.

### Making Changes

**Typical Workflow:**

1. **Edit Code**
   - Modify TypeScript files in `src/`
   - Watch mode auto-compiles

2. **Reload Extension**
   - Ctrl+R in Development Host

3. **Test Changes**
   - Interact with extension
   - Check Output → Smart Commit for logs
   - Verify behavior

4. **Iterate**
   - Repeat until satisfied

---

## Debugging

### Breakpoints

**Setting Breakpoints:**

1. Open TypeScript file in `src/`
2. Click line number gutter (red dot appears)
3. F5 to start debugging
4. Interact with extension to hit breakpoint

**Debugging Controls:**

- **Continue** (F5): Resume execution
- **Step Over** (F10): Execute line, skip function calls
- **Step Into** (F11): Enter function calls
- **Step Out** (Shift+F11): Exit current function
- **Restart** (Ctrl+Shift+F5): Restart debug session
- **Stop** (Shift+F5): End debugging

### Debug Console

**Evaluate Expressions:**

1. Hit a breakpoint
2. Open Debug Console (View → Debug Console)
3. Type expressions to evaluate:
   ```javascript
   activeList.name
   manager.getAllLists().length
   JSON.stringify(state, null, 2)
   ```

### Logging

**Use Structured Logging:**

```typescript
import { logger } from './utils/logger';

logger.debug('Detailed info', { listId, fileName });
logger.info('Operation completed', { result });
logger.warn('Unexpected condition', { value });
logger.error('Operation failed', error);
logger.event('Git', 'Commit detected', { fileCount });
```

**View Logs:**

1. Output panel: `Ctrl+Shift+U` / `Cmd+Shift+U`
2. Select "Smart Commit" from dropdown

### Developer Tools

**Access:**
- Help → Toggle Developer Tools
- Or: `Ctrl+Shift+I` / `Cmd+Option+I`

**Useful Tabs:**
- **Console**: JavaScript errors and warnings
- **Network**: HTTP requests (if any)
- **Application**: Storage, cache (workspace state)

---

## Adding Features

### Step-by-Step Guide

#### Example: Add "Duplicate Change List" Feature

**1. Update package.json**

Add command contribution:

```json
{
  "command": "smartCommit.duplicateList",
  "title": "Duplicate Change List",
  "category": "Smart Commit",
  "icon": "$(copy)"
}
```

Add to context menu:

```json
{
  "command": "smartCommit.duplicateList",
  "when": "view == smartCommit.changeLists && viewItem =~ /^changeList/",
  "group": "3_edit@3"
}
```

**2. Define Types (if needed)**

In `src/types/changeList.ts`:

```typescript
// Existing interface is sufficient for this feature
```

**3. Add Service Method**

In `src/services/changeListManager.ts`:

```typescript
public duplicateList(listId: string): ChangeList | undefined {
  const source = this.lists.find(l => l.id === listId);
  if (!source) {
    logger.warn('Cannot duplicate non-existent list', { listId });
    return undefined;
  }

  const newList = this.createList(`${source.name} (Copy)`);
  if (!newList) return undefined;

  // Copy file assignments
  const sourceFiles = this.getFilesForList(listId);
  sourceFiles.forEach(file => {
    this.fileMapping.set(file.resourceUri.fsPath, newList.id);
  });

  this.saveState();
  this._onDidChangeState.fire();

  logger.info('List duplicated', { sourceId: listId, newId: newList.id });
  return newList;
}
```

**4. Register Command**

In `src/commands/index.ts`:

```typescript
export function registerCommands(
  manager: ChangeListManager,
  treeView: vscode.TreeView<AnyTreeNode>,
  config: ConfigService
): vscode.Disposable {
  const disposables: vscode.Disposable[] = [];

  // ... existing commands ...

  disposables.push(
    vscode.commands.registerCommand(
      COMMANDS.DUPLICATE_LIST,
      async (node?: ChangeListNode) => {
        if (!node) {
          logger.warn('Duplicate list called without node');
          return;
        }

        const duplicated = manager.duplicateList(node.list.id);
        if (duplicated) {
          vscode.window.showInformationMessage(
            `Duplicated "${node.list.name}" as "${duplicated.name}"`
          );
        } else {
          vscode.window.showErrorMessage('Failed to duplicate change list');
        }
      }
    )
  );

  return vscode.Disposable.from(...disposables);
}
```

**5. Add Constant**

In `src/utils/constants.ts`:

```typescript
export const COMMANDS = {
  // ... existing commands ...
  DUPLICATE_LIST: 'smartCommit.duplicateList',
} as const;
```

**6. Test**

1. Compile: `npm run compile`
2. Press F5 to launch
3. Create a change list with files
4. Right-click list → **Duplicate Change List**
5. Verify new list appears with same files

**7. Document**

Update:
- `docs/FEATURES.md`: Add "Duplicate List" section
- `docs/USER_GUIDE.md`: Add workflow example
- `docs/CHANGELOG.md`: Add to `[Unreleased]` section
- `README.md`: Add to commands table

---

### Testing New Features

**Manual Test Checklist:**

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Edge cases handled (empty lists, many files, etc.)
- [ ] UI updates correctly
- [ ] State persists across reloads
- [ ] Logs are informative
- [ ] Documentation updated

**Automated Tests (Future):**

When test infrastructure is added:
- Write unit tests for service methods
- Write integration tests for commands
- Add regression tests for bug fixes

---

## Testing

### Manual Testing

**Test Scenarios:**

1. **Basic Operations**
   - Create, rename, delete lists
   - Move files between lists
   - Set active list
   - Stage and commit

2. **Edge Cases**
   - Empty lists
   - Many files (100+)
   - Large files
   - Rapid changes
   - External Git operations

3. **Error Handling**
   - Invalid list names
   - Deleting active list
   - Moving files from deleted lists

### Automated Testing (Future)

Not yet implemented. Planned:

**Unit Tests:**
```bash
npm run test:unit
```

**Integration Tests:**
```bash
npm run test:integration
```

**E2E Tests:**
```bash
npm run test:e2e
```

---

## Packaging and Publishing

### Packaging Extension

**Create VSIX:**

```bash
npm run package
```

Output: `smart-commit-0.0.1.vsix`

### Installing VSIX Locally

```bash
code --install-extension smart-commit-0.0.1.vsix
```

### Publishing to Marketplace

**Prerequisites:**
- Publisher account on [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
- Personal Access Token (PAT) with `Marketplace (publish)` scope

**Publish:**

```bash
vsce publish
```

Or manually:
1. Package: `npm run package`
2. Upload VSIX to marketplace web UI

**Update Version:**

```bash
# Patch: 0.0.1 → 0.0.2
npm version patch

# Minor: 0.0.1 → 0.1.0
npm version minor

# Major: 0.0.1 → 1.0.0
npm version major
```

---

## Troubleshooting Development

### Extension Not Loading

**Issue:** Extension Development Host doesn't show extension.

**Solutions:**
1. Check compilation errors: `npm run compile`
2. Check activation events in `package.json`
3. View Output → Smart Commit for errors
4. Restart Development Host

---

### Breakpoints Not Hitting

**Issue:** Debugger doesn't stop at breakpoints.

**Solutions:**
1. Ensure source maps are enabled (`"sourceMap": true` in `tsconfig.json`)
2. Recompile: `npm run compile`
3. Restart debug session (Ctrl+Shift+F5)
4. Check breakpoint is in executed code path

---

### Changes Not Reflecting

**Issue:** Code changes don't appear in Development Host.

**Solutions:**
1. Check watch mode is running: `npm run watch`
2. Verify compilation succeeded (no errors in watch terminal)
3. Reload Extension Development Host: Ctrl+R / Cmd+R
4. Check correct files are being edited (not `out/`, only `src/`)

---

### State Corruption

**Issue:** Extension behaves oddly, state seems corrupted.

**Solutions:**
1. Clear workspace state: Delete `.vscode-test` folder
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Clean build: `rm -rf out && npm run compile`

---

## Next Steps

- **Read Architecture Docs**: [OVERVIEW.md](../OVERVIEW.md), [BLUEPRINT.md](../BLUEPRINT.md)
- **Review Code**: Browse `src/` to understand implementation
- **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- **Ask Questions**: [GitHub Discussions](https://github.com/maxinne-dev/vscode-smart-commit/discussions)

---

Happy developing! ✓
