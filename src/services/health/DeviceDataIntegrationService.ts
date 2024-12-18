import { CacheService } from '../cache/CacheService';
import { DeviceData, IntegratedData, DeviceType } from '../types/device.types';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

@injectable()
export class DeviceDataIntegrationService {
  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
    @inject() private readonly cache: CacheService,
  ) {}

  /**
   * 融合多个设备的数据
   */
  public async integrateDeviceData(deviceDataList: DeviceData[]): Promise<IntegratedData> {
    const timer = this.metrics.startTimer('device_data_integration');
    try {
      // 数据预处理
      const processedData = await this.preprocessDeviceData(deviceDataList);

      // 数据时间对齐
      const alignedData = await this.alignDataTimestamps(processedData);

      // 数据融合
      const integratedData = await this.mergeDeviceData(alignedData);

      // 数据质量评估
      const dataQuality = await this.assessDataQuality(integratedData);

      // 缓存处理后的数据
      await this.cacheIntegratedData(integratedData);

      this.metrics.increment('data_integration_success');
      return integratedData;
    } catch (error) {
      this.logger.error('设备数据融合失败', error as Error);
      this.metrics.increment('data_integration_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 预处理设备数据
   */
  private async preprocessDeviceData(deviceDataList: DeviceData[]): Promise<DeviceData[]> {
    return Promise.all(
      deviceDataList.map(async data => {
        // 数据格式标准化
        const standardizedData = this.standardizeData(data);

        // 异常值处理
        const cleanedData = this.removeOutliers(standardizedData);

        // 数据补全
        const completedData = await this.fillMissingData(cleanedData);

        return completedData;
      }),
    );
  }

  /**
   * 标准化数据格式
   */
  private standardizeData(data: DeviceData): DeviceData {
    switch (data.deviceType) {
      case DeviceType.SMARTWATCH:
        return this.standardizeSmartWatchData(data);
      case DeviceType.BLOOD_PRESSURE:
        return this.standardizeBloodPressureData(data);
      case DeviceType.GLUCOSE_METER:
        return this.standardizeGlucoseMeterData(data);
      default:
        return data;
    }
  }

  /**
   * 标准化智能手表数据
   */
  private standardizeSmartWatchData(data: DeviceData): DeviceData {
    return {
      ...data,
      metrics: {
        heartRate: this.normalizeHeartRate(data.metrics.heartRate),
        steps: Math.round(data.metrics.steps),
        calories: Math.round(data.metrics.calories),
      },
    };
  }

  /**
   * 标准化血压计数据
   */
  private standardizeBloodPressureData(data: DeviceData): DeviceData {
    return {
      ...data,
      metrics: {
        systolic: Math.round(data.metrics.systolic),
        diastolic: Math.round(data.metrics.diastolic),
        pulse: Math.round(data.metrics.pulse),
      },
    };
  }

  /**
   * 标准化血糖仪数据
   */
  private standardizeGlucoseMeterData(data: DeviceData): DeviceData {
    return {
      ...data,
      metrics: {
        glucoseLevel: Number(data.metrics.glucoseLevel.toFixed(1)),
        measurementType: data.metrics.measurementType,
      },
    };
  }

  /**
   * 移除异常值
   */
  private removeOutliers(data: DeviceData): DeviceData {
    const metrics = { ...data.metrics };

    // 使用IQR方法检测和处理异常值
    Object.keys(metrics).forEach(key => {
      if (typeof metrics[key] === 'number') {
        const value = metrics[key];
        if (this.isOutlier(value, key)) {
          metrics[key] = this.getLastValidValue(data.deviceId, key);
        }
      }
    });

    return { ...data, metrics };
  }

  /**
   * 检测异常值
   */
  private isOutlier(value: number, metricType: string): boolean {
    const thresholds = {
      heartRate: { min: 30, max: 200 },
      steps: { min: 0, max: 50000 },
      calories: { min: 0, max: 10000 },
      systolic: { min: 70, max: 200 },
      diastolic: { min: 40, max: 130 },
      glucoseLevel: { min: 30, max: 600 },
    };

    const threshold = thresholds[metricType];
    if (!threshold) return false;

    return value < threshold.min || value > threshold.max;
  }

  /**
   * 获取上次有效值
   */
  private getLastValidValue(deviceId: string, metricType: string): number {
    const cacheKey = `last_valid_${deviceId}_${metricType}`;
    return this.cache.get(cacheKey) || 0;
  }

  /**
   * 补全缺失数据
   */
  private async fillMissingData(data: DeviceData): Promise<DeviceData> {
    const metrics = { ...data.metrics };

    // 使用线性插值或最近有效值填充缺失数据
    Object.keys(metrics).forEach(key => {
      if (metrics[key] === null || metrics[key] === undefined) {
        metrics[key] = this.interpolateValue(data.deviceId, key);
      }
    });

    return { ...data, metrics };
  }

  /**
   * 插值计算
   */
  private interpolateValue(deviceId: string, metricType: string): number {
    // 获取历史数据进行线性插值
    const historicalData = this.getHistoricalData(deviceId, metricType);
    if (historicalData.length < 2) {
      return this.getLastValidValue(deviceId, metricType);
    }

    // 线性插值计算
    const lastTwo = historicalData.slice(-2);
    return (lastTwo[0] + lastTwo[1]) / 2;
  }

  /**
   * 获取历史数据
   */
  private getHistoricalData(deviceId: string, metricType: string): number[] {
    const cacheKey = `historical_${deviceId}_${metricType}`;
    return this.cache.get(cacheKey) || [];
  }

  /**
   * 对齐数据时间戳
   */
  private async alignDataTimestamps(deviceDataList: DeviceData[]): Promise<DeviceData[]> {
    // 获取时间范围
    const timestamps = deviceDataList.map(data => data.timestamp);
    const startTime = Math.min(...timestamps);
    const endTime = Math.max(...timestamps);

    // 按时间间隔对齐数据
    const alignedData = deviceDataList.map(data => {
      return {
        ...data,
        timestamp: this.roundTimestamp(data.timestamp),
      };
    });

    return alignedData;
  }

  /**
   * 四舍五入时间戳到最���的时间间隔
   */
  private roundTimestamp(timestamp: number): number {
    const interval = 5 * 60 * 1000; // 5分钟间隔
    return Math.round(timestamp / interval) * interval;
  }

  /**
   * 合并设备数据
   */
  private async mergeDeviceData(alignedData: DeviceData[]): Promise<IntegratedData> {
    const mergedData: IntegratedData = {
      timestamp: alignedData[0].timestamp,
      devices: alignedData.map(data => data.deviceId),
      metrics: {},
    };

    // 合并各设备的指标数据
    alignedData.forEach(data => {
      Object.keys(data.metrics).forEach(key => {
        if (!mergedData.metrics[key]) {
          mergedData.metrics[key] = [];
        }
        mergedData.metrics[key].push({
          value: data.metrics[key],
          deviceId: data.deviceId,
          confidence: this.calculateConfidence(data, key),
        });
      });
    });

    return mergedData;
  }

  /**
   * 计算数据可信度
   */
  private calculateConfidence(data: DeviceData, metricType: string): number {
    // 基于设备类型、数据质量等因素计算可信度
    let confidence = 1.0;

    // 检查数据时效性
    const age = Date.now() - data.timestamp;
    confidence *= Math.exp(-age / (24 * 60 * 60 * 1000)); // 衰减系数

    // 检查数据是否在合理范围内
    if (this.isOutlier(data.metrics[metricType], metricType)) {
      confidence *= 0.5;
    }

    // 考虑设备可靠性
    confidence *= this.getDeviceReliability(data.deviceType);

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * 获取设备可靠性系数
   */
  private getDeviceReliability(deviceType: DeviceType): number {
    const reliabilityMap = {
      [DeviceType.SMARTWATCH]: 0.9,
      [DeviceType.BLOOD_PRESSURE]: 0.95,
      [DeviceType.GLUCOSE_METER]: 0.95,
    };

    return reliabilityMap[deviceType] || 0.8;
  }

  /**
   * 评估数据质量
   */
  private async assessDataQuality(integratedData: IntegratedData): Promise<number> {
    let qualityScore = 1.0;

    // 评估数据完整性
    const completeness = this.calculateCompleteness(integratedData);
    qualityScore *= completeness;

    // 评估数据一致性
    const consistency = this.calculateConsistency(integratedData);
    qualityScore *= consistency;

    // 评估数据时效性
    const timeliness = this.calculateTimeliness(integratedData);
    qualityScore *= timeliness;

    return qualityScore;
  }

  /**
   * 计算数据完整性
   */
  private calculateCompleteness(data: IntegratedData): number {
    const totalMetrics = Object.keys(data.metrics).length;
    const nonEmptyMetrics = Object.values(data.metrics).filter(values => values.length > 0).length;

    return nonEmptyMetrics / totalMetrics;
  }

  /**
   * 计算数据一致性
   */
  private calculateConsistency(data: IntegratedData): number {
    let consistencyScore = 1.0;

    Object.values(data.metrics).forEach(values => {
      if (values.length > 1) {
        const variance = this.calculateVariance(values.map(v => v.value));
        consistencyScore *= Math.exp(-variance);
      }
    });

    return consistencyScore;
  }

  /**
   * 计算数据时效性
   */
  private calculateTimeliness(data: IntegratedData): number {
    const now = Date.now();
    const age = now - data.timestamp;
    return Math.exp(-age / (24 * 60 * 60 * 1000)); // 24小时衰减
  }

  /**
   * 计算方差
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * 缓存集成后的数据
   */
  private async cacheIntegratedData(data: IntegratedData): Promise<void> {
    const cacheKey = `integrated_data_${data.timestamp}`;
    await this.cache.set(cacheKey, data, 24 * 60 * 60); // 缓存24小时
  }
}
