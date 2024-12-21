import { AnalysisService } from '../analysis/AnalysisService';
import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';

@Injectable()
export class OperationService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly analysisService: AnalysisService,
  ) {}

  async getDashboardData(options: { startDate?: Date; endDate?: Date }): Promise<any> {
    try {
      const [userStats, orderStats, consultationStats, contentStats, revenueStats] =
        await Promise.all([
          this.getUserStats(options),
          this.getOrderStats(options),
          this.getConsultationStats(options),
          this.getContentStats(options),
          this.getRevenueStats(options),
        ]);

      return {
        userStats,
        orderStats,
        consultationStats,
        contentStats,
        revenueStats,
      };
    } catch (error) {
      this.logger.error('获取运营数据失败', error);
      throw error;
    }
  }

  private async getUserStats(options: any): Promise<any> {
    const query: any = {};
    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }

    const [totalUsers, newUsers, activeUsers] = await Promise.all([
      this.databaseService.count('users', {}),
      this.databaseService.count('users', query),
      this.getActiveUsers(options),
    ]);

    return {
      totalUsers,
      newUsers,
      activeUsers,
      retentionRate: await this.calculateRetentionRate(options),
    };
  }

  private async getActiveUsers(options: any): Promise<number> {
    const query: any = {
      lastActiveAt: {},
    };

    if (options.endDate) {
      query.lastActiveAt.$lte = options.endDate;
    }
    query.lastActiveAt.$gte = options.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    return await this.databaseService.count('users', query);
  }

  private async calculateRetentionRate(options: any): Promise<number> {
    // 实现留存率计算逻辑
    return 0;
  }

  private async getOrderStats(options: any): Promise<any> {
    const query: any = {};
    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }

    const orders = await this.databaseService.find('orders', query);

    return {
      totalOrders: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length
          : 0,
      orderTrends: await this.analysisService.analyzeOrderTrends(orders),
    };
  }

  private async getConsultationStats(options: any): Promise<any> {
    const query: any = {};
    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }

    const consultations = await this.databaseService.find('consultations', query);

    return {
      totalConsultations: consultations.length,
      completedConsultations: consultations.filter(c => c.status === 'completed').length,
      averageDuration: this.calculateAverageConsultationDuration(consultations),
      satisfactionRate: await this.calculateConsultationSatisfactionRate(consultations),
    };
  }

  private calculateAverageConsultationDuration(consultations: any[]): number {
    const completedConsultations = consultations.filter(
      c => c.status === 'completed' && c.startTime && c.endTime,
    );
    if (completedConsultations.length === 0) return 0;

    const totalDuration = completedConsultations.reduce((sum, c) => {
      return sum + (new Date(c.endTime).getTime() - new Date(c.startTime).getTime());
    }, 0);

    return totalDuration / completedConsultations.length / (60 * 1000); // 返回分钟数
  }

  private async calculateConsultationSatisfactionRate(consultations: any[]): Promise<number> {
    const completedConsultationIds = consultations
      .filter(c => c.status === 'completed')
      .map(c => c._id);

    const ratings = await this.databaseService.find('consultation_ratings', {
      consultationId: { $in: completedConsultationIds },
    });

    if (ratings.length === 0) return 0;

    const satisfiedRatings = ratings.filter(r => r.rating >= 4).length;
    return (satisfiedRatings / ratings.length) * 100;
  }

  private async getContentStats(options: any): Promise<any> {
    const query: any = {};
    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }

    const [articles, courses, paidContents] = await Promise.all([
      this.databaseService.find('articles', query),
      this.databaseService.find('courses', query),
      this.databaseService.find('paid_contents', query),
    ]);

    return {
      totalContent: articles.length + courses.length + paidContents.length,
      contentBreakdown: {
        articles: articles.length,
        courses: courses.length,
        paidContents: paidContents.length,
      },
      popularContent: await this.getPopularContent(),
      engagementMetrics: await this.getContentEngagementMetrics(),
    };
  }

  private async getPopularContent(): Promise<any[]> {
    // 实现获取热门内容的逻辑
    return [];
  }

  private async getContentEngagementMetrics(): Promise<any> {
    // 实现获取内容参与度指标的逻辑
    return {};
  }

  private async getRevenueStats(options: any): Promise<any> {
    const query: any = {};
    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }

    const [orders, consultations, courseEnrollments, contentPurchases] = await Promise.all([
      this.databaseService.find('orders', { ...query, status: 'completed' }),
      this.databaseService.find('consultations', { ...query, status: 'completed' }),
      this.databaseService.find('course_enrollments', { ...query, status: 'completed' }),
      this.databaseService.find('content_purchases', { ...query, status: 'completed' }),
    ]);

    const revenueData = {
      totalRevenue: this.calculateTotalRevenue(
        orders,
        consultations,
        courseEnrollments,
        contentPurchases,
      ),
      revenueByType: this.calculateRevenueByType(
        orders,
        consultations,
        courseEnrollments,
        contentPurchases,
      ),
      revenueTrends: await this.analysisService.analyzeRevenueTrends({
        orders,
        consultations,
        courseEnrollments,
        contentPurchases,
      }),
    };

    return revenueData;
  }

  private calculateTotalRevenue(
    orders: any[],
    consultations: any[],
    courseEnrollments: any[],
    contentPurchases: any[],
  ): number {
    return [...orders, ...consultations, ...courseEnrollments, ...contentPurchases].reduce(
      (sum, item) => sum + (item.totalAmount || item.fee || item.price || 0),
      0,
    );
  }

  private calculateRevenueByType(
    orders: any[],
    consultations: any[],
    courseEnrollments: any[],
    contentPurchases: any[],
  ): any {
    return {
      orders: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      consultations: consultations.reduce((sum, consultation) => sum + consultation.fee, 0),
      courses: courseEnrollments.reduce((sum, enrollment) => sum + enrollment.price, 0),
      contents: contentPurchases.reduce((sum, purchase) => sum + purchase.price, 0),
    };
  }

  async getUserFeedback(options: {
    startDate?: Date;
    endDate?: Date;
    type?: string;
    status?: string;
  }): Promise<any> {
    try {
      const query: any = {};

      if (options.startDate || options.endDate) {
        query.createdAt = {};
        if (options.startDate) query.createdAt.$gte = options.startDate;
        if (options.endDate) query.createdAt.$lte = options.endDate;
      }

      if (options.type) {
        query.type = options.type;
      }

      if (options.status) {
        query.status = options.status;
      }

      const feedback = await this.databaseService.find('user_feedback', query, {
        sort: { createdAt: -1 },
      });

      return {
        feedback,
        summary: this.summarizeFeedback(feedback),
      };
    } catch (error) {
      this.logger.error('获取用户反馈失败', error);
      throw error;
    }
  }

  private summarizeFeedback(feedback: any[]): any {
    return {
      total: feedback.length,
      byType: this.groupBy(feedback, 'type'),
      byStatus: this.groupBy(feedback, 'status'),
      averageResponseTime: this.calculateAverageResponseTime(feedback),
    };
  }

  private groupBy(array: any[], key: string): any {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  }

  private calculateAverageResponseTime(feedback: any[]): number {
    const respondedFeedback = feedback.filter(f => f.respondedAt);
    if (respondedFeedback.length === 0) return 0;

    const totalResponseTime = respondedFeedback.reduce((sum, f) => {
      return sum + (new Date(f.respondedAt).getTime() - new Date(f.createdAt).getTime());
    }, 0);

    return totalResponseTime / respondedFeedback.length / (60 * 60 * 1000); // 返回小时数
  }

  async getMarketingEffectiveness(campaignId: string): Promise<any> {
    try {
      const campaign = await this.databaseService.findOne('campaigns', { _id: campaignId });
      if (!campaign) {
        throw new Error('营销活动不存在');
      }

      const [impressions, clicks, conversions, revenue] = await Promise.all([
        this.getImpressions(campaignId),
        this.getClicks(campaignId),
        this.getConversions(campaignId),
        this.getCampaignRevenue(campaignId),
      ]);

      return {
        campaignInfo: {
          name: campaign.name,
          startTime: campaign.startTime,
          endTime: campaign.endTime,
          status: campaign.status,
        },
        metrics: {
          impressions,
          clicks,
          conversions,
          revenue,
          ctr: (clicks / impressions) * 100,
          conversionRate: (conversions / clicks) * 100,
          roi: ((revenue - campaign.cost) / campaign.cost) * 100,
        },
        trends: await this.analysisService.analyzeCampaignTrends(campaignId),
      };
    } catch (error) {
      this.logger.error('获取营销效果数据失败', error);
      throw error;
    }
  }

  private async getImpressions(campaignId: string): Promise<number> {
    return await this.databaseService.count('campaign_impressions', { campaignId });
  }

  private async getClicks(campaignId: string): Promise<number> {
    return await this.databaseService.count('campaign_clicks', { campaignId });
  }

  private async getConversions(campaignId: string): Promise<number> {
    return await this.databaseService.count('campaign_conversions', { campaignId });
  }

  private async getCampaignRevenue(campaignId: string): Promise<number> {
    const conversions = await this.databaseService.find('campaign_conversions', { campaignId });
    return conversions.reduce((sum, conversion) => sum + conversion.value, 0);
  }
}
