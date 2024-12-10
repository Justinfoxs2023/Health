import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { 
  HealthDevice, 
  HealthRecord,
  DeviceType,
  HealthMetricType 
} from '../../types/health-devices';

@Injectable()
export class DeviceSyncService {
  constructor(
    private readonly deviceRegistry: DeviceRegistryService,
    private readonly healthDataService: HealthDataService,
    private readonly notificationService: NotificationService,
    private readonly familyService: FamilyService
  ) {}

  // 注册新设备
  async registerDevice(
    userId: string,
    deviceInfo: Partial<HealthDevice>
  ): Promise<HealthDevice> {
    // 验证设备信息
    await this.validateDevice(deviceInfo);
    
    // 注册设备
    const device = await this.deviceRegistry.registerDevice(
      userId,
      deviceInfo
    );
    
    // 初始化设备连接
    await this.initializeDeviceConnection(device);
    
    return device;
  }

  // 同步设备数据
  async syncDeviceData(deviceId: string): Promise<HealthRecord[]> {
    const device = await this.deviceRegistry.getDevice(deviceId);
    
    try {
      // ���取设备数据
      const rawData = await this.fetchDeviceData(device);
      
      // 处理数据
      const records = await this.processDeviceData(device, rawData);
      
      // 保存健康记录
      await this.healthDataService.saveHealthRecords(records);
      
      // 更新设备同步状态
      await this.updateDeviceStatus(device, {
        lastSync: new Date(),
        status: 'active'
      });
      
      // 同步到家庭成员
      await this.syncToFamilyMembers(device.userId, records);
      
      return records;
    } catch (error) {
      await this.handleSyncError(device, error);
      throw error;
    }
  }

  // 定时检查设备状态
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkDevicesStatus() {
    const devices = await this.deviceRegistry.getAllDevices();
    
    for (const device of devices) {
      await this.checkDeviceStatus(device);
    }
  }

  // 数据异常检测
  private async detectAnomalies(
    records: HealthRecord[]
  ): Promise<void> {
    for (const record of records) {
      const isAbnormal = await this.checkAbnormalValue(record);
      
      if (isAbnormal) {
        await this.handleAbnormalRecord(record);
      }
    }
  }

  // 处理异常数据
  private async handleAbnormalRecord(
    record: HealthRecord
  ): Promise<void> {
    // 发送警告通知
    await this.notificationService.sendAbnormalAlert({
      userId: record.userId,
      metricType: record.type,
      value: record.value,
      timestamp: record.timestamp
    });
    
    // 通知家庭成员
    await this.notifyFamilyMembers(record);
    
    // 记录异常事件
    await this.logHealthEvent({
      type: 'abnormal_reading',
      recordId: record.id,
      severity: this.assessSeverity(record)
    });
  }

  // 同步到家庭成员
  private async syncToFamilyMembers(
    userId: string,
    records: HealthRecord[]
  ): Promise<void> {
    const family = await this.familyService.getFamilyByMemberId(userId);
    
    if (!family) return;

    const healthManager = await this.familyService.getFamilyHealthManager(
      family.id
    );
    
    if (healthManager) {
      await this.healthDataService.shareHealthRecords(
        records,
        healthManager.id,
        'family_sync'
      );
    }
  }

  // 生成健康报告
  async generateHealthReport(
    userId: string,
    timeRange: { start: Date; end: Date }
  ): Promise<HealthReport> {
    const records = await this.healthDataService.getHealthRecords(
      userId,
      timeRange
    );
    
    return {
      period: timeRange,
      metrics: await this.analyzeMetrics(records),
      trends: await this.analyzeTrends(records),
      anomalies: await this.findAnomalies(records),
      recommendations: await this.generateRecommendations(records)
    };
  }
} 