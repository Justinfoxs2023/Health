import { injectable } from 'inversify';
import { Logger } from '../types/logger';

@injectable()
export class LoggerImpl implements Logger {
  constructor(private context: string) {}

  info(message: string, ...args: any[]): void {
    console.log(`[${this.context}] INFO:`, message, ...args);
  }

  error(message: string, error: Error | unknown, context?: string): void {
    console.error(`[${this.context}${context ? `:${context}` : ''}] ERROR:`, message, error);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${this.context}] WARN:`, message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    console.debug(`[${this.context}] DEBUG:`, message, ...args);
  }
} 