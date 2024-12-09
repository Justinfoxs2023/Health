import { INestApplication } from '@nestjs/common';
import { MetricsService } from './metrics.service';

export function setupMonitoring(app: INestApplication) {
  const metrics = app.get(MetricsService);
  
  app.use('/metrics', (req, res) => {
    res.set('Content-Type', metrics.contentType);
    res.end(metrics.metrics());
  });
} 