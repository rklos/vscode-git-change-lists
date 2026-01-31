import * as vscode from 'vscode';
import { AnyTreeNode, FileNode } from '../types';
import { ChangeListManager } from '../services/changeListManager';
import { ChangeListTreeDataProvider } from './treeDataProvider';
import { DRAG_MIME_TYPE } from '../utils/constants';

/**
 * Controller for drag and drop operations in the change list tree
 */
export class ChangeListDragDropController
  implements vscode.TreeDragAndDropController<AnyTreeNode>
{
  readonly dropMimeTypes = [DRAG_MIME_TYPE];
  readonly dragMimeTypes = [DRAG_MIME_TYPE];

  constructor(
    private readonly changeListManager: ChangeListManager,
    private readonly treeDataProvider: ChangeListTreeDataProvider
  ) {}

  /**
   * Handle drag start
   */
  handleDrag(
    source: readonly AnyTreeNode[],
    dataTransfer: vscode.DataTransfer,
    _token: vscode.CancellationToken
  ): void {
    // Only allow dragging files
    const fileNodes = source.filter((node): node is FileNode => node.type === 'file');

    if (fileNodes.length === 0) {
      return;
    }

    // Store file paths in data transfer
    const filePaths = fileNodes.map((node) => node.change.resourceUri.fsPath);
    dataTransfer.set(DRAG_MIME_TYPE, new vscode.DataTransferItem(filePaths));
  }

  /**
   * Handle drop
   */
  async handleDrop(
    target: AnyTreeNode | undefined,
    dataTransfer: vscode.DataTransfer,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Only allow dropping on change lists
    if (!target || target.type !== 'changeList') {
      return;
    }

    const item = dataTransfer.get(DRAG_MIME_TYPE);
    if (!item) {
      return;
    }

    const filePaths = item.value as string[];
    if (!filePaths || filePaths.length === 0) {
      return;
    }

    // Move files to target change list
    try {
      await this.changeListManager.moveFiles(filePaths, target.changeList.id);
      this.treeDataProvider.refresh();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to move files: ${error}`);
    }
  }
}
