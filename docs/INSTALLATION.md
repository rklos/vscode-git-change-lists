# Smart Commit Installation Guide

Detailed installation instructions for all supported editors.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Supported Editors](#supported-editors)
- [Installation Methods](#installation-methods)
  - [From Marketplace (Visual Studio Code)](#from-marketplace-visual-studio-code)
  - [From VSIX File (All Editors)](#from-vsix-file-all-editors)
  - [From Source (Developers)](#from-source-developers)
- [Editor-Specific Instructions](#editor-specific-instructions)
  - [Visual Studio Code](#visual-studio-code)
  - [Cursor](#cursor)
  - [Kiro](#kiro)
  - [Windsurf](#windsurf)
  - [Trae](#trae)
  - [VSCodium](#vscodium)
  - [Google Antigravity](#google-antigravity)
- [Verification](#verification)
- [Initial Configuration](#initial-configuration)
- [Updating](#updating)
- [Troubleshooting](#troubleshooting)
- [Uninstallation](#uninstallation)

---

## Prerequisites

Before installing Smart Commit, ensure you have:

### Required

1. **Git** installed on your system
   - Version: 2.0 or higher recommended
   - Check: Run `git --version` in terminal
   - Download: [git-scm.com](https://git-scm.com/)

2. **Supported Editor** (one of):
   - Visual Studio Code 1.103.0 or higher
   - Cursor (latest version)
   - Kiro (latest version)
   - Windsurf (latest version)
   - Trae (latest version)
   - VSCodium 1.103.0 or higher
   - Google Antigravity (latest version)

### Optional

- **Git Configuration**: Name and email set for commits
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

---

## Supported Editors

Smart Commit has been tested and verified on the following editors:

| Editor | Platform | Tested Version | Notes |
|--------|----------|----------------|-------|
| **Visual Studio Code** | Windows, macOS, Linux | 1.103.0+ | Full support |
| **Cursor** | Windows, macOS, Linux | Latest | Full support |
| **Kiro** | Windows, macOS, Linux | Latest | Full support |
| **Windsurf** | Windows, macOS, Linux | Latest | Full support |
| **Trae** | Windows, macOS, Linux | Latest | Full support |
| **VSCodium** | Windows, macOS, Linux | 1.103.0+ | Full support (binary-free VS Code) |
| **Google Antigravity** | Cross-platform | Latest | Full support |

All editors must have the built-in Git extension enabled (it's enabled by default).

---

## Installation Methods

### From Marketplace (Visual Studio Code)

The easiest method for VS Code users:

1. **Open Extensions View**
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
   - Or: View → Extensions

2. **Search for Extension**
   - Type "Smart Commit" in the search box
   - Look for the extension published by `maxie-homrich`

3. **Install**
   - Click the **Install** button
   - Wait for installation to complete (usually 5-10 seconds)

4. **Reload** (if prompted)
   - Click **Reload** if VS Code asks
   - Or: Close and reopen VS Code

**Marketplace Link:** (Will be available after publishing)
[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/)

---

### From VSIX File (All Editors)

Install from a downloaded `.vsix` file:

#### Step 1: Download VSIX

- **From Releases**: [GitHub Releases](https://github.com/maxinne-dev/vscode-smart-commit/releases)
- **From Marketplace**: Download VSIX option (right side of extension page)

#### Step 2: Install VSIX

**Method A: Command Palette**

1. Open Command Palette: `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Run: `Extensions: Install from VSIX...`
3. Navigate to downloaded `.vsix` file
4. Select and click **Open**
5. Wait for installation confirmation

**Method B: Extensions View**

1. Open Extensions View: `Ctrl+Shift+X` / `Cmd+Shift+X`
2. Click the **...** (More Actions) button at the top
3. Select **Install from VSIX...**
4. Navigate to downloaded `.vsix` file
5. Select and click **Open**

**Method C: Command Line**

```bash
# Visual Studio Code
code --install-extension smart-commit-1.0.0.vsix

# VSCodium
codium --install-extension smart-commit-1.0.0.vsix

# Cursor
cursor --install-extension smart-commit-1.0.0.vsix
```

Replace `smart-commit-0.0.1.vsix` with the actual filename.

---

### From Source (Developers)

Build and install from source code:

#### Step 1: Clone Repository

```bash
git clone https://github.com/maxinne-dev/vscode-smart-commit.git
cd vscode-smart-commit
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Compile TypeScript

```bash
npm run compile
```

#### Step 4: Package Extension

```bash
npm run package
```

This creates `smart-commit-1.0.0.vsix` in the current directory.

#### Step 5: Install VSIX

Follow [From VSIX File](#from-vsix-file-all-editors) instructions above.

For development mode (no packaging required), see [DEVELOPMENT.md](DEVELOPMENT.md).

---

## Editor-Specific Instructions

### Visual Studio Code

**Standard Installation**

1. Preferred method: [From Marketplace](#from-marketplace-visual-studio-code)
2. Alternative: [From VSIX](#from-vsix-file-all-editors)

**Portable Installation**

If using VS Code Portable:
1. Install via VSIX method
2. Extensions install to `data/extensions/` folder

**Workspace Recommendations**

Add to `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "maxie-homrich.smart-commit"
  ]
}
```

Team members will see a prompt to install when opening the workspace.

---

### Cursor

Cursor is a VS Code fork with AI features. Smart Commit works identically to VS Code.

**Installation**

1. **Via Extensions Panel**: Same as VS Code (see above)
2. **Via VSIX**: Use `cursor --install-extension` command

**Differences from VS Code**

- None! Cursor's extension system is identical to VS Code
- All features work exactly the same
- Settings sync with VS Code if enabled

**Cursor-Specific Notes**

- Smart Commit is compatible with Cursor's AI features
- Commit messages can be enhanced by Cursor's AI
- No conflicts with Cursor's Git integration

---

### Kiro

**Installation**

1. Open Kiro
2. Navigate to Extensions: `Ctrl+Shift+X` / `Cmd+Shift+X`
3. Search for "Smart Commit" or install from VSIX
4. Restart Kiro if prompted

**Kiro-Specific Notes**

- Extension path: `~/.kiro/extensions/` (Linux/Mac) or `%USERPROFILE%\.kiro\extensions\` (Windows)
- Configuration syncs with Kiro's settings
- Compatible with Kiro's collaborative features

---

### Windsurf

**Installation**

1. Open Windsurf
2. Extensions: `Ctrl+Shift+X` / `Cmd+Shift+X`
3. Install "Smart Commit" from marketplace or VSIX

**Windsurf-Specific Notes**

- Extensions stored in Windsurf's data directory
- Settings accessible via Windsurf Settings UI
- Works alongside Windsurf's project management features

---

### Trae

**Installation**

1. Open Trae
2. Extensions Panel: `Ctrl+Shift+X` / `Cmd+Shift+X`
3. Search and install "Smart Commit"

**Trae-Specific Notes**

- Extension location: Trae's extensions folder
- Configuration via Trae's settings
- Compatible with Trae's workflow automation

---

### VSCodium

VSCodium is a Microsoft-free distribution of VS Code. Smart Commit works identically.

**Installation**

1. **From Open VSX**: (If using Open VSX marketplace)
   - Search for "Smart Commit" in Extensions
   - Install directly

2. **From VSIX**:
   ```bash
   codium --install-extension smart-commit-1.0.0.vsix
   ```

**VSCodium-Specific Notes**

- Extension path: `~/.vscode-oss/extensions/` (Linux/Mac) or `%USERPROFILE%\.vscode-oss\extensions\` (Windows)
- Settings stored separately from VS Code
- No telemetry sent (VSCodium is telemetry-free)
- Compatible with all VSCodium themes and extensions

**Open VSX Registry**

If Smart Commit is published to Open VSX, it will appear in VSCodium's default marketplace.

---

### Google Antigravity

**Installation**

1. Open Google Antigravity
2. Access Extensions: `Ctrl+Shift+X` / `Cmd+Shift+X`
3. Install "Smart Commit" from available sources

**Antigravity-Specific Notes**

- Extension integration with Antigravity's features
- Settings accessible via Antigravity settings
- Compatible with Antigravity's project structure

---

## Verification

After installation, verify Smart Commit is working:

### Step 1: Check Extension is Installed

1. Open Extensions view: `Ctrl+Shift+X` / `Cmd+Shift+X`
2. Search for "Smart Commit"
3. Should show **Installed** status
4. Click to view extension details

### Step 2: Open a Git Repository

1. Open a folder containing a Git repository
2. Or initialize a new one: `git init`

### Step 3: Verify Change Lists View

1. Open Source Control panel: `Ctrl+Shift+G` / `Cmd+Shift+G`
2. Look for **Change Lists** section below the standard Git view
3. Should see "Default" change list

### Step 4: Check Commands

1. Open Command Palette: `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type "Smart Commit"
3. Should see commands like:
   - Smart Commit: Create Change List
   - Smart Commit: Set Active List
   - Smart Commit: Refresh
   - etc.

### Step 5: Test Basic Functionality

1. Make a change to a file (or create a new file)
2. File should appear in "Default" change list
3. Right-click the file → **Move to Change List** should work
4. Status bar should show `[Default]` (if `showStatusBar` is enabled)

If all steps pass, Smart Commit is installed and working correctly!

---

## Initial Configuration

After installation, consider configuring Smart Commit to match your workflow:

### Recommended First Steps

1. **Set Default View Mode**
   ```json
   {
     "smartCommit.defaultViewMode": "tree"  // or "list"
   }
   ```

2. **Enable Commit Guard with Interception** (Optional)
   ```json
   {
     "smartCommit.commitGuard.interceptCommit": true
   }
   ```
   Restart VS Code after enabling.

3. **Adjust Status Bar** (Optional)
   ```json
   {
     "smartCommit.showStatusBar": false  // if you prefer hidden
   }
   ```

4. **Create Your First Change List**
   - Command Palette → `Smart Commit: Create Change List`
   - Name it after your current task

See [CONFIGURATION.md](CONFIGURATION.md) for all settings.

---

## Updating

### Automatic Updates (VS Code Marketplace)

If installed from marketplace:
- Updates are automatic (by default)
- VS Code notifies when updates are available
- Click **Update** button in Extensions view
- Or: Enable auto-update in VS Code settings

### Manual Update from VSIX

1. Download new `.vsix` file from [Releases](https://github.com/maxinne-dev/vscode-smart-commit/releases)
2. Install new VSIX (overwrites old version)
3. Reload editor

### Checking Version

- Open Extensions view
- Find "Smart Commit"
- Version number is displayed next to the name
- Click extension to see full details and changelog

### Update Best Practices

- Review [CHANGELOG.md](CHANGELOG.md) before updating
- Check for breaking changes
- Back up your settings before major version updates

---

## Troubleshooting

### Extension Not Appearing

**Issue:** Can't find Smart Commit in Extensions view.

**Solutions:**
1. **Check spelling**: Search for "Smart Commit" (exact)
2. **Check filters**: Click "..." → Clear Filters
3. **Restart editor**: Close and reopen
4. **Check installation log**: Help → Toggle Developer Tools → Console tab

---

### Extension Not Activating

**Issue:** Extension is installed but Change Lists view doesn't appear.

**Solutions:**
1. **Open a Git repo**: Extension only activates with Git repositories
2. **Check Git extension**: Ensure built-in Git extension is enabled
3. **Restart editor**: Reload window (Developer: Reload Window)
4. **Check activation events**: View → Output → Select "Smart Commit"

---

### VSIX Installation Fails

**Issue:** Error when installing from VSIX file.

**Solutions:**
1. **Check file integrity**: Re-download VSIX
2. **Check permissions**: Ensure write access to extensions folder
3. **Use command line**: Try `code --install-extension` command
4. **Check version compatibility**: Ensure editor meets minimum version

---

### Git Not Found

**Issue:** Smart Commit shows "Git not found" error.

**Solutions:**
1. **Install Git**: Download from [git-scm.com](https://git-scm.com/)
2. **Add to PATH**: Ensure Git is in system PATH
3. **Restart editor**: After installing Git
4. **Check Git setting**: `git.path` in VS Code settings

---

### Settings Not Saving

**Issue:** Configuration changes don't persist.

**Solutions:**
1. **Check settings scope**: Workspace vs User settings
2. **Check syntax**: Ensure valid JSON in `settings.json`
3. **Restart required**: Some settings need editor restart
4. **Check file permissions**: Ensure settings.json is writable

---

## Uninstallation

### Via Extensions View

1. Open Extensions: `Ctrl+Shift+X` / `Cmd+Shift+X`
2. Find "Smart Commit"
3. Click **Uninstall** button
4. Reload editor if prompted

### Via Command Line

```bash
# Visual Studio Code
code --uninstall-extension maxie-homrich.smart-commit

# VSCodium
codium --uninstall-extension maxie-homrich.smart-commit

# Cursor
cursor --uninstall-extension maxie-homrich.smart-commit
```

### Removing Settings

After uninstalling, optionally remove settings:

1. Open `settings.json`
2. Remove all `smartCommit.*` settings
3. Or: Use Settings UI → Search "Smart Commit" → Click "X" on each setting

### Removing State

Extension state is stored in workspace storage:
- Automatically cleaned up on uninstall
- No manual cleanup required

---

## Getting Help

If you encounter issues during installation:

1. **Check FAQ**: [docs/FAQ.md](FAQ.md)
2. **Search Issues**: [GitHub Issues](https://github.com/maxinne-dev/vscode-smart-commit/issues)
3. **Open New Issue**: Provide:
   - Editor name and version
   - Operating system
   - Installation method attempted
   - Error messages or logs
   - Steps to reproduce

---

## Next Steps

After successful installation:

1. **Read User Guide**: [USER_GUIDE.md](USER_GUIDE.md) for workflows
2. **Explore Features**: [FEATURES.md](FEATURES.md) for details
3. **Configure Settings**: [CONFIGURATION.md](CONFIGURATION.md) for customization
4. **Join Community**: [GitHub Discussions](https://github.com/maxinne-dev/vscode-smart-commit/discussions)

---

Happy committing with Smart Commit! ✓
