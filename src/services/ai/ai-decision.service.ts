import { AIService } from './ai.service';
import { HealthAnalyticsService } from '../analytics/health-analytics.service';
import { Injectable } from '@nestjs/common';
import { IntelligentAlertService } from '../alert/intelligent-alert.service';

// AI决策结果
export interface IAIDecision<T = any> {
  /** recommendation 的描述 */
    recommendation: T;
  /** confidence 的描述 */
    confidence: number;
  /** reasoning 的描述 */
    reasoning: string[];
  /** alternatives 的描述 */
    alternatives: T[];
  /** risks 的描述 */
    risks: IRiskAssessment[];
}

// 风险评估
export interface IRiskAssessment {
  /** type 的描述 */
    type: string;
  /** level 的描述 */
    level: low  moderate  high  critical;
  probability: number;
  impact: number;
  factors: string;
  mitigations: string;
}

@Injectable()
export class AIDecisionService {
  constructor(
    private readonly ai: AIService,
    private readonly analytics: HealthAnalyticsService,
    private readonly alert: IntelligentAlertService,
  ) {}

  // 健康风险预测
  async predictHealthRisks(userId: string): Promise<IAIDecision<RiskPrediction[]>> {
    // 1. 收集健康数据
    const healthData = await this.analytics.getHealthData(userId);

    // 2. AI分析风险
    const analysis = await this.ai.analyzeHealthRisks(healthData);

    // 3. 生成预警规则
    await this.generateAlertRules(userId, analysis.risks);

    return {
      recommendation: analysis.predictions,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      alternatives: analysis.alternatives,
      risks: analysis.risks,
    };
  }

  // 治疗方案建议
  async suggestTreatmentPlan(
    userId: string,
    condition: string,
  ): Promise<IAIDecision<TreatmentPlan>> {
    // 1. 获取病历数据
    const medicalHistory = await this.getMedicalHistory(userId);

    // 2. AI分析最佳治疗方案
    const analysis = await this.ai.analyzeTreatmentOptions({
      condition,
      history: medicalHistory,
      preferences: await this.getPatientPreferences(userId),
    });

    // 3. 设置监测规则
    await this.setupMonitoringRules(userId, analysis.recommendation);

    return {
      recommendation: analysis.bestOption,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      alternatives: analysis.alternatives,
      risks: analysis.risks,
    };
  }

  // 生活方式建议
  async recommendLifestyleChanges(userId: string): Promise<IAIDecision<LifestyleRecommendation[]>> {
    // 1. 分析当前生活方式
    const lifestyle = await this.analytics.analyzeLifestyle(userId);

    // 2. AI生成改进建议
    const recommendations = await this.ai.generateLifestyleRecommendations({
      current: lifestyle,
      goals: await this.getUserGoals(userId),
      constraints: await this.getUserConstraints(userId),
    });

    // 3. 设置进度追踪
    await this.setupProgressTracking(userId, recommendations.recommendation);

    return recommendations;
  }

  // 紧急情况决策
  async handleEmergencySituation(
    userId: string,
    situation: EmergencySituation,
  ): Promise<IAIDecision<EmergencyAction[]>> {
    // 1. 评估紧急程度
    const severity = await this.assessEmergencySeverity(situation);

    // 2. AI生成应对方案
    const response = await this.ai.generateEmergencyResponse({
      situation,
      severity,
      patientData: await this.getPatientData(userId),
    });

    // 3. 触发紧急预警
    if (severity >= 'high') {
      await this.triggerEmergencyAlert(userId, response);
    }

    return response;
  }

  // 私有方法
  private async generateAlertRules(userId: string, risks: IRiskAssessment[]): Promise<void> {
    // 为每个风险生成预警规则
    const rules = risks.map(risk => ({
      metric: risk.type,
      threshold: this.calculateRiskThreshold(risk),
      actions: this.determineAlertActions(risk),
    }));

    await this.alert.createAlertRules(userId, rules);
  }

  private async setupMonitoringRules(userId: string, plan: TreatmentPlan): Promise<void> {
    // 设置治疗监测规则
    const monitoringConfig = {
      metrics: this.extractMonitoringMetrics(plan),
      frequency: this.determineMonitoringFrequency(plan),
      thresholds: this.calculateMonitoringThresholds(plan),
    };

    await this.alert.setupMonitoring(userId, monitoringConfig);
  }

  private async setupProgressTracking(
    userId: string,
    recommendations: LifestyleRecommendation[],
  ): Promise<void> {
    // 设置进度追踪
    const trackingConfig = recommendations.map(rec => ({
      metric: rec.type,
      target: rec.goal,
      timeline: rec.timeline,
      checkpoints: this.generateCheckpoints(rec),
    }));

    await this.analytics.setupProgressTracking(userId, trackingConfig);
  }

  private async triggerEmergencyAlert(
    userId: string,
    response: IAIDecision<EmergencyAction[]>,
  ): Promise<void> {
    // 触发紧急预警
    await this.alert.createEmergencyAlert({
      userId,
      severity: 'critical',
      actions: response.recommendation,
      notifications: this.getEmergencyContacts(userId),
    });
  }
}
