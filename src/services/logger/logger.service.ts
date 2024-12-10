import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  error(message: string, ...args: any[]): void {
    console.error(`[Error] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[Warning] ${message}`, ...args);
  }

  info(message: string, ...args: any[]): void {
    console.info(`[Info] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    console.debug(`[Debug] ${message}`, ...args);
  }
} 