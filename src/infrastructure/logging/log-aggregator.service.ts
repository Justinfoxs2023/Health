import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

@Injectable()
export class LogAggregatorService {
  private readonly logger;

  constructor(private readonly config: ConfigService) {
    this.logger = createLogger({
      level: config.get('LOG_LEVEL') || 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        new transports.Console(),
        new transports.File({ 
          filename: 'error.log', 
          level: 'error' 
        }),
        new ElasticsearchTransport({
          level: 'info',
          clientOpts: {
            node: config.get('ELASTICSEARCH_URL')
          },
          index: 'logs'
        })
      ]
    });
  }

  log(level: string, message: string, meta: any = {}) {
    this.logger.log(level, message, {
      ...meta,
      service: this.config.get('SERVICE_NAME'),
      environment: this.config.get('NODE_ENV')
    });
  }

  async query(options: any) {
    // 实现日志查询逻辑
    return [];
  }
} 