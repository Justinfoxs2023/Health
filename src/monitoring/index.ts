import promClient from 'prom-client';
import { Express } from 'express';
import logger from '../utils/logger';

// 创建指标收集器
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();

// 自定义指标
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP请求持续时间',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 3, 5, 10],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_request_total',
  help: 'HTTP请求总数',
  labelNames: ['method', 'route', 'code'],
});

const aiModelPredictionDuration = new promClient.Histogram({
  name: 'ai_model_prediction_duration_seconds',
  help: 'AI模型预测持续时间',
  labelNames: ['model_type', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 20, 30],
});

const aiModelPredictionTotal = new promClient.Counter({
  name: 'ai_model_prediction_total',
  help: 'AI模型预测总数',
  labelNames: ['model_type', 'status'],
});

const cacheHitRatio = new promClient.Gauge({
  name: 'cache_hit_ratio',
  help: '缓存命中率',
  labelNames: ['cache_type'],
});

export function setupMonitoring(app: Express): void {
  try {
    // 启用默认指标收集
    collectDefaultMetrics({ register });

    // 注册��定义指标
    register.registerMetric(httpRequestDurationMicroseconds);
    register.registerMetric(httpRequestTotal);
    register.registerMetric(aiModelPredictionDuration);
    register.registerMetric(aiModelPredictionTotal);
    register.registerMetric(cacheHitRatio);

    // 指标接口
    app.get('/metrics', async (req, res) => {
      try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
      } catch (error) {
        logger.error('获取指标失败', error);
        res.status(500).end();
      }
    });

    // 请求计时中间件
    app.use((req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        const route = req.route ? req.route.path : req.path;
        const method = req.method;
        const code = res.statusCode;

        // 记录请求持续时间
        httpRequestDurationMicroseconds
          .labels(method, route, code.toString())
          .observe(duration / 1000);

        // 增加请求计数
        httpRequestTotal.labels(method, route, code.toString()).inc();
      });

      next();
    });

    logger.info('监控设置完成');
  } catch (error) {
    logger.error('监控设置失败', error);
    throw error;
  }
}

// 导出指标记��函数
export function recordAiModelPrediction(
  modelType: string,
  duration: number,
  status: 'success' | 'failure',
): void {
  aiModelPredictionDuration.labels(modelType, status).observe(duration / 1000);

  aiModelPredictionTotal.labels(modelType, status).inc();
}

export function updateCacheHitRatio(cacheType: string, ratio: number): void {
  cacheHitRatio.labels(cacheType).set(ratio);
}
