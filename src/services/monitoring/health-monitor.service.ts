import { AlertService } from '../alert/alert.service';
import { Logger } from '../../utils/logger';
import { Metrics } from '../../utils/metrics';

export class HealthMonitorService {
  private logger: Logger;
  private metrics: Metrics;
  private alertService: AlertService;

  constructor() {
    this.logger = new Logger('HealthMonitor');
    this.metrics = new Metrics();
    this.alertService = new AlertService();
  }

  async monitorAnalysisPerformance(analysisId: string, duration: number) {
    try {
      await this.metrics.recordTiming('analysis_duration', duration);

      if (duration > 5000) {
        await this.alertService.sendAlert({
          level: 'warning',
          message: `分析耗时过长: ${duration}ms`,
          context: { analysisId },
        });
      }
    } catch (error) {
      this.logger.error('监控分析性能失败', error);
    }
  }
}
