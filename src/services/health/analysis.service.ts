import { OpenAI } from 'openai';
import { Logger } from '../../utils/logger';
import { 
  HealthAnalysis,
  HealthMetrics,
  HealthTrend,
  HealthInsight 
} from '../../types/health/analysis';

export class HealthAnalysisService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.logger = new Logger('HealthAnalysis');
  }

  // 分析健康数据
  async analyzeHealthData(userId: string, period: string): Promise<HealthAnalysis> {
    try {
      // 1. 收集健康数据
      const healthData = await this.collectHealthData(userId, period);
      
      // 2. 计算健康指标
      const metrics = await this.calculateHealthMetrics(healthData);
      
      // 3. 分析趋势
      const trends = await this.analyzeHealthTrends(healthData);
      
      // 4. 生成洞察
      const insights = await this.generateHealthInsights(metrics, trends);
      
      // 5. 生成建议
      const recommendations = await this.generateRecommendations(insights);

      return {
        userId,
        timestamp: new Date(),
        period,
        metrics,
        trends,
        insights,
        recommendations
      };
    } catch (error) {
      this.logger.error('健康数据分析失败', error);
      throw error;
    }
  }

  // 生成健康洞察
  private async generateHealthInsights(
    metrics: HealthMetrics,
    trends: HealthTrend[]
  ): Promise<HealthInsight[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "分析健康指标和趋势，生成有意义的健康洞察"
        }, {
          role: "user",
          content: JSON.stringify({ metrics, trends })
        }]
      });

      return this.parseInsights(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('生成健康洞察失败', error);
      throw error;
    }
  }

  // 预测健康风险
  async predictHealthRisks(userId: string): Promise<HealthRisk[]> {
    try {
      // 1. 获取历史数据
      const history = await this.getHealthHistory(userId);
      
      // 2. 分析风险因素
      const riskFactors = await this.analyzeRiskFactors(history);
      
      // 3. 预测风险
      return await this.calculateRiskPredictions(riskFactors);
    } catch (error) {
      this.logger.error('健康风险预测失败', error);
      throw error;
    }
  }

  // 生成健康报告
  async generateHealthReport(userId: string, period: string): Promise<HealthReport> {
    try {
      // 1. 获取分析结果
      const analysis = await this.analyzeHealthData(userId, period);
      
      // 2. 生成摘要
      const summary = await this.generateHealthSummary(analysis);
      
      // 3. 添加建议
      const recommendations = await this.generateDetailedRecommendations(analysis);
      
      // 4. 格式化报告
      return this.formatHealthReport(summary, analysis, recommendations);
    } catch (error) {
      this.logger.error('生成健康报告失败', error);
      throw error;
    }
  }

  // 添加类型定义
  private async parseInsights(content: string): Promise<HealthInsight[]> {
    try {
      return JSON.parse(content) as HealthInsight[];
    } catch (error) {
      this.logger.error('解析健康洞察失败', error);
      throw new Error('解析健康洞察失败');
    }
  }

  // 完善错误处理
  private async collectHealthData(userId: string, period: string): Promise<HealthData[]> {
    try {
      const data = await HealthData.find({ 
        userId,
        timestamp: { 
          $gte: this.getStartDate(period),
          $lte: new Date()
        }
      }).sort({ timestamp: 1 });
      
      if (!data || data.length === 0) {
        throw new Error('未找到健康数据');
      }
      
      return data;
    } catch (error) {
      this.logger.error('获取健康数据失败', error);
      throw error;
    }
  }
} 