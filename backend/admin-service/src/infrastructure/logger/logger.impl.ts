import { ConfigLoader } from '../../config/config.loader';
import { ILogger } from '../../types/logger';
import { createLogger, format, transports } from 'winston';
import { injectable } from 'inversify';

@injectable()
export class LoggerImpl implements ILogger {
  private logger: any;
  private config = ConfigLoader.getInstance();

  constructor() {
    this.logger = createLogger({
      level: this.config.get('LOG_LEVEL', 'info'),
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({
          filename: `${this.config.get('LOG_PATH', './logs')}/error.log`,
          level: 'error',
        }),
        new transports.File({
          filename: `${this.config.get('LOG_PATH', './logs')}/combined.log`,
        }),
      ],
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
