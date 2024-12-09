import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Logger, Metrics, AlertService } from '../../types';

@injectable()
export abstract class BaseService {
  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Metrics) protected metrics: Metrics,
    @inject(TYPES.AlertService) protected alertService: AlertService
  ) {}

  protected async handleError(error: any, message: string): Promise<never> {
    this.logger.error(message, error);
    await this.metrics.incrementCounter('error_count');
    throw error;
  }
} 