import * as vscode from 'vscode';
import * as path from 'path';
import { ChangeListManager } from './changeListManager';
import { GitService } from './gitService';
import { logger } from '../utils/logger';
import { ChangeList } from '../types';

/**
 * Service for generating and applying patches
 */
export class PatchService {
    constructor(
        private readonly changeListManager: ChangeListManager,
        private readonly gitService: GitService
    ) { }

    /**
     * Generate a patch for a specific change list
     */
    async generatePatchForList(listId: string): Promise<string> {
        const list = this.changeListManager.getList(listId);
        if (!list) {
            throw new Error(`Change list with ID ${listId} not found`);
        }

        const files = await this.changeListManager.getFilesForList(listId);
        if (files.length === 0) {
            return '';
        }

        // Get absolute paths
        const filePaths = files.map(f => f.resourceUri.fsPath);

        logger.debug('PatchService: Generating patch for list', {
            listName: list.name,
            fileCount: filePaths.length
        });

        return await this.gitService.createPatch(filePaths);
    }

    /**
     * Save patch to a file selected by user
     */
    async savePatchToFile(list: ChangeList, patchContent: string): Promise<void> {
        if (!patchContent) {
            vscode.window.showInformationMessage('Change list is empty or has no diffable changes.');
            return;
        }

        const defaultFileName = `${list.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.patch`;

        const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(defaultFileName),
            filters: {
                'Patch Files': ['patch', 'diff'],
                'All Files': ['*']
            },
            saveLabel: 'Generate Patch'
        });

        if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(patchContent, 'utf8'));
            vscode.window.showInformationMessage(`Patch saved to ${path.basename(uri.fsPath)}`);
            logger.info('PatchService: Patch saved to file', { path: uri.fsPath });
        }
    }

    /**
     * Apply a patch from a file path to a specific change list
     */
    async applyPatchToList(listId: string, patchFilePath: string): Promise<void> {
        const list = this.changeListManager.getList(listId);
        if (!list) {
            throw new Error(`Change list with ID ${listId} not found`);
        }

        logger.debug('PatchService: Applying patch to list', {
            listName: list.name,
            patchPath: patchFilePath
        });

        // 1. Apply the patch via Git
        await this.gitService.applyPatch(patchFilePath);

        // 2. Parse the patch file to find out which files were modified
        // This is a simple parser that looks for "+++ b/path/to/file" lines
        const patchContent = (await vscode.workspace.fs.readFile(vscode.Uri.file(patchFilePath))).toString();
        const affectedFiles = this.parseFilePathsFromPatch(patchContent);

        // 3. Assign those files to the target change list
        if (affectedFiles.length > 0) {
            const workspaceRoot = this.gitService.getWorkspaceRoot();
            if (workspaceRoot) {
                // Convert relative paths in patch to absolute paths
                const absolutePaths = affectedFiles.map(p => path.join(workspaceRoot.fsPath, p));

                await this.changeListManager.moveFiles(absolutePaths, listId);

                vscode.window.showInformationMessage(
                    `Applied patch and moved ${absolutePaths.length} files to "${list.name}"`
                );
            }
        } else {
            vscode.window.showWarningMessage('Patch applied, but could not detect affected files to move to change list.');
        }

        // 4. Refresh UI
        await this.changeListManager.refresh();
    }

    /**
     * Parse affected file paths from a unified diff/patch content
     */
    private parseFilePathsFromPatch(patchContent: string): string[] {
        const files: string[] = [];
        const lines = patchContent.split('\n');

        for (const line of lines) {
            if (!line.startsWith('+++ ')) {
                continue;
            }

            // Standard git diff format: "+++ b/path/to/file" or "+++ "b/path/to/file with spaces""
            // "+++ /dev/null" for deleted files (we might not mistakenly assign /dev/null, but good to ignore)

            let rawPath = line.substring(4).trim(); // Remove "+++ " prefix

            // Ignore /dev/null (deleted files)
            if (rawPath === '/dev/null') {
                continue;
            }

            let filePath = rawPath;

            // Handle quoted paths (e.g., "b/file with spaces.txt" or "b/s\303\263.txt")
            if (rawPath.startsWith('"') && rawPath.endsWith('"')) {
                // Remove quotes
                rawPath = rawPath.substring(1, rawPath.length - 1);

                // Unescape standard C-style escapes often used by Git
                try {
                    // JSON.parse works for standard quotes strings mostly, but octal escapes (\303) aren't valid JSON.
                    // Git uses C-string quoting. We need a basic unescaper.
                    // If it contains backslashes, we try to decode it.
                    if (rawPath.includes('\\')) {
                        // Simple octal/hex decoder for common git escapes
                        filePath = rawPath.replace(/\\([0-7]{1,3})/g, (match, octal) => {
                            return String.fromCharCode(parseInt(octal, 8));
                        }).replace(/\\x([0-9a-fA-F]{2})/g, (match, hex) => {
                            return String.fromCharCode(parseInt(hex, 16));
                        }).replace(/\\(.)/g, (match, char) => {
                            switch (char) {
                                case 't': return '\t';
                                case 'n': return '\n';
                                case 'r': return '\r';
                                case '"': return '"';
                                case '\\': return '\\';
                                default: return char;
                            }
                        });
                    } else {
                        filePath = rawPath;
                    }
                } catch (e) {
                    // Fallback to raw content inside quotes if parsing fails
                    filePath = rawPath;
                }
            }

            // Remove standard git prefixes "a/" or "b/"
            // Usually "+++" line uses "b/"
            if (filePath.startsWith('b/') || filePath.startsWith('a/')) {
                filePath = filePath.substring(2);
            }

            // Handle "new file" special case if any remnants exist (unlikely with decent diffs)

            if (filePath && !files.includes(filePath)) {
                files.push(filePath);
            }
        }

        return files;
    }
}
