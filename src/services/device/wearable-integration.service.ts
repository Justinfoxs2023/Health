import { Injectable } from '@nestjs/common';
import { WearableDevice, DeviceData, SleepData, ActivityData } from '../../types/devices';

@Injectable()
export class WearableIntegrationService {
  constructor(
    private readonly deviceRegistry: DeviceRegistryService,
    private readonly healthDataService: HealthDataService,
    private readonly notificationService: NotificationService,
  ) {}

  // 实时数据同步
  async syncRealtimeData(deviceId: string): Promise<DeviceData> {
    const device = await this.deviceRegistry.getDevice(deviceId);

    try {
      // 获取实时数据
      const realtimeData = await this.fetchRealtimeData(device);

      // 数据验证和处理
      const processedData = await this.processDeviceData(realtimeData);

      // 异常检测
      await this.detectAnomalies(processedData);

      // 保存数据
      await this.healthDataService.saveDeviceData(processedData);

      return processedData;
    } catch (error) {
      await this.handleSyncError(device, error);
      throw error;
    }
  }

  // 睡眠质量分析
  async analyzeSleepQuality(sleepData: SleepData): Promise<SleepAnalysis> {
    return {
      quality: this.calculateSleepQuality(sleepData),
      stages: this.analyzeSleepStages(sleepData),
      disruptions: this.identifyDisruptions(sleepData),
      recommendations: await this.generateSleepRecommendations(sleepData),
    };
  }

  // 运动效果评估
  async evaluateExercise(activityData: ActivityData): Promise<ExerciseEvaluation> {
    return {
      intensity: this.calculateIntensity(activityData),
      caloriesBurned: this.calculateCalories(activityData),
      performance: this.evaluatePerformance(activityData),
      suggestions: await this.generateExerciseSuggestions(activityData),
    };
  }

  // 健康风险预警
  async monitorHealthRisks(userId: string): Promise<HealthRiskAssessment> {
    const recentData = await this.healthDataService.getRecentData(userId);

    const risks = await this.assessHealthRisks(recentData);

    if (risks.severity === 'high') {
      await this.notificationService.sendUrgentAlert(userId, risks);
    }

    return risks;
  }
}
