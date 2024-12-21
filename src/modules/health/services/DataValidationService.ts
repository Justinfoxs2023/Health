import { IHealthData, IVitalSigns, IBodyMetrics, IActivityData } from '../models/HealthData';

import { Logger } from '@/utils/Logger';
import { ValidationError } from '@/utils/errors';

export class DataValidationService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('DataValidation');
  }

  /**
   * 验证健康数据
   */
  async validateHealthData(data: IHealthData): Promise<void> {
    try {
      // 验证基础字段
      this.validateBaseFields(data);

      // 验证各个子模块
      await Promise.all([
        this.validateVitalSigns(data.vitalSigns),
        this.validateBodyMetrics(data.bodyMetrics),
        this.validateActivityData(data.activityData),
      ]);

      // 验证数据完整性
      this.validateDataIntegrity(data);
    } catch (error) {
      this.logger.error('健康数据验证失败', error);
      throw new ValidationError('HEALTH_DATA_INVALID', error.message);
    }
  }

  /**
   * 验证生命体征数据
   */
  async validateVitalSigns(data: IVitalSigns): Promise<void> {
    const rules = {
      heartRate: { min: 30, max: 200 },
      bloodPressure: {
        systolic: { min: 70, max: 200 },
        diastolic: { min: 40, max: 130 },
      },
      bodyTemperature: { min: 35, max: 42 },
      respiratoryRate: { min: 8, max: 30 },
      bloodOxygen: { min: 80, max: 100 },
    };

    if (data.heartRate < rules.heartRate.min || data.heartRate > rules.heartRate.max) {
      throw new ValidationError('INVALID_HEART_RATE', '心率数据超出正常范围');
    }

    // 验证血压
    const { systolic, diastolic } = data.bloodPressure;
    if (
      systolic < rules.bloodPressure.systolic.min ||
      systolic > rules.bloodPressure.systolic.max ||
      diastolic < rules.bloodPressure.diastolic.min ||
      diastolic > rules.bloodPressure.diastolic.max
    ) {
      throw new ValidationError('INVALID_BLOOD_PRESSURE', '血压数据超出正常范围');
    }

    // 其他验证...
  }

  /**
   * 验证身体指标数据
   */
  async validateBodyMetrics(data: IBodyMetrics): Promise<void> {
    const rules = {
      weight: { min: 20, max: 300 },
      height: { min: 50, max: 250 },
      bmi: { min: 10, max: 50 },
      bodyFat: { min: 3, max: 60 },
      muscleMass: { min: 10, max: 100 },
      boneMass: { min: 1, max: 10 },
      waterContent: { min: 30, max: 80 },
    };

    // 验证各项指标
    Object.entries(rules).forEach(([key, range]) => {
      const value = data[key];
      if (value < range.min || value > range.max) {
        throw new ValidationError(`INVALID_${key.toUpperCase()}`, `${key} 数据超出正常范围`);
      }
    });
  }

  /**
   * 验证活动数据
   */
  async validateActivityData(data: IActivityData): Promise<void> {
    const rules = {
      steps: { min: 0, max: 100000 },
      distance: { min: 0, max: 100 },
      caloriesBurned: { min: 0, max: 10000 },
      activeMinutes: { min: 0, max: 1440 },
    };

    // 验证基本活动数据
    Object.entries(rules).forEach(([key, range]) => {
      const value = data[key];
      if (value < range.min || value > range.max) {
        throw new ValidationError(`INVALID_${key.toUpperCase()}`, `${key} 数据超出正常范围`);
      }
    });

    // 验证睡眠数据
    if (data.sleepData) {
      await this.validateSleepData(data.sleepData);
    }
  }

  private validateBaseFields(data: IHealthData): void {
    // 验证必填字段
    if (!data.userId || !data.timestamp) {
      throw new ValidationError('MISSING_REQUIRED_FIELDS', '缺少必填字段');
    }

    // 验证时间戳
    const timestamp = new Date(data.timestamp);
    if (isNaN(timestamp.getTime())) {
      throw new ValidationError('INVALID_TIMESTAMP', '时间戳格式无效');
    }

    // 验证时间范围
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (timestamp.getTime() > now.getTime() || now.getTime() - timestamp.getTime() > oneWeek) {
      throw new ValidationError('TIMESTAMP_OUT_OF_RANGE', '时间戳超出有效范围');
    }
  }

  private validateDataIntegrity(data: IHealthData): void {
    // 验证数据一致性
    const requiredModules = ['vitalSigns', 'bodyMetrics', 'activityData'];
    for (const module of requiredModules) {
      if (!data[module]) {
        throw new ValidationError('MISSING_MODULE_DATA', `缺少${module}模块数据`);
      }
    }

    // 验证设备信息
    if (data.deviceInfo) {
      this.validateDeviceInfo(data.deviceInfo);
    }
  }

  private validateDeviceInfo(deviceInfo: any): void {
    const requiredFields = ['deviceId', 'deviceType', 'manufacturer', 'model'];
    for (const field of requiredFields) {
      if (!deviceInfo[field]) {
        throw new ValidationError('INVALID_DEVICE_INFO', `设备信息缺少${field}字段`);
      }
    }

    // 验证准确度
    if (
      typeof deviceInfo.accuracy !== 'number' ||
      deviceInfo.accuracy < 0 ||
      deviceInfo.accuracy > 100
    ) {
      throw new ValidationError('INVALID_ACCURACY', '设备准确度数据无效');
    }
  }
}
