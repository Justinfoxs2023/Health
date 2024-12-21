/**
 * @fileoverview TS 文件 logger.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ILogger {
  info(message: string, ...args: any[]): void;
  error(message: string, error: Error | unknown, context?: string): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export class LoggerImpl implements ILogger {
  constructor(private context: string) {}

  info(message: string, ...args: any[]): void {
    console.log(`[${this.context}] INFO:`, message, ...args);
  }

  error(message: string, error: Error | unknown, context?: string): void {
    console.error(
      'Error in logger.ts:',
      `[${this.context}${context ? `:${context}` : ''}] ERROR:`,
      message,
      error,
    );
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${this.context}] WARN:`, message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    console.debug(`[${this.context}] DEBUG:`, message, ...args);
  }
}
