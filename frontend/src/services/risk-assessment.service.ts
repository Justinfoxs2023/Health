import { LocalDatabase } from '../utils/local-database';
import { BehaviorAnalysisService } from './behavior-analysis.service';
import { KnowledgeGraphService } from './knowledge-graph.service';

interface RiskFactor {
  id: string;
  type: string;
  weight: number;
  threshold: number;
  indicators: RiskIndicator[];
}

interface RiskIndicator {
  name: string;
  value: number;
  confidence: number;
  source: string;
}

interface RiskAssessment {
  userId: string;
  timestamp: Date;
  overallRisk: number;
  factors: RiskFactorAssessment[];
  recommendations: string[];
}

interface RiskFactorAssessment {
  factorId: string;
  score: number;
  confidence: number;
  details: any;
}

export class RiskAssessmentService {
  private db: LocalDatabase;
  private behaviorService: BehaviorAnalysisService;
  private knowledgeService: KnowledgeGraphService;
  private riskFactors: Map<string, RiskFactor> = new Map();

  constructor() {
    this.db = new LocalDatabase('risk-assessment');
    this.behaviorService = new BehaviorAnalysisService();
    this.knowledgeService = new KnowledgeGraphService();
    this.initialize();
  }

  private async initialize() {
    await this.loadRiskFactors();
  }

  // 加载风险因素
  private async loadRiskFactors() {
    try {
      const factors = await this.db.get('risk-factors');
      if (factors) {
        this.riskFactors = new Map(factors);
      }
    } catch (error) {
      console.error('加载风险因素失败:', error);
    }
  }

  // 评估用户风险
  async assessUserRisk(userId: string): Promise<RiskAssessment> {
    try {
      // 收集风险指标
      const indicators = await this.collectRiskIndicators(userId);
      
      // 评估各个风险因素
      const factorAssessments = await this.assessRiskFactors(indicators);
      
      // 计算总体风险
      const overallRisk = this.calculateOverallRisk(factorAssessments);
      
      // 生成建议
      const recommendations = await this.generateRecommendations(
        factorAssessments,
        overallRisk
      );

      const assessment: RiskAssessment = {
        userId,
        timestamp: new Date(),
        overallRisk,
        factors: factorAssessments,
        recommendations
      };

      await this.saveAssessment(assessment);
      return assessment;
    } catch (error) {
      console.error('风险评估失败:', error);
      throw error;
    }
  }

  // 收集风险指标
  private async collectRiskIndicators(userId: string): Promise<RiskIndicator[]> {
    const indicators: RiskIndicator[] = [];

    // 收集行为指标
    const behaviorIndicators = await this.collectBehaviorIndicators(userId);
    indicators.push(...behaviorIndicators);

    // 收集知识图谱指标
    const graphIndicators = await this.collectGraphIndicators(userId);
    indicators.push(...graphIndicators);

    return indicators;
  }

  // 收集行为指标
  private async collectBehaviorIndicators(userId: string): Promise<RiskIndicator[]> {
    const behavior = await this.behaviorService.getUserBehavior(userId);
    return [
      {
        name: 'activity_pattern',
        value: behavior.activityScore,
        confidence: behavior.confidence,
        source: 'behavior_analysis'
      }
      // ... 其他行为指标
    ];
  }

  // 收集图谱指标
  private async collectGraphIndicators(userId: string): Promise<RiskIndicator[]> {
    const userNode = await this.knowledgeService.queryNodes({
      patterns: [{ nodeType: 'user' }],
      filters: [{ property: 'id', operator: 'eq', value: userId }]
    });

    if (userNode.length === 0) return [];

    const neighbors = await this.knowledgeService.getNodeNeighbors(userNode[0].id);
    return [
      {
        name: 'relationship_density',
        value: neighbors.relations.length,
        confidence: 0.9,
        source: 'knowledge_graph'
      }
      // ... 其他图谱指标
    ];
  }

