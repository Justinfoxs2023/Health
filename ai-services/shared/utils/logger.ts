import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';

/** 日志工具类 */
export class Logger {
  private logger: any;
  private context: string;

  constructor(context: string) {
    this.context = context;
    this.initializeLogger();
  }

  /**
   * 初始化日志记录器
   */
  private initializeLogger(): void {
    const logDir = process.env.LOG_PATH || './logs';
    const logLevel = process.env.LOG_LEVEL || 'debug';
    const maxSize = process.env.LOG_MAX_SIZE || '10m';
    const maxFiles = process.env.LOG_MAX_FILES || '7d';

    // 创建格式化器
    const customFormat = format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
      format.printf(({ timestamp, level, message, context, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}] [${context || this.context}] ${message}`;
        if (meta.stack) {
          log += `\n${meta.stack}`;
        } else if (Object.keys(meta).length > 0) {
          log += ` ${JSON.stringify(meta)}`;
        }
        return log;
      })
    );

    // 创建日志传输器
    const logTransports = [
      // 控制台输出
      new transports.Console({
        level: logLevel,
        format: format.combine(
          format.colorize(),
          customFormat
        )
      }),

      // 错误日志文件
      new DailyRotateFile({
        level: 'error',
        filename: join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize,
        maxFiles,
        format: customFormat
      }),

      // 组合日志文件
      new DailyRotateFile({
        filename: join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize,
        maxFiles,
        format: customFormat
      })
    ];

    // 创建日志记录器
    this.logger = createLogger({
      level: logLevel,
      format: customFormat,
      transports: logTransports,
      exitOnError: false
    });

    // 处理未捕获的异常
    process.on('uncaughtException', (error) => {
      this.error('未捕获的异常', error);
      process.exit(1);
    });

    // 处理未处理的Promise拒绝
    process.on('unhandledRejection', (reason, promise) => {
      this.error('未处理的Promise拒绝', { reason, promise });
    });
  }

  /**
   * 记录调试级别日志
   * @param message 日志消息
   * @param meta 元数据
   */
  public debug(message: string, meta?: any): void {
    this.logger.debug(message, { context: this.context, ...meta });
  }

  /**
   * 记录信息级别日志
   * @param message 日志消息
   * @param meta 元数据
   */
  public info(message: string, meta?: any): void {
    this.logger.info(message, { context: this.context, ...meta });
  }

  /**
   * 记录警告级别日志
   * @param message 日志消息
   * @param meta 元数据
   */
  public warn(message: string, meta?: any): void {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  /**
   * 记录错误级别日志
   * @param message 日志消息
   * @param error 错误对象
   * @param meta 元数据
   */
  public error(message: string, error?: Error | any, meta?: any): void {
    if (error instanceof Error) {
      this.logger.error(message, {
        context: this.context,
        stack: error.stack,
        ...meta
      });
    } else {
      this.logger.error(message, {
        context: this.context,
        error,
        ...meta
      });
    }
  }

  /**
   * 记录HTTP请求日志
   * @param req 请求对象
   * @param res 响应对象
   * @param duration 处理时间
   */
  public logHttpRequest(req: any, res: any, duration: number): void {
    const { method, originalUrl, ip, headers } = req;
    const { statusCode } = res;

    this.info('HTTP请求', {
      method,
      url: originalUrl,
      statusCode,
      duration,
      ip,
      userAgent: headers['user-agent']
    });
  }

  /**
   * 记录数据库操作日志
   * @param operation 操作类型
   * @param collection 集合名称
   * @param duration 执行时间
   * @param meta 元数据
   */
  public logDatabaseOperation(
    operation: string,
    collection: string,
    duration: number,
    meta?: any
  ): void {
    this.debug('数据库操作', {
      operation,
      collection,
      duration,
      ...meta
    });
  }

  /**
   * 记录缓存操作日志
   * @param operation 操作类型
   * @param key 缓存键
   * @param duration 执行时间
   * @param meta 元数据
   */
  public logCacheOperation(
    operation: string,
    key: string,
    duration: number,
    meta?: any
  ): void {
    this.debug('缓存操作', {
      operation,
      key,
      duration,
      ...meta
    });
  }

  /**
   * 记录AI模型操作日志
   * @param model 模型名称
   * @param operation 操作类型
   * @param duration 执行时间
   * @param meta 元数据
   */
  public logModelOperation(
    model: string,
    operation: string,
    duration: number,
    meta?: any
  ): void {
    this.debug('AI模型操作', {
      model,
      operation,
      duration,
      ...meta
    });
  }

  /**
   * 记录性能指标
   * @param metric 指标名称
   * @param value 指标值
   * @param meta 元数据
   */
  public logMetric(metric: string, value: number, meta?: any): void {
    this.info('性能指标', {
      metric,
      value,
      ...meta
    });
  }

  /**
   * 记录安全事件
   * @param event 事件类型
   * @param severity 严重程度
   * @param meta 元数据
   */
  public logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    meta?: any
  ): void {
    this.warn('安全事件', {
      event,
      severity,
      ...meta
    });
  }

  /**
   * 记录业务事件
   * @param event 事件类型
   * @param status 状态
   * @param meta 元数据
   */
  public logBusinessEvent(
    event: string,
    status: 'success' | 'failure' | 'pending',
    meta?: any
  ): void {
    this.info('业务事件', {
      event,
      status,
      ...meta
    });
  }

  /**
   * 记录系统事件
   * @param event 事件类型
   * @param meta 元数据
   */
  public logSystemEvent(event: string, meta?: any): void {
    this.info('系统事件', {
      event,
      ...meta
    });
  }

  /**
   * 记录审计日志
   * @param user 用户信息
   * @param action 操作类型
   * @param resource 资源信息
   * @param meta 元数据
   */
  public logAudit(
    user: { id: string; name: string },
    action: string,
    resource: { type: string; id: string },
    meta?: any
  ): void {
    this.info('审计日志', {
      user,
      action,
      resource,
      timestamp: new Date().toISOString(),
      ...meta
    });
  }

  /**
   * 记录错误报告
   * @param error 错误对象
   * @param context 上下文信息
   */
  public logErrorReport(error: Error, context?: any): void {
    this.error('错误报告', error, {
      context,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version
    });
  }
} 