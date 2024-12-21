import { DeviceManager } from '@/utils/deviceManager';
import { HealthKit } from '@/utils/healthKit';
import { NotificationManager } from '@/utils/notificationManager';

export class DeviceIntegrationManager {
  private healthKit: HealthKit;
  private notificationManager: NotificationManager;
  private deviceManager: DeviceManager;

  constructor() {
    this.healthKit = new HealthKit();
    this.notificationManager = new NotificationManager();
    this.deviceManager = new DeviceManager();
  }

  // 健康数据同步
  async syncHealthData() {
    try {
      const healthData = await this.healthKit.fetchHealthData();
      await this.processHealthData(healthData);
    } catch (error) {
      console.error('Error in DeviceIntegrationManager.ts:', '健康数据同步失败:', error);
    }
  }

  // 实时监测
  startRealTimeMonitoring() {
    this.healthKit.startMonitoring({
      onDataReceived: this.handleHealthData,
      onAlert: this.handleHealthAlert,
    });
  }

  // 设备管理
  async manageDevices() {
    try {
      const devices = await this.deviceManager.getConnectedDevices();
      for (const device of devices) {
        await this.setupDevice(device);
      }
    } catch (error) {
      console.error('Error in DeviceIntegrationManager.ts:', '设备管理失败:', error);
    }
  }

  // 通知管理
  async setupNotifications() {
    try {
      await this.notificationManager.requestPermission();
      this.setupHealthAlerts();
      this.setupActivityReminders();
      this.setupAppointmentNotifications();
    } catch (error) {
      console.error('Error in DeviceIntegrationManager.ts:', '通知设置失败:', error);
    }
  }

  private async setupHealthAlerts() {
    this.notificationManager.scheduleNotification({
      type: 'health',
      trigger: 'threshold',
      conditions: {
        heartRate: { min: 60, max: 100 },
        bloodPressure: { min: 90 / 60, max: 140 / 90 },
      },
    });
  }

  private async setupActivityReminders() {
    this.notificationManager.scheduleNotification({
      type: 'activity',
      trigger: 'time',
      schedule: {
        frequency: 'daily',
        times: ['09:00', '15:00', '20:00'],
      },
    });
  }
}
