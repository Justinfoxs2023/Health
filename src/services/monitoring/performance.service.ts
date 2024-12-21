import { BaseService } from '../base/base.service';
import { IRequest, IResponse } from '../../types/express';
import { Logger, Metrics, AlertService } from '../../types';
import { TYPES } from '../../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class PerformanceMonitorService extends BaseService {
  constructor(
    @inject() logger: Logger,
    @inject() metrics: Metrics,
    @inject() alertService: AlertService,
    private config: IPerformanceConfig,
  ) {
    super(logger, metrics, alertService);
  }

  async monitorAPIPerformance(req: IRequest, res: IResponse, next: Function) {
    const start = Date.now();
    const path = req.path;

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.recordAPIMetrics(path, duration, res.statusCode);
    });

    next();
  }

  private async recordAPIMetrics(path: string, duration: number, statusCode: number) {
    await this.metrics.recordTiming('api.request.duration', duration, {
      path,
      statusCode: String(statusCode),
    });
  }
}
