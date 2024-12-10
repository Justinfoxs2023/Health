import { OpenAI } from 'openai';
import { Logger } from '../utils/logger';
import { 
  UserActivity, 
  ThreatAssessment, 
  BehaviorAnalysis, 
  RiskAssessment 
} from '../types/security';

export class SecurityAIService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.logger = new Logger('SecurityAI');
  }

  // 威胁检测
  async detectThreats(activity: UserActivity): Promise<ThreatAssessment> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "分析用户活动，检测潜在的安全威胁"
        }, {
          role: "user",
          content: JSON.stringify(activity)
        }]
      });

      return this.parseThreatAssessment(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('威胁检测失败', error);
      throw error;
    }
  }

  // 行为分析
  async analyzeBehavior(userId: string, activities: UserActivity[]): Promise<BehaviorAnalysis> {
    try {
      // 1. 提取行为模式
      const patterns = await this.extractBehaviorPatterns(activities);
      
      // 2. 检测异常行为
      const anomalies = await this.detectBehaviorAnomalies(activities, patterns);
      
      // 3. 计算风险分数
      const riskScore = await this.calculateRiskScore(patterns, anomalies);

      return {
        userId,
        period: {
          start: activities[0].timestamp,
          end: activities[activities.length - 1].timestamp
        },
        patterns,
        anomalies,
        riskScore,
        recommendations: await this.generateRecommendations(patterns, anomalies)
      };
    } catch (error) {
      this.logger.error('行为分析失败', error);
      throw error;
    }
  }

  // 风险评估
  async assessRisk(action: UserAction, context: any): Promise<RiskAssessment> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "评估用户操作的风险等级"
        }, {
          role: "user",
          content: JSON.stringify({ action, context })
        }]
      });

      return this.parseRiskAssessment(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('风险评估失败', error);
      throw error;
    }
  }

  // 实时监控
  async monitorSecurityEvents(): Promise<void> {
    try {
      // 1. 收集安全事件
      const events = await this.collectSecurityEvents();
      
      // 2. 分析事件
      const analysis = await this.analyzeSecurityEvents(events);
      
      // 3. 处理威胁
      if (analysis.threats.length > 0) {
        await this.handleThreats(analysis.threats);
      }
    } catch (error) {
      this.logger.error('安全监控失败', error);
      throw error;
    }
  }
} 