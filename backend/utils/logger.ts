/**
 * @fileoverview TS 文件 logger.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  error(message: string, error?: any) {
    console.error('Error in logger.ts:', `[${this.context}] ${message}`, error);
  }

  info(message: string) {
    console.info(`[${this.context}] ${message}`);
  }

  warn(message: string) {
    console.warn(`[${this.context}] ${message}`);
  }

  debug(message: string) {
    console.debug(`[${this.context}] ${message}`);
  }
}

export const logger = new Logger('App');
