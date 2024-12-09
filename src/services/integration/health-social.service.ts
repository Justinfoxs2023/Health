import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../infrastructure/logger/logger.service';
import { MetricsService } from '../../infrastructure/monitoring/metrics.service';
import { AdvancedHealthAnalysis } from '../health-analysis/advanced-analysis.service';
import { PersonalizedRecommendationService } from '../recommendation/smart-recommendation.service';
import { SocialService } from '../social/social.service';
import { IntegratedExperience, IntegrationContext } from './types';

@Injectable()
export class HealthSocialIntegrationService {
  constructor(
    private readonly analysisService: AdvancedHealthAnalysis,
    private readonly recommendationService: PersonalizedRecommendationService,
    private readonly socialService: SocialService,
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly metrics: MetricsService
  ) {}

  async createIntegratedHealthExperience(
    userId: string,
    context?: Partial<IntegrationContext>
  ): Promise<IntegratedExperience> {
    try {
      // 1. 获取集成上下文
      const integrationContext = await this.buildIntegrationContext(userId, context);

      // 2. 并行执行核心分析
      const [healthAnalysis, recommendations, socialActivities] = await Promise.all([
        this.performHealthAnalysis(userId, integrationContext),
        this.generateRecommendations(userId, integrationContext),
        this.findSocialActivities(userId, integrationContext)
      ]);

      // 3. 生成整合洞察
      const integratedInsights = await this.generateIntegratedInsights({
        userId,
        context: integrationContext,
        healthAnalysis,
        recommendations,
        socialActivities
      });

      // 4. 记录集成指标
      this.recordIntegrationMetrics(userId, {
        healthAnalysis,
        recommendations,
        socialActivities,
        integratedInsights
      });

      return {
        analysis: healthAnalysis,
        recommendations,
        socialActivities,
        integratedInsights
      };
    } catch (error) {
      this.logger.error(`Failed to create integrated experience for user ${userId}:`, error);
      throw error;
    }
  }

  private async buildIntegrationContext(
    userId: string,
    partialContext?: Partial<IntegrationContext>
  ): Promise<IntegrationContext> {
    // 1. 获取用户健康档案
    const healthProfile = await this.analysisService.getHealthProfile(userId);

    // 2. 获取社交上下文
    const socialContext = await this.socialService.getUserSocialContext(userId);

    // 3. 获取用户目标
    const goals = await this.recommendationService.getUserGoals(userId);

    // 4. 合并上下文
    return {
      userId,
      healthProfile,
      socialContext,
      goals,
      ...partialContext
    };
  }

  private async performHealthAnalysis(
    userId: string,
    context: IntegrationContext
  ) {
    const analysis = await this.analysisService.analyzePredictiveHealth(userId, {
      includeHistory: true,
      includeSocialFactors: true,
      context: context.healthProfile
    });

    return this.enrichHealthAnalysis(analysis, context);
  }

  private async generateRecommendations(
    userId: string,
    context: IntegrationContext
  ) {
    const recommendations = await this.recommendationService.generatePersonalizedRecommendation(
      userId,
      {
        healthContext: context.healthProfile,
        socialContext: context.socialContext,
        goals: context.goals
      }
    );

    return this.prioritizeRecommendations(recommendations, context);
  }

  private async findSocialActivities(
    userId: string,
    context: IntegrationContext
  ) {
    const activities = await this.socialService.getRelevantActivities(userId, {
      healthProfile: context.healthProfile,
      preferences: context.socialContext.preferences,
      activityLevel: context.socialContext.activityLevel
    });

    return this.filterAndRankActivities(activities, context);
  }

  private async generateIntegratedInsights({
    userId,
    context,
    healthAnalysis,
    recommendations,
    socialActivities
  }) {
    // 1. 确定主要关注点
    const primaryFocus = this.determinePrimaryFocus(
      healthAnalysis,
      recommendations
    );

    // 2. 评估支持网络
    const supportNetwork = await this.evaluateSupportNetwork(
      userId,
      context,
      socialActivities
    );

    // 3. 生成进度指标
    const progressMetrics = this.generateProgressMetrics(
      context.goals,
      healthAnalysis,
      socialActivities
    );

    // 4. 创建行动计划
    const actionPlan = this.createActionPlan(
      recommendations,
      socialActivities,
      context
    );

    return {
      primaryFocus,
      supportNetwork,
      progressMetrics,
      actionPlan
    };
  }

  private determinePrimaryFocus(
    healthAnalysis: any,
    recommendations: any
  ): string[] {
    // 实现主要关注点确定逻辑
    return [];
  }

  private async evaluateSupportNetwork(
    userId: string,
    context: IntegrationContext,
    activities: any
  ) {
    // 实现支持网络评估逻辑
    return {
      type: '',
      strength: 0,
      recommendations: []
    };
  }

  private generateProgressMetrics(
    goals: any[],
    healthAnalysis: any,
    activities: any
  ) {
    // 实现进度指标生成逻辑
    return [];
  }

  private createActionPlan(
    recommendations: any,
    activities: any,
    context: IntegrationContext
  ) {
    // 实现行动计划创建逻辑
    return {
      personal: [],
      social: [],
      medical: []
    };
  }

  private recordIntegrationMetrics(
    userId: string,
    data: {
      healthAnalysis: any;
      recommendations: any;
      socialActivities: any;
      integratedInsights: any;
    }
  ): void {
    this.metrics.recordIntegrationMetrics(userId, {
      analysisCount: Object.keys(data.healthAnalysis).length,
      recommendationCount: data.recommendations.length,
      socialActivityCount: data.socialActivities.length,
      insightCount: Object.keys(data.integratedInsights).length
    });
  }

  private enrichHealthAnalysis(analysis: any, context: IntegrationContext) {
    // 实现健康分析富化逻辑
    return analysis;
  }

  private prioritizeRecommendations(recommendations: any[], context: IntegrationContext) {
    // 实现推荐优先级排序逻辑
    return recommendations;
  }

  private filterAndRankActivities(activities: any[], context: IntegrationContext) {
    // 实现活动过滤和排序逻辑
    return activities;
  }
} 