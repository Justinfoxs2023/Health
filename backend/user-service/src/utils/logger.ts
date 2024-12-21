import { ILogger } from '../types/logger';
import { injectable } from 'inversify';

@injectable()
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
