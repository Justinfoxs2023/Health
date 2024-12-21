import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Redis } from '../../utils/redis';

export class LoggingService {
  private static instance: LoggingService;
  private logger: winston.Logger;
  private redis: Redis;

  private constructor() {
    this.redis = new Redis();
    this.initializeLogger();
  }

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private initializeLogger() {
    const esTransport = new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
        auth: {
          username: process.env.ELASTICSEARCH_USER,
          password: process.env.ELASTICSEARCH_PASS,
        },
      },
      indexPrefix: 'health-app-logs',
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: { service: 'health-app' },
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880,
          maxFiles: 5,
        }),
        esTransport,
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    }
  }

  // 记录API访问日志
  async logApiAccess(data: {
    method: string;
    endpoint: string;
    userId?: string;
    duration: number;
    status: number;
    ip: string;
  }) {
    this.logger.info('API Access', {
      type: 'api_access',
      ...data,
    });

    // 缓存最近的API访问记录
    const cacheKey = `api:access:${data.endpoint}`;
    await this.redis.lpush(cacheKey, JSON.stringify(data));
    await this.redis.ltrim(cacheKey, 0, 999); // 保留最近1000条记录
  }

  // 记录错误日志
  async logError(error: Error, context: any = {}) {
    this.logger.error('Error', {
      type: 'error',
      error: {
        message: error.message,
        stack: error.stack,
      },
      context,
    });
  }

  // 记录业务事件
  async logBusinessEvent(event: { type: string; action: string; userId?: string; data: any }) {
    this.logger.info('Business Event', {
      type: 'business_event',
      ...event,
    });
  }

  // 记录系统事件
  async logSystemEvent(event: {
    type: string;
    severity: 'info' | 'warning' | 'error';
    message: string;
    data?: any;
  }) {
    this.logger.log(event.severity, 'System Event', {
      type: 'system_event',
      ...event,
    });
  }

  // 获取日志统计
  async getLogStats(timeRange: string) {
    // 实现日志统计逻辑
    return {};
  }
}
