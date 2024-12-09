import { store } from '@/store';
import { updateHealthData } from '@/store/slices/healthSlice';
import { updateConsultationStatus } from '@/store/slices/consultationSlice';
import { updateCommunityActivities } from '@/store/slices/communitySlice';

export class DataFlowManager {
  // 健康数据更新
  static async updateHealthMetrics(newData: HealthMetrics) {
    try {
      // 验证数据
      validateHealthData(newData);
      
      // 更新状态
      store.dispatch(updateHealthData(newData));
      
      // 触发相关更新
      await this.triggerRelatedUpdates('health', newData);
      
      // 发送通知
      NotificationManager.send({
        type: 'health',
        message: '健康数据已更新',
      });
    } catch (error) {
      ErrorHandler.handle(error);
    }
  }

  // 咨询状态更新
  static async updateConsultation(status: ConsultationStatus) {
    try {
      store.dispatch(updateConsultationStatus(status));
      
      // 更新相关预约
      await BookingManager.updateRelatedBookings(status);
      
      // 更新健康记录
      await HealthRecordManager.addConsultationRecord(status);
    } catch (error) {
      ErrorHandler.handle(error);
    }
  }

  // 社区活动更新
  static async updateCommunityActivity(activity: CommunityActivity) {
    try {
      store.dispatch(updateCommunityActivities(activity));
      
      // 更新成就系统
      await AchievementManager.checkActivityAchievements(activity);
      
      // 更新积分系统
      await PointsManager.addActivityPoints(activity);
    } catch (error) {
      ErrorHandler.handle(error);
    }
  }
} 