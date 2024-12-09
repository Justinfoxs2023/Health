import { Logger } from '../../types/logger';

export class LoggerImpl implements Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  error(message: string, error?: any): void {
    console.error(`[${this.context}] ${message}`, error);
  }

  warn(message: string, data?: any): void {
    console.warn(`[${this.context}] ${message}`, data);
  }

  info(message: string, data?: any): void {
    console.info(`[${this.context}] ${message}`, data);
  }
} 