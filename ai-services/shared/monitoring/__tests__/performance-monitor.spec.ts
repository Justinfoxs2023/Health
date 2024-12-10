import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceMonitor } from '../performance-monitor';
import * as prometheus from 'prom-client';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformanceMonitor],
    }).compile();

    monitor = module.get<PerformanceMonitor>(PerformanceMonitor);
    
    // 清除所有已注册的指标
    prometheus.register.clear();
  });

  describe('recordTrainingDuration', () => {
    it('应该记录模型训练时间', async () => {
      monitor.recordTrainingDuration('vital-signs', 120);
      
      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('model_training_duration_seconds');
      expect(metrics).toContain('vital-signs');
    });
  });

  describe('recordModelMetrics', () => {
    it('应该记录模型评估指标', async () => {
      monitor.recordModelMetrics('vital-signs', {
        loss: 0.2,
        accuracy: 0.85,
        precision: 0.83,
        recall: 0.87,
        f1Score: 0.85
      });

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('model_evaluation_metrics');
      expect(metrics).toContain('vital-signs');
      expect(metrics).toContain('loss');
      expect(metrics).toContain('accuracy');
    });
  });

  describe('recordDataProcessingDuration', () => {
    it('应该记录数据处理时间', async () => {
      monitor.recordDataProcessingDuration('validation', 1.5);

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('data_processing_duration_seconds');
      expect(metrics).toContain('validation');
    });
  });

  describe('recordValidationError', () => {
    it('应该记录数据验证错误', async () => {
      monitor.recordValidationError('REQUIRED_FIELD_MISSING');

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('data_validation_errors_total');
      expect(metrics).toContain('REQUIRED_FIELD_MISSING');
    });
  });

  describe('recordPredictionLatency', () => {
    it('应该记录模型预测延迟', async () => {
      monitor.recordPredictionLatency('vital-signs', 0.05);

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('model_prediction_latency_seconds');
      expect(metrics).toContain('vital-signs');
    });
  });

  describe('recordCacheHitRate', () => {
    it('应该记录缓存命中率', async () => {
      monitor.recordCacheHitRate('model-cache', 85.5);

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('cache_hit_rate_percent');
      expect(metrics).toContain('model-cache');
    });
  });

  describe('Monitor装饰器', () => {
    class TestClass {
      @PerformanceMonitor.Monitor({
        type: 'training',
        modelType: 'test-model'
      })
      async testTraining(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      @PerformanceMonitor.Monitor({
        type: 'prediction',
        modelType: 'test-model'
      })
      async testPrediction(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      @PerformanceMonitor.Monitor({
        type: 'data_processing',
        operationType: 'validation'
      })
      async testDataProcessing(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      @PerformanceMonitor.Monitor({
        type: 'data_processing',
        operationType: 'validation'
      })
      async testError(): Promise<void> {
        throw new Error('TEST_ERROR');
      }
    }

    let testInstance: TestClass;

    beforeEach(() => {
      testInstance = new TestClass();
    });

    it('应该监控训练方法', async () => {
      await testInstance.testTraining();

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('model_training_duration_seconds');
      expect(metrics).toContain('test-model');
    });

    it('应该监控预测方法', async () => {
      await testInstance.testPrediction();

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('model_prediction_latency_seconds');
      expect(metrics).toContain('test-model');
    });

    it('应该监控数据处理方法', async () => {
      await testInstance.testDataProcessing();

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('data_processing_duration_seconds');
      expect(metrics).toContain('validation');
    });

    it('应该处理错误并记录', async () => {
      try {
        await testInstance.testError();
      } catch (error) {
        const metrics = await monitor.getMetrics();
        expect(metrics).toContain('data_validation_errors_total');
        expect(metrics).toContain('UNKNOWN_ERROR');
      }
    });
  });

  describe('系统资源监控', () => {
    it('应该记录内存使用情况', async () => {
      // 等待一段时间让监控启动
      await new Promise(resolve => setTimeout(resolve, 100));

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('memory_usage_bytes');
      expect(metrics).toContain('heap_used');
      expect(metrics).toContain('heap_total');
      expect(metrics).toContain('rss');
      expect(metrics).toContain('external');
    });

    it('应该记录CPU使用情况', async () => {
      // 等待一段时间让监控启动
      await new Promise(resolve => setTimeout(resolve, 200));

      const metrics = await monitor.getMetrics();
      expect(metrics).toContain('cpu_usage_percent');
      expect(metrics).toContain('user');
      expect(metrics).toContain('system');
    });
  });
}); 