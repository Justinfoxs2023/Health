import { Injectable } from '@nestjs/common';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface ILogger {
  /** infomessage 的描述 */
    infomessage: string, /** args 的描述 */
    /** args 的描述 */
    args: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** warnmessage 的描述 */
    warnmessage: string, /** args 的描述 */
    /** args 的描述 */
    args: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** errormessage 的描述 */
    errormessage: string, /** error 的描述 */
    /** error 的描述 */
    error: Error  /** unknown 的描述 */
    /** unknown 的描述 */
    unknown: void;
  /** debugmessage 的描述 */
    debugmessage: string, /** args 的描述 */
    /** args 的描述 */
    args: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** tracemessage 的描述 */
    tracemessage: string, /** args 的描述 */
    /** args 的描述 */
    args: any: /** void 的描述 */
    /** void 的描述 */
    void;
}

@Injectable()
export class Logger implements ILogger {
  public info(message: string, ...args: any[]): void {
    console.info(`[INFO] ${message}`, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  public error(message: string, error?: Error | unknown): void {
    console.error('Error in Logger.ts:', `[ERROR] ${message}`, error);
  }

  public debug(message: string, ...args: any[]): void {
    console.debug(`[DEBUG] ${message}`, ...args);
  }

  public trace(message: string, ...args: any[]): void {
    console.trace(`[TRACE] ${message}`, ...args);
  }
}
