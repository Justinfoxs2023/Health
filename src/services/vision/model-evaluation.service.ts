import { Logger } from '../../utils/logger';
import { ModelTrainingService } from './model-training.service';

export class ModelEvaluationService {
  private logger: Logger;
  private modelTraining: ModelTrainingService;

  constructor() {
    this.logger = new Logger('ModelEvaluation');
    this.modelTraining = new ModelTrainingService();
  }

  // 评估模型性能
  async evaluateModel(modelId: string, testData: any) {
    try {
      const metrics = await this.calculateMetrics(modelId, testData);
      const evaluation = await this.analyzePerformance(metrics);

      await this.storeEvaluationResults(modelId, evaluation);

      return evaluation;
    } catch (error) {
      this.logger.error('模型评估失败:', error);
      throw error;
    }
  }

  // 计算评估指标
  private async calculateMetrics(modelId: string, testData: any) {
    const predictions = await this.getPredictions(modelId, testData);

    return {
      accuracy: this.calculateAccuracy(predictions, testData.labels),
      precision: this.calculatePrecision(predictions, testData.labels),
      recall: this.calculateRecall(predictions, testData.labels),
      f1Score: this.calculateF1Score(predictions, testData.labels),
      confusionMatrix: this.generateConfusionMatrix(predictions, testData.labels),
    };
  }

  // 分析性能
  private async analyzePerformance(metrics: any) {
    return {
      overallScore: this.calculateOverallScore(metrics),
      strengthsAndWeaknesses: this.analyzeStrengthsAndWeaknesses(metrics),
      recommendations: this.generateRecommendations(metrics),
    };
  }

  // 生成性能报告
  async generatePerformanceReport(modelId: string) {
    try {
      const evaluation = await this.getEvaluationResults(modelId);
      const visualizations = await this.createPerformanceVisualizations(evaluation);

      return {
        summary: this.generateSummary(evaluation),
        detailedMetrics: evaluation.metrics,
        visualizations,
        recommendations: evaluation.recommendations,
      };
    } catch (error) {
      this.logger.error('生成性能报告失败:', error);
      throw error;
    }
  }
}
