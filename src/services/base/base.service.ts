import { Logger, Metrics, AlertService } from '../../types';
import { TYPES } from '../../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export abstract class BaseService {
  constructor(
    @inject() protected logger: Logger,
    @inject() protected metrics: Metrics,
    @inject() protected alertService: AlertService,
  ) {}

  protected async handleError(error: any, message: string): Promise<never> {
    this.logger.error(message, error);
    await this.metrics.incrementCounter('error_count');
    throw error;
  }
}
