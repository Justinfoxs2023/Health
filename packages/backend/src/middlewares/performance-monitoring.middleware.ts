import { PerformanceMonitor } from '../services/monitoring/performance-monitor';
import { Request, Response, NextFunction } from 'express';

export const performanceMonitoringMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  const monitor = new PerformanceMonitor();

  // 开始监控
  monitor.startRequest({
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  // 响应监控
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    monitor.endRequest({
      duration,
      statusCode: res.statusCode,
      responseSize: parseInt(res.get('Content-Length') || '0'),
    });
  });

  next();
};
