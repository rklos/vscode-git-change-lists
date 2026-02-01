import * as vscode from 'vscode';

/**
 * Centralized logging utility for the extension
 */
export class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;
  private isDebugEnabled = false;

  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Git Change Lists');
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Get the output channel for subscription
   */
  getOutputChannel(): vscode.OutputChannel {
    return this.outputChannel;
  }

  /**
   * Enable or disable debug logging
   */
  setDebugEnabled(enabled: boolean): void {
    this.isDebugEnabled = enabled;
    this.info(`Debug logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format log message
   */
  private format(level: string, message: string, data?: unknown): string {
    const timestamp = this.getTimestamp();
    let formatted = `[${timestamp}] [${level}] ${message}`;

    if (data !== undefined) {
      try {
        formatted += ` | ${JSON.stringify(data, null, 2)}`;
      } catch (error) {
        formatted += ` | [Unserializable data: ${error}]`;
      }
    }

    return formatted;
  }

  /**
   * Log info message
   */
  info(message: string, data?: unknown): void {
    const formatted = this.format('INFO', message, data);
    this.outputChannel.appendLine(formatted);
  }

  /**
   * Log debug message (only when debug is enabled)
   */
  debug(message: string, data?: unknown): void {
    if (this.isDebugEnabled) {
      const formatted = this.format('DEBUG', message, data);
      this.outputChannel.appendLine(formatted);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: unknown): void {
    const formatted = this.format('WARN', message, data);
    this.outputChannel.appendLine(formatted);
  }

  /**
   * Log error message
   */
  error(message: string, error?: unknown): void {
    let errorData: unknown = error;

    if (error instanceof Error) {
      errorData = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    }

    const formatted = this.format('ERROR', message, errorData);
    this.outputChannel.appendLine(formatted);
  }

  /**
   * Log event with category
   */
  event(category: string, event: string, data?: unknown): void {
    const message = `[${category}] ${event}`;
    const formatted = this.format('EVENT', message, data);
    this.outputChannel.appendLine(formatted);
  }

  /**
   * Show the output channel
   */
  show(): void {
    this.outputChannel.show();
  }

  /**
   * Clear the output channel
   */
  clear(): void {
    this.outputChannel.clear();
  }

  /**
   * Dispose of the logger
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
