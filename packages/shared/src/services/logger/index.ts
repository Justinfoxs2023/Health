import { storage } from '../storage';

/** 日志级别 */
export type LogLevelType = 'debug' | 'info' | 'warn' | 'error';

/** 日志配置 */
export interface ILoggerConfig {
  /** 日志级别 */
  level: LogLevelType;
  /** 是否启用控制台输出 */
  enableConsole?: boolean;
  /** 是否启用存储 */
  enableStorage?: boolean;
  /** 存储保留时间（毫秒） */
  storageTTL?: number;
  /** 最大存储条数 */
  maxStorageEntries?: number;
  /** 自定义日志处理器 */
  customHandler?: (entry: ILogEntry) => void;
}

/** 日志条目 */
export interface ILogEntry {
  /** 时间戳 */
  timestamp: number;
  /** 日志级别 */
  level: LogLevelType;
  /** 消息 */
  message: string;
  /** 额外数据 */
  data?: any;
  /** 错误堆栈 */
  stack?: string;
  /** 来源 */
  source?: string;
}

const LOG_LEVELS: Record<LogLevelType, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** 日志服务 */
class LoggerService {
  private static instance: LoggerService;
  private config: ILoggerConfig;
  private storageKey = 'logs';

  private constructor(config: ILoggerConfig) {
    this.config = {
      enableConsole: true,
      enableStorage: true,
      storageTTL: 7 * 24 * 60 * 60 * 1000, // 7天
      maxStorageEntries: 1000,
      ...config,
    };
  }

  public static getInstance(config: ILoggerConfig = { level: 'info' }): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(config);
    }
    return LoggerService.instance;
  }

  /** 调试日志 */
  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /** 信息日志 */
  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /** 警告日志 */
  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /** 错误日志 */
  public error(message: string, error?: Error | any): void {
    this.log('error', message, error, error instanceof Error ? error.stack : undefined);
  }

  /** 获取所有日志 */
  public async getLogs(): Promise<ILogEntry[]> {
    if (!this.config.enableStorage) return [];
    return (await storage.getItem<ILogEntry[]>(this.storageKey)) || [];
  }

  /** 清空日志 */
  public async clearLogs(): Promise<void> {
    if (!this.config.enableStorage) return;
    await storage.removeItem(this.storageKey);
  }

  /** 设置配置 */
  public setConfig(config: Partial<ILoggerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /** 获取配置 */
  public getConfig(): ILoggerConfig {
    return { ...this.config };
  }

  private async log(
    level: LogLevelType,
    message: string,
    data?: any,
    stack?: string,
  ): Promise<void> {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.config.level]) return;

    const entry: ILogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
      stack,
      source: this.getSource(),
    };

    // 控制台输出
    if (this.config.enableConsole) {
      this.consoleLog(entry);
    }

    // 存储日志
    if (this.config.enableStorage) {
      await this.storeLog(entry);
    }

    // 自定义处理
    if (this.config.customHandler) {
      this.config.customHandler(entry);
    }
  }

  private consoleLog(entry: ILogEntry): void {
    const { level, message, data, stack } = entry;
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, data);
        break;
      case 'info':
        console.info(prefix, message, data);
        break;
      case 'warn':
        console.warn(prefix, message, data);
        break;
      case 'error':
        console.error('Error in index.ts:', prefix, message, data);
        if (stack) console.error('Error in index.ts:', stack);
        break;
    }
  }

  private async storeLog(entry: ILogEntry): Promise<void> {
    const logs = await this.getLogs();
    logs.push(entry);

    // 限制日志条数
    if (logs.length > this.config.maxStorageEntries!) {
      logs.splice(0, logs.length - this.config.maxStorageEntries!);
    }

    // 移除过期日志
    const now = Date.now();
    const validLogs = logs.filter(log => now - log.timestamp < this.config.storageTTL!);

    await storage.setItem(this.storageKey, validLogs, {
      ttl: this.config.storageTTL,
    });
  }

  private getSource(): string {
    try {
      throw new Error();
    } catch (error) {
      const stack = (error as Error).stack || '';
      const frames = stack.split('\n');
      // 跳过前3帧（Error、getSource、log）
      const frame = frames[3] || '';
      const match = frame.match(/at\s+(.+?)\s+\((.+?)\)/) || frame.match(/at\s+(.+)$/);
      return match ? match[1] : 'unknown';
    }
  }
}

/** 日志服务实例 */
export const logger = LoggerService.getInstance();
