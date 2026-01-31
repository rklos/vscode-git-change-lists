# Contributing to Smart Commit

Thank you for considering contributing to Smart Commit! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

---

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful, constructive, and inclusive in all interactions.

### Our Standards

- Be welcoming and inclusive
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

---

## How Can I Contribute?

### Reporting Bugs

Found a bug? Help us improve by reporting it:

**Before Submitting:**
1. Check [existing issues](https://github.com/maxinne-dev/vscode-smart-commit/issues) for duplicates
2. Try the latest version (bug may be fixed)
3. Enable debug logging and reproduce the issue

**Creating a Bug Report:**

[Open a new issue](https://github.com/maxinne-dev/vscode-smart-commit/issues/new) with:

**Title:** Clear, specific description (e.g., "Drag-and-drop fails with large file lists")

**Description:**
```markdown
## Bug Description
[Clear description of the issue]

## Steps to Reproduce
1. Open a Git repository with 100+ files
2. Create a new change list
3. Drag a file to the new list
4. [Describe what happens]

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Environment
- Smart Commit version: 0.0.1
- Editor: VS Code 1.103.0 (or Cursor, Kiro, etc.)
- Operating System: Windows 11 / macOS 14.1 / Ubuntu 22.04
- Git version: 2.40.0

## Debug Logs
[Paste relevant logs from Output → Smart Commit]

## Additional Context
[Screenshots, videos, related issues]
```

---

### Suggesting Features

Have an idea for improvement? We'd love to hear it!

**Before Suggesting:**
1. Check [existing feature requests](https://github.com/maxinne-dev/vscode-smart-commit/labels/enhancement)
2. Review the [Roadmap](../README.md#roadmap)
3. Consider if it aligns with project goals

**Creating a Feature Request:**

[Open a new issue](https://github.com/maxinne-dev/vscode-smart-commit/issues/new) with label `enhancement`:

**Title:** Feature summary (e.g., "Add color coding for change lists")

**Description:**
```markdown
## Problem Statement
[What problem does this solve? What's your current workaround?]

## Proposed Solution
[Describe your suggested approach]

## Alternatives Considered
[Other approaches you thought about]

## Benefits
- [Benefit 1]
- [Benefit 2]

## Use Cases
1. [Scenario where this would be helpful]
2. [Another scenario]

## Design Mockups (optional)
[Sketches, screenshots, or descriptions of UI changes]

## Additional Context
[JetBrains comparison, other tool references, etc.]
```

---

### Contributing Code

Want to fix a bug or implement a feature? Awesome!

**Process:**

1. **Discuss first** (for large changes)
   - Comment on existing issue, or create one
   - Confirm approach before spending time coding
   - Maintainers will provide guidance

2. **Fork and clone**
   ```bash
git clone https://github.com/maxinne-dev/vscode-smart-commit.git
cd vscode-smart-commit
```

3. **Set up development environment**
   - See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup

4. **Create a feature branch**
   ```bash
   git checkout -b fix/issue-123-drag-drop
   # or
   git checkout -b feature/color-coded-lists
   ```

5. **Make your changes**
   - Follow [Coding Standards](#coding-standards)
   - Write tests if applicable
   - Update documentation

6. **Test thoroughly**
   - Run in Extension Development Host
   - Test on multiple editors if possible
   - Verify no regressions

7. **Commit with clear messages**
   - Follow [Commit Message Guidelines](#commit-message-guidelines)

8. **Push and create Pull Request**
   - See [Pull Request Process](#pull-request-process)

---

### Contributing Documentation

Documentation improvements are always welcome!

**Areas to Contribute:**

- **Typo fixes**: Quick PRs for typos, grammar
- **Clarity improvements**: Rephrase confusing sections
- **New guides**: Tutorials, workflows, tips
- **Translations**: (Future) Localize documentation
- **Screenshots**: Add visual aids (when we support them)

**Process:**

1. Fork repository
2. Edit markdown files in `docs/` or root `README.md`
3. Preview locally (use a markdown previewer)
4. Submit PR with description of changes

**Documentation Standards:**

- Use clear, active voice
- Include examples where helpful
- Keep tone professional but approachable
- Minimal emoji usage (✓, ⚠️, 💡 only)
- Link to related documentation

---

## Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 9.x or higher
- **Git**: 2.0 or higher
- **VS Code**: 1.103.0 or higher (for testing)
- **TypeScript**: Installed globally or via npm

### Development Setup

```bash
# Clone repository
git clone https://github.com/maxinne-dev/vscode-smart-commit.git
cd vscode-smart-commit

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Open in VS Code
code .
```

**Verify Setup:**
1. Open Command Palette: `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Run: `Developer: Show Running Extensions`
3. Find "Smart Commit" in the list

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed instructions.

---

## Development Workflow

### Compilation

**Watch Mode (Recommended):**
```bash
npm run watch
```
- Automatically recompiles on file changes
- Keep running in a terminal

**Single Compilation:**
```bash
npm run compile
```

### Running Extension

**Method 1: F5 in VS Code**
1. Open project in VS Code
2. Press `F5` (or Run → Start Debugging)
3. Extension Development Host launches
4. Test your changes

**Method 2: Debug View**
1. View → Run
2. Select "Run Extension" configuration
3. Click green play button

**Reload Extension:**
- In Extension Development Host: `Ctrl+R` / `Cmd+R`
- Or: Developer → Reload Window

### Debugging

**Breakpoints:**
1. Set breakpoints in TypeScript files (click line number gutter)
2. F5 to start debugging
3. Interact with extension to hit breakpoints
4. Use Debug Console for evaluation

**Logs:**
- Use `logger.debug()`, `logger.info()`, etc. from `src/utils/logger.ts`
- View logs: Output → Smart Commit

**Developer Tools:**
- Help → Toggle Developer Tools
- Console tab shows JavaScript errors
- Network tab for HTTP requests (future)

---

## Coding Standards

### TypeScript

**Style:**
- Use `const` by default, `let` when necessary, never `var`
- Prefer arrow functions: `const foo = () => {}`
- Use `async`/`await` over `.then()` for promises
- Explicit types where helpful, type inference where obvious

**Example:**
```typescript
// Good
const activeList = manager.getActiveList();
if (!activeList) {
  logger.warn('No active list found');
  return;
}

// Avoid
var list = manager.getActiveList();
if (list == null) console.log('warning');
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Classes | PascalCase | `ChangeListManager` |
| Interfaces | PascalCase (no I prefix) | `ChangeList`, not `IChangeList` |
| Functions/Methods | camelCase | `getActiveList()` |
| Variables | camelCase | `activeList`, `fileName` |
| Constants | SCREAMING_SNAKE_CASE | `DEFAULT_LIST_NAME` |
| Private members | Underscore prefix | `_internalState` |
| Files | kebab-case | `change-list-manager.ts` |

### File Organization

```
src/
├── extension.ts           # Entry point
├── commands/             # Command handlers
│   └── index.ts
├── services/             # Business logic
│   ├── changeListManager.ts
│   ├── gitService.ts
│   └── ...
├── providers/            # VS Code providers
│   ├── treeDataProvider.ts
│   └── ...
├── types/                # Type definitions
│   ├── changeList.ts
│   └── ...
└── utils/                # Utilities
    ├── constants.ts
    ├── helpers.ts
    └── logger.ts
```

### Error Handling

**Always handle errors:**
```typescript
// Good
try {
  await gitService.stageFiles(files);
} catch (error) {
  logger.error('Failed to stage files', error);
  vscode.window.showErrorMessage('Could not stage files');
}

// Avoid
gitService.stageFiles(files); // Unhandled promise
```

### Disposables

**Always dispose resources:**
```typescript
// In activate():
context.subscriptions.push(
  treeView,
  statusBarItem,
  commands.registerAll()
);

// Disposable pattern:
class MyService {
  private disposables: vscode.Disposable[] = [];

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}
```

### Logging

**Use appropriate log levels:**
```typescript
logger.debug('Detailed operation info');  // Only when debug.enableLogging
logger.info('Operation completed');       // Always logged
logger.warn('Unexpected but handled');    // Always logged
logger.error('Operation failed', error);  // Always logged
logger.event('Git', 'Commit detected');   // Always logged
```

---

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `docs` | Documentation changes |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding/updating tests |
| `chore` | Build process, dependencies, tooling |

### Scopes (Optional)

- `core`: Core extension logic
- `ui`: User interface changes
- `git`: Git integration
- `config`: Configuration handling
- `docs`: Documentation
- `deps`: Dependencies

### Examples

```bash
# Feature
feat(ui): add color coding for change lists

# Bug fix
fix(git): resolve race condition in commit detection

# Documentation
docs: update installation guide for Cursor

# Refactor
refactor(core): simplify file assignment logic

# Multiple changes
feat: implement patch application

- Add patch parser
- Create patch dialog UI
- Integrate with change lists
- Update documentation

Closes #42
```

### Rules

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter of subject
- No period at end of subject
- Keep subject under 50 characters
- Wrap body at 72 characters
- Reference issues: `Closes #123`, `Fixes #456`

---

## Pull Request Process

### Before Submitting

- [ ] Code compiles without errors
- [ ] Extension runs in Development Host
- [ ] No console errors or warnings
- [ ] Tested on at least one editor
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated (under Unreleased)
- [ ] Commit messages follow guidelines

### Creating the PR

1. **Push your branch**
   ```bash
   git push origin fix/issue-123
   ```

2. **Open PR on GitHub**
   - Navigate to repository
   - Click "Compare & pull request"
   - Fill out template

### PR Template

```markdown
## Description
[Clear description of changes]

## Motivation and Context
[Why is this change needed? What problem does it solve?]

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Tested in Extension Development Host
- [ ] Tested on: VS Code / Cursor / Other (specify)
- [ ] Added/updated tests (if applicable)

## Screenshots (if applicable)
[Add screenshots showing the change]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No new warnings or errors
```

### Review Process

**What to Expect:**

1. **Automated Checks** (Future)
   - TypeScript compilation
   - Linting
   - Tests (when added)

2. **Maintainer Review**
   - Usually within 48-72 hours
   - Feedback on code, tests, docs
   - Requested changes or approval

3. **Revisions**
   - Address feedback
   - Push new commits to same branch
   - PR updates automatically

4. **Merge**
   - Maintainer merges when approved
   - Squash merge (single commit) or merge commit
   - Your contribution is live!

### After Merge

- Branch is deleted automatically
- Check CHANGELOG for next release
- Celebrate your contribution! ✓

---

## Testing

### Manual Testing

**Required for all PRs:**

1. **Basic Functionality**
   - Extension activates
   - Change Lists view appears
   - Create, rename, delete lists works
   - Move files between lists works
   - Stage and commit works

2. **Edge Cases**
   - Empty lists
   - Many files (100+)
   - Large repositories
   - Fast file changes
   - External Git operations

3. **Different Editors** (if possible)
   - Test on VS Code
   - Test on Cursor, Kiro, or others if available

### Automated Tests (Future)

Not yet implemented in v0.1.0. Planned for future versions:
- Unit tests with Jest
- Integration tests with VS Code Test Runner
- E2E tests for workflows

---

## Documentation

### Documentation Changes Required

Update docs when changing:

- **Features**: Update [FEATURES.md](FEATURES.md)
- **Configuration**: Update [CONFIGURATION.md](CONFIGURATION.md)
- **Commands**: Update README.md commands table
- **Workflows**: Update [USER_GUIDE.md](USER_GUIDE.md)
- **Breaking Changes**: Prominently note in CHANGELOG

### Writing Documentation

**Style Guide:**

- **Active voice**: "Create a change list" not "A change list can be created"
- **Clear headings**: Use descriptive, hierarchical headings
- **Code examples**: Include examples where helpful
- **Cross-references**: Link to related docs
- **Consistency**: Use same terminology throughout

**Markdown Standards:**

- Use ATX-style headers: `### Header` not underlines
- Use fenced code blocks with language: ` ```typescript `
- Use tables for structured data
- Keep lines under 100 characters for readability

---

## Community

### Getting Help

- **Questions**: [GitHub Discussions](https://github.com/maxinne-dev/vscode-smart-commit/discussions)
- **Bugs**: [GitHub Issues](https://github.com/maxinne-dev/vscode-smart-commit/issues)
- **Chat**: (Future) Discord/Slack community

### Staying Informed

- **Watch repository**: Get notified of new issues, PRs
- **Star repository**: Show support!
- **Follow releases**: Subscribe to release notifications

### Recognition

All contributors are recognized in:
- CHANGELOG.md (per release)
- GitHub contributors page
- Project README (for significant contributions)

---

## Questions?

Don't hesitate to ask! Open a discussion or comment on an issue. We're here to help.

**Thank you for contributing to Smart Commit!** ✓
