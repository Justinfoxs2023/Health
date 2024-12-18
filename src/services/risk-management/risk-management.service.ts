import * as tf from '@tensorflow/tfjs-node';
import { ConfigService } from '@nestjs/config';
import { HealthAnalysisService } from '../health-analysis/advanced-analysis.service';
import { IHealthRisk, IRiskAssessment, IRiskAlertConfig } from './types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '../../infrastructure/logger/logger.service';
import { MetricsService } from '../../infrastructure/monitoring/metrics.service';
import { NotificationService } from '../../infrastructure/notification/notification.service';

@Injectable()
export class RiskManagementService implements OnModuleInit {
  private riskModel: tf.LayersModel;
  private readonly alertConfig: IRiskAlertConfig;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly metrics: MetricsService,
    private readonly notification: NotificationService,
    private readonly healthAnalysis: HealthAnalysisService,
  ) {
    this.alertConfig = this.loadAlertConfig();
  }

  async onModuleInit() {
    await this.initializeRiskModel();
    this.startRiskMonitoring();
  }

  // 执行风���评估
  async performRiskAssessment(userId: string): Promise<IRiskAssessment> {
    try {
      // 1. 收集用户健康数据
      const healthData = await this.healthAnalysis.getComprehensiveHealthData(userId);

      // 2. 数据预处理
      const processedData = this.preprocessHealthData(healthData);

      // 3. 风险预测
      const predictions = await this.predictRisks(processedData);

      // 4. 生成风险评估报告
      const assessment = this.generateRiskAssessment(userId, predictions, healthData);

      // 5. 检查是否需要发送预警
      await this.checkAndSendAlerts(userId, assessment);

      // 6. 记录评估结果
      await this.recordAssessment(assessment);

      return assessment;
    } catch (error) {
      this.logger.error(`Failed to perform risk assessment for user ${userId}:`, error);
      throw error;
    }
  }

  // 获取风险趋势
  async getRiskTrends(userId: string, timeRange: { start: Date; end: Date }): Promise<any> {
    try {
      const assessments = await this.getHistoricalAssessments(userId, timeRange);
      return this.analyzeTrends(assessments);
    } catch (error) {
      this.logger.error(`Failed to get risk trends for user ${userId}:`, error);
      throw error;
    }
  }

  // 更新风险监测配置
  async updateRiskMonitoring(userId: string, config: Partial<IRiskAlertConfig>): Promise<void> {
    try {
      const userConfig = await this.getUserMonitoringConfig(userId);
      const updatedConfig = { ...userConfig, ...config };
      await this.saveUserMonitoringConfig(userId, updatedConfig);
    } catch (error) {
      this.logger.error(`Failed to update monitoring config for user ${userId}:`, error);
      throw error;
    }
  }

  private async initializeRiskModel() {
    try {
      this.riskModel = await tf.loadLayersModel(this.config.get('RISK_MODEL_PATH'));
    } catch (error) {
      this.logger.error('Failed to initialize risk model:', error);
    }
  }

  private startRiskMonitoring() {
    setInterval(() => {
      this.performScheduledAssessments().catch(error => {
        this.logger.error('Scheduled risk assessment failed:', error);
      });
    }, this.config.get('RISK_MONITORING_INTERVAL'));
  }

  private async performScheduledAssessments() {
    const usersToAssess = await this.getUsersForScheduledAssessment();
    for (const userId of usersToAssess) {
      await this.performRiskAssessment(userId);
    }
  }

  private async predictRisks(data: tf.Tensor): Promise<IHealthRisk[]> {
    const predictions = (await this.riskModel.predict(data)) as tf.Tensor;
    const riskScores = await predictions.array();
    return this.interpretRiskScores(riskScores);
  }

  private generateRiskAssessment(
    userId: string,
    risks: IHealthRisk[],
    healthData: any,
  ): IRiskAssessment {
    const overallScore = this.calculateOverallRiskScore(risks);
    const keyMetrics = this.extractKeyMetrics(healthData);
    const recommendations = this.generateRecommendations(risks, healthData);
    const trends = this.calculateTrends(healthData);

    return {
      userId,
      timestamp: new Date(),
      overallScore,
      risks,
      keyMetrics,
      recommendations,
      trends,
    };
  }

  private async checkAndSendAlerts(userId: string, assessment: IRiskAssessment) {
    const criticalRisks = assessment.risks.filter(risk => risk.severity === 'critical');

    if (criticalRisks.length > 0) {
      await this.sendRiskAlerts(userId, criticalRisks);
    }
  }

  private async sendRiskAlerts(userId: string, risks: IHealthRisk[]) {
    const userContacts = await this.getUserEmergencyContacts(userId);

    for (const risk of risks) {
      await this.notification.send({
        userId,
        type: 'risk_alert',
        severity: risk.severity,
        content: {
          risk: risk.name,
          description: risk.description,
          recommendations: risk.preventions,
        },
        contacts: userContacts,
      });
    }
  }

  private calculateOverallRiskScore(risks: IHealthRisk[]): number {
    return (
      (risks.reduce((score, risk) => {
        const severityWeight = this.getSeverityWeight(risk.severity);
        return score + risk.probability * severityWeight;
      }, 0) /
        risks.length) *
      100
    );
  }

  private getSeverityWeight(severity: string): number {
    const weights = {
      low: 0.25,
      medium: 0.5,
      high: 0.75,
      critical: 1,
    };
    return weights[severity] || 0.5;
  }

  private loadAlertConfig(): IRiskAlertConfig {
    return {
      thresholds: {
        heartRate: { warning: 100, critical: 120 },
        bloodPressure: { warning: 140, critical: 160 },
        bloodSugar: { warning: 140, critical: 200 },
      },
      monitoringFrequency: {
        chronic: 1440, // 24小时
        acute: 60, // 1小时
        lifestyle: 4320, // 3天
      },
      notifications: {
        channels: ['app', 'email', 'sms'],
        urgencyLevels: {
          critical: {
            methods: ['sms', 'email', 'app'],
            delay: 0,
          },
          high: {
            methods: ['email', 'app'],
            delay: 30,
          },
          medium: {
            methods: ['app'],
            delay: 60,
          },
        },
      },
    };
  }
}
