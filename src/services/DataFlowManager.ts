import { CacheManager } from '@/services/cache';
import { DataValidator } from '@/services/validation';
import { ErrorHandler } from '@/services/error';
import { EventEmitter } from '@/services/events';
import { Logger } from '@/services/logger';
import { MetricsCollector } from '@/services/metrics';
import { TransactionManager } from '@/services/transaction';
import { store } from '@/store';
import { updateCommunityActivities } from '@/store/slices/communitySlice';
import { updateConsultationStatus } from '@/store/slices/consultationSlice';
import { updateHealthData } from '@/store/slices/healthSlice';

export class DataFlowManager {
  private static readonly transactionManager = new TransactionManager();
  private static readonly validator = new DataValidator();
  private static readonly errorHandler = new ErrorHandler();
  private static readonly eventEmitter = new EventEmitter();
  private static readonly cacheManager = new CacheManager();
  private static readonly metrics = new MetricsCollector('data_flow');
  private static readonly logger = new Logger('DataFlowManager');

  // 健康数据更新
  static async updateHealthMetrics(newData: HealthMetrics) {
    const timer = this.metrics.startTimer('update_health_metrics');
    const transaction = await this.transactionManager.begin();

    try {
      // 验证数据
      await this.validator.validateHealthData(newData);
      this.metrics.increment('health_data_validated');

      // 检查缓存
      const cachedData = await this.cacheManager.get(`health:${newData.userId}`);
      if (cachedData && !this.hasSignificantChange(cachedData, newData)) {
        this.metrics.increment('cache_hit');
        return cachedData;
      }
      this.metrics.increment('cache_miss');

      // 更新状态
      await transaction.execute(async () => {
        // 更新主数据
        await store.dispatch(updateHealthData(newData));

        // 更新相关数据
        await this.updateRelatedData(newData, transaction);

        // 更新缓存
        await this.cacheManager.set(
          `health:${newData.userId}`,
          newData,
          3600, // 1小时缓存
        );
      });

      // 提交事务
      await transaction.commit();

      // 发送事件
      this.eventEmitter.emit('healthData:updated', {
        userId: newData.userId,
        data: newData,
        timestamp: Date.now(),
      });

      // 发送通知
      await NotificationManager.send({
        type: 'health',
        message: '健康数据已更新',
        data: newData,
      });

      this.metrics.increment('health_update_success');
      timer.end();
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      this.metrics.increment('health_update_error');
      this.errorHandler.handle(error);
      throw error;
    }
  }

  // 咨询状态更新
  static async updateConsultation(status: ConsultationStatus) {
    const timer = this.metrics.startTimer('update_consultation');
    const transaction = await this.transactionManager.begin();

    try {
      await this.validator.validateConsultationStatus(status);
      this.metrics.increment('consultation_validated');

      await transaction.execute(async () => {
        // 更新咨询状态
        await store.dispatch(updateConsultationStatus(status));

        // 更新相关预约
        await BookingManager.updateRelatedBookings(status, transaction);

        // 更新健康记录
        await HealthRecordManager.addConsultationRecord(status, transaction);

        // 更新医生日程
        await DoctorScheduleManager.updateSchedule(status, transaction);

        // 更新统计数据
        await this.updateConsultationStats(status, transaction);
      });

      await transaction.commit();

      this.eventEmitter.emit('consultation:updated', {
        consultationId: status.id,
        status: status,
        timestamp: Date.now(),
      });

      this.metrics.increment('consultation_update_success');
      timer.end();
    } catch (error) {
      await transaction.rollback();
      this.metrics.increment('consultation_update_error');
      this.errorHandler.handle(error);
      throw error;
    }
  }

  // 社区活动更新
  static async updateCommunityActivity(activity: CommunityActivity) {
    const timer = this.metrics.startTimer('update_community_activity');
    const transaction = await this.transactionManager.begin();

    try {
      await this.validator.validateCommunityActivity(activity);
      this.metrics.increment('activity_validated');

      await transaction.execute(async () => {
        // 更新活动状态
        await store.dispatch(updateCommunityActivities(activity));

        // 更新成就系统
        await AchievementManager.checkActivityAchievements(activity, transaction);

        // 更新积分系统
        await PointsManager.addActivityPoints(activity, transaction);

        // 更新用户统计
        await UserStatsManager.updateActivityStats(activity, transaction);

        // 更新推荐系统
        await RecommendationManager.updateUserPreferences(activity, transaction);
      });

      await transaction.commit();

      this.eventEmitter.emit('activity:updated', {
        activityId: activity.id,
        activity: activity,
        timestamp: Date.now(),
      });

      this.metrics.increment('activity_update_success');
      timer.end();
    } catch (error) {
      await transaction.rollback();
      this.metrics.increment('activity_update_error');
      this.errorHandler.handle(error);
      throw error;
    }
  }

  // 检查数据变化是否显著
  private static hasSignificantChange(oldData: any, newData: any): boolean {
    const threshold = 0.1; // 10%的变化阈值

    // 检查关键指标的变化
    const keyMetrics = ['heartRate', 'bloodPressure', 'bloodOxygen'];

    return keyMetrics.some(metric => {
      const oldValue = oldData[metric];
      const newValue = newData[metric];

      if (!oldValue || !newValue) return true;

      const change = Math.abs((newValue - oldValue) / oldValue);
      return change > threshold;
    });
  }

  // 更新相关数据
  private static async updateRelatedData(data: HealthMetrics, transaction: Transaction) {
    const timer = this.metrics.startTimer('update_related_data');
    try {
      // 更新健康指数
      await HealthIndexCalculator.update(data, transaction);

      // 更新健康趋势
      await HealthTrendAnalyzer.analyze(data, transaction);

      // 更新风险评估
      await RiskAssessmentService.evaluate(data, transaction);

      // 更新健康建议
      await HealthAdviceGenerator.generate(data, transaction);

      // 更新AI模型
      await HealthAIModel.train(data, transaction);

      this.metrics.increment('related_data_update_success');
      timer.end();
    } catch (error) {
      this.metrics.increment('related_data_update_error');
      throw error;
    }
  }

  // 更新咨询统计
  private static async updateConsultationStats(
    status: ConsultationStatus,
    transaction: Transaction,
  ) {
    const timer = this.metrics.startTimer('update_consultation_stats');
    try {
      // 更新完成率
      await ConsultationStatsManager.updateCompletionRate(status, transaction);

      // 更新满意度
      await ConsultationStatsManager.updateSatisfactionRate(status, transaction);

      // 更新医生评分
      await DoctorRatingManager.updateRating(status, transaction);

      this.metrics.increment('consultation_stats_update_success');
      timer.end();
    } catch (error) {
      this.metrics.increment('consultation_stats_update_error');
      throw error;
    }
  }
}
