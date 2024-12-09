import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';
import { Metrics } from '../../utils/metrics';

export class PerformanceMonitorMiddleware {
  private logger: Logger;
  private metrics: Metrics;

  constructor() {
    this.logger = new Logger('PerformanceMonitor');
    this.metrics = new Metrics();
  }

  // 性能监控
  monitorPerformance(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const path = req.path;

    // 监控响应时间
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // 记录性能指标
      this.metrics.recordTiming('api_response_time', duration, {
        path,
        method: req.method,
        status: res.statusCode
      });

      // 检查性能阈值
      if (duration > 1000) {
        this.logger.warn('API响应时间过长', {
          path,
          duration,
          method: req.method
        });
      }
    });

    next();
  }
}

export const performanceMonitor = new PerformanceMonitorMiddleware(); 