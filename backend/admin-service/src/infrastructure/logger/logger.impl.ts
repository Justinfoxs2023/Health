import { injectable } from 'inversify';
import { createLogger, format, transports } from 'winston';
import { Logger } from '../../types/logger';
import { ConfigLoader } from '../../config/config.loader';

@injectable()
export class LoggerImpl implements Logger {
  private logger: any;
  private config = ConfigLoader.getInstance();

  constructor() {
    this.logger = createLogger({
      level: this.config.get('LOG_LEVEL', 'info'),
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        }),
        new transports.File({
          filename: `${this.config.get('LOG_PATH', './logs')}/error.log`,
          level: 'error'
        }),
        new transports.File({
          filename: `${this.config.get('LOG_PATH', './logs')}/combined.log`
        })
      ]
    });
  }

  error(message: string, error?: any): void {
    this.logger.error(message, { error });
  }

  warn(message: string, data?: any): void {
    this.logger.warn(message, { data });
  }

  info(message: string, data?: any): void {
    this.logger.info(message, { data });
  }

  debug(message: string, data?: any): void {
    this.logger.debug(message, { data });
  }
} 