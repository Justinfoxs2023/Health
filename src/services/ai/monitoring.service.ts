import { Logger } from '../utils/logger';
import { OpenAI } from 'openai';
import { SystemMetrics, Anomaly, OptimizationPlan } from '../types/monitoring';

export class MonitoringService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.logger = new Logger('Monitoring');
  }

  // 系统异常检测
  async detectAnomalies(metrics: SystemMetrics): Promise<Anomaly[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '请分析系统指标并检测异常',
          },
          {
            role: 'user',
            content: JSON.stringify(metrics),
          },
        ],
      });

      return this.parseAnomalies(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('异常检测失败', error);
      throw error;
    }
  }

  // 生成优化建议
  async generateOptimizationPlan(metrics: SystemMetrics): Promise<OptimizationPlan> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '请基于系统指标生成性能优化建议',
          },
          {
            role: 'user',
            content: JSON.stringify(metrics),
          },
        ],
      });

      return this.parseOptimizationPlan(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('生成优化建议失败', error);
      throw error;
    }
  }
}
