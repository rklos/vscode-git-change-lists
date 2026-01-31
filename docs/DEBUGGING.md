# Debugging Smart Commit

This guide explains how to use the logging features to debug the Smart Commit extension.

## Enabling Debug Logging

By default, the extension only logs INFO, WARN, and ERROR messages. To enable verbose DEBUG logging:

### Method 1: VS Code Settings UI

1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Smart Commit"
3. Check **"Debug: Enable Logging"**
4. Restart the Extension Development Host (or reload the window)

### Method 2: settings.json

Add this to your `settings.json`:

```json
{
  "smartCommit.debug.enableLogging": true
}
```

## Viewing Logs

### Open the Output Panel

1. Press `Ctrl+Shift+U` (or `Cmd+Shift+U` on Mac)
2. Select **"Smart Commit"** from the dropdown in the top-right

Alternatively:
- View → Output → Select "Smart Commit"

## Log Levels

The extension uses different log levels:

| Level | Description | When to Use |
|-------|-------------|-------------|
| **DEBUG** | Verbose details | Only when `debug.enableLogging` is true |
| **INFO** | General operations | Always logged |
| **WARN** | Unexpected but handled | Always logged |
| **ERROR** | Failures and exceptions | Always logged |
| **EVENT** | Specific events (Git, ChangeList, Config) | Always logged |

## What Gets Logged

### With Debug Logging Disabled (Default)

- Extension activation/deactivation
- Change list operations (create, delete, rename, move files)
- Git operations (stage, unstage, commit)
- Commit guard actions
- File auto-assignment
- Post-commit cleanup
- Errors and warnings

### With Debug Logging Enabled

All of the above, plus:

- Git service initialization steps
- Repository setup details
- File staging detection
- State change events
- Tree view refreshes
- Configuration changes
- Internal operation details

## Example Log Output

### Normal Operation (INFO level)

```
[2026-01-30T10:15:23.456Z] [INFO] Activating Smart Commit extension...
[2026-01-30T10:15:23.567Z] [INFO] Git service initialized successfully
[2026-01-30T10:15:23.678Z] [INFO] ChangeListManager: Initialized | {"listCount":2,"activeList":"Feature A"}
[2026-01-30T10:15:23.789Z] [INFO] Smart Commit extension activated successfully!
[2026-01-30T10:15:45.123Z] [EVENT] [Git] Files staged | {"count":1,"files":["src/main.ts"]}
[2026-01-30T10:15:45.234Z] [INFO] Auto-assigned file to active list | {"file":"src/main.ts","list":"Feature A"}
```

### Debug Mode (DEBUG level)

```
[2026-01-30T10:15:23.456Z] [INFO] Activating Smart Commit extension...
[2026-01-30T10:15:23.567Z] [DEBUG] Initializing Git service...
[2026-01-30T10:15:23.578Z] [DEBUG] GitService: Looking for vscode.git extension...
[2026-01-30T10:15:23.589Z] [DEBUG] GitService: Got Git API (version 1)
[2026-01-30T10:15:23.590Z] [INFO] GitService: Repository set up | {"rootUri":"c:/Users/user/project","repositoryCount":1}
[2026-01-30T10:15:23.600Z] [INFO] Git service initialized successfully
[2026-01-30T10:15:23.610Z] [DEBUG] Initializing change list manager...
[2026-01-30T10:15:23.620Z] [DEBUG] ChangeListManager: Restoring saved state | {"version":1,"listCount":2,"fileMappingCount":5}
[2026-01-30T10:15:23.630Z] [INFO] ChangeListManager: Initialized | {"listCount":2,"activeList":"Feature A"}
```

## Common Debugging Scenarios

### Files Not Auto-Assigning to Active List

Enable debug logging and check for:
```
[DEBUG] Auto-assignment: Active list is "..."
[DEBUG] Skipped auto-assignment | {"file":"...","reason":"..."}
```

Possible reasons:
- File already assigned to a non-default list
- Active list is the default list
- Auto-assignment is disabled in settings

### Commit Guard Not Triggering

Look for:
```
[DEBUG] CommitGuard: Guard disabled, proceeding with commit
```

Check:
- Is `commitGuard.enabled` set to `true`?
- Are you using the guarded commit command?
- Is `commitGuard.interceptCommit` enabled (if using native commit)?

### Files Not Appearing in Change Lists

Check for:
```
[EVENT] [Git] State changed
[DEBUG] TreeDataProvider: Refreshing tree view
```

If missing:
- Verify Git repository is open
- Check if files are actually modified (use `git status`)
- Look for errors in the log

### Post-Commit Cleanup Not Working

Look for:
```
[EVENT] [Git] Commit detected | {"fileCount":...}
[INFO] Post-commit cleanup completed | {"removedFiles":...}
```

If missing, the commit detection may not be working. Check:
- HEAD change detection logs
- Staged file tracking

## Performance Impact

Debug logging has minimal performance impact:
- Logs are written asynchronously to the output channel
- No file I/O (logs only go to memory/UI)
- Negligible overhead for production use

However, for very large repositories (1000+ files), you may want to disable debug logging to reduce console noise.

## Reporting Issues

When reporting bugs, please:

1. Enable debug logging
2. Reproduce the issue
3. Copy the relevant log output
4. Include in your bug report on GitHub

You can clear the log with the trash icon in the Output panel if needed.

## Log Data Privacy

The logs may contain:
- File paths from your project
- Change list names
- Commit messages (when committing)
- Git operation details

No sensitive data (passwords, secrets) is logged. However, be mindful when sharing logs publicly if your file paths or commit messages contain private information.

---

**Tip:** You can filter the output panel by typing in the search box. For example, search for "ERROR" to find only errors.

---

## See Also

- [FAQ.md](FAQ.md) - Common questions and troubleshooting
- [CONFIGURATION.md](CONFIGURATION.md#smartcommitdebugenablelogging) - Debug logging configuration details
- [CONTRIBUTING.md](CONTRIBUTING.md#reporting-bugs) - Reporting issues with logs

For general troubleshooting, see the [FAQ Troubleshooting section](FAQ.md#troubleshooting) or [open an issue](https://github.com/maxinne-dev/vscode-smart-commit/issues) with your debug logs attached.