  // 评估风险因素
  private async assessRiskFactors(
    indicators: RiskIndicator[]
  ): Promise<RiskFactorAssessment[]> {
    const assessments: RiskFactorAssessment[] = [];

    for (const [factorId, factor] of this.riskFactors) {
      const relevantIndicators = indicators.filter(
        indicator => factor.indicators.some(fi => fi.name === indicator.name)
      );

      const score = this.calculateFactorScore(factor, relevantIndicators);
      const confidence = this.calculateFactorConfidence(relevantIndicators);

      assessments.push({
        factorId,
        score,
        confidence,
        details: {
          indicators: relevantIndicators,
          threshold: factor.threshold
        }
      });
    }

    return assessments;
  }

  // 计算因素分数
  private calculateFactorScore(
    factor: RiskFactor,
    indicators: RiskIndicator[]
  ): number {
    if (indicators.length === 0) return 0;

    return indicators.reduce((score, indicator) => {
      const factorIndicator = factor.indicators.find(
        fi => fi.name === indicator.name
      );
      if (!factorIndicator) return score;

      return score + (indicator.value * indicator.confidence);
    }, 0) / indicators.length;
  }

  // 计算因素置信度
  private calculateFactorConfidence(indicators: RiskIndicator[]): number {
    if (indicators.length === 0) return 0;
    return indicators.reduce((sum, ind) => sum + ind.confidence, 0) / indicators.length;
  }

  // 计算总体风险
  private calculateOverallRisk(assessments: RiskFactorAssessment[]): number {
    const totalWeight = Array.from(this.riskFactors.values())
      .reduce((sum, factor) => sum + factor.weight, 0);

    return assessments.reduce((risk, assessment) => {
      const factor = this.riskFactors.get(assessment.factorId);
      if (!factor) return risk;

      return risk + (assessment.score * factor.weight * assessment.confidence);
    }, 0) / totalWeight;
  }

  // 生成建议
  private async generateRecommendations(
    assessments: RiskFactorAssessment[],
    overallRisk: number
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // 基于总体风险的建议
    if (overallRisk > 0.7) {
      recommendations.push('建议立即进行安全审查');
    } else if (overallRisk > 0.4) {
      recommendations.push('建议加强监控和预防措施');
    }

    // 基于具体因素的建议
    for (const assessment of assessments) {
      const factor = this.riskFactors.get(assessment.factorId);
      if (!factor) continue;

      if (assessment.score > factor.threshold) {
        recommendations.push(
          await this.generateFactorRecommendation(factor, assessment)
        );
      }
    }

    return recommendations;
  }

  // 生成因素建议
  private async generateFactorRecommendation(
    factor: RiskFactor,
    assessment: RiskFactorAssessment
  ): Promise<string> {
    // 实现具体建议生成逻辑
    return `建议关注${factor.type}相关风险`;
  }

  // 保存评估结果
  private async saveAssessment(assessment: RiskAssessment): Promise<void> {
    const assessments = await this.db.get(`risk-assessments-${assessment.userId}`) || [];
    assessments.push(assessment);
    await this.db.put(`risk-assessments-${assessment.userId}`, assessments);
  }

  // 获取历史评估
  async getHistoricalAssessments(
    userId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    } = {}
  ): Promise<RiskAssessment[]> {
    const assessments = await this.db.get(`risk-assessments-${userId}`) || [];
    
    return assessments
      .filter(assessment => {
        if (options.startDate && assessment.timestamp < options.startDate) {
          return false;
        }
        if (options.endDate && assessment.timestamp > options.endDate) {
          return false;
        }
        return true;
      })
      .slice(0, options.limit);
  }

  // 更新风险因素
  async updateRiskFactor(factor: RiskFactor): Promise<void> {
    this.riskFactors.set(factor.id, factor);
    await this.db.put('risk-factors', Array.from(this.riskFactors.entries()));
  }
} 