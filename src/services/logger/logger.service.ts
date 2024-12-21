import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { join } from 'path';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface ILogContext {
  /** timestamp 的描述 */
    timestamp: string;
  /** level 的描述 */
    level: import("D:/Health/src/services/logger/logger.service").LogLevel.ERROR | import("D:/Health/src/services/logger/logger.service").LogLevel.WARN | import("D:/Health/src/services/logger/logger.service").LogLevel.INFO | import("D:/Health/src/services/logger/logger.service").LogLevel.DEBUG;
  /** context 的描述 */
    context: string;
  /** userId 的描述 */
    userId: string;
  /** requestId 的描述 */
    requestId: string;
  /** key 的描述 */
    key: string: /** any 的描述 */
    /** any 的描述 */
    any;
}

@Injectable()
export class Logger {
  private logger: winston.Logger;
  private readonly logPath: string;

  constructor(private readonly config: ConfigService) {
    this.logPath = this.config.get('LOG_PATH') || 'logs';
    this.initializeLogger();
  }

  private initializeLogger(): void {
    const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

    this.logger = winston.createLogger({
      level: this.config.get('LOG_LEVEL') || 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        new winston.transports.File({
          filename: join(this.logPath, 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: join(this.logPath, 'combined.log'),
        }),
      ],
    });
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Partial<ILogContext>,
  ): ILogContext {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };
  }

  error(message: string, context?: Partial<ILogContext>): void {
    this.logger.error(this.formatMessage(LogLevel.ERROR, message, context));
  }

  warn(message: string, context?: Partial<ILogContext>): void {
    this.logger.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  info(message: string, context?: Partial<ILogContext>): void {
    this.logger.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  debug(message: string, context?: Partial<ILogContext>): void {
    this.logger.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  setLogLevel(level: LogLevel): void {
    this.logger.level = level;
  }

  async getLogStream(level?: LogLevel, startTime?: Date, endTime?: Date): Promise<string[]> {
    // 实现日志流获取逻辑
    return [];
  }

  async clearLogs(): Promise<void> {
    // 实现日志清理逻辑
  }
}
