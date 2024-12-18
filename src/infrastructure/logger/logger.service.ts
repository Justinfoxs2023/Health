import { Injectable } from '@nestjs/common';

@Injectable()
export class Logger {
  constructor(private readonly context?: string) {}

  info(message: string, ...args: any[]) {
    console.log(`[${this.context}] ${message}`, ...args);
  }

  error(message: string, error?: any) {
    console.error('Error in logger.service.ts:', `[${this.context}] ${message}`, error);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[${this.context}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]) {
    console.debug(`[${this.context}] ${message}`, ...args);
  }
}
