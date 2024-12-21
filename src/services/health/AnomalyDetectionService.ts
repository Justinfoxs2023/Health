import { HealthData, AnomalyResult, AnomalyType, Severity } from '../types/health.types';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

@injectable()
export class AnomalyDetectionService {
  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
  ) {}

  /**
   * 分析健康数据异常
   */
  public async detectAnomalies(data: HealthData): Promise<AnomalyResult[]> {
    const timer = this.metrics.startTimer('anomaly_detection');
    try {
      const anomalies: AnomalyResult[] = [];

      // 检测生命体征异常
      const vitalSignsAnomalies = await this.detectVitalSignsAnomalies(data.vitalSigns);
      anomalies.push(...vitalSignsAnomalies);

      // 检测活动数据异常
      const activityAnomalies = await this.detectActivityAnomalies(data.activities);
      anomalies.push(...activityAnomalies);

      // 检测睡眠数据异常
      const sleepAnomalies = await this.detectSleepAnomalies(data.sleep);
      anomalies.push(...sleepAnomalies);

      // 记录异常检测指标
      this.metrics.increment('anomalies_detected', anomalies.length);
      this.metrics.gauge('anomaly_severity', this.calculateOverallSeverity(anomalies));

      return anomalies;
    } catch (error) {
      this.logger.error('异常检测失败', error as Error);
      this.metrics.increment('anomaly_detection_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 检测生命体征异常
   */
  private async detectVitalSignsAnomalies(vitalSigns: any): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];

    // 检测心率异常
    if (vitalSigns.heartRate < 50 || vitalSigns.heartRate > 100) {
      anomalies.push({
        type: AnomalyType.VITAL_SIGNS,
        metric: 'heartRate',
        value: vitalSigns.heartRate,
        severity: this.calculateSeverity(vitalSigns.heartRate, 60, 90),
        timestamp: new Date(),
        description: '心率异常',
      });
    }

    // 检测血压异常
    if (vitalSigns.bloodPressure.systolic > 140 || vitalSigns.bloodPressure.diastolic > 90) {
      anomalies.push({
        type: AnomalyType.VITAL_SIGNS,
        metric: 'bloodPressure',
        value: vitalSigns.bloodPressure,
        severity: this.calculateSeverity(vitalSigns.bloodPressure.systolic, 120, 140),
        timestamp: new Date(),
        description: '血压异常',
      });
    }

    // 检测体温异常
    if (vitalSigns.temperature < 36 || vitalSigns.temperature > 37.5) {
      anomalies.push({
        type: AnomalyType.VITAL_SIGNS,
        metric: 'temperature',
        value: vitalSigns.temperature,
        severity: this.calculateSeverity(vitalSigns.temperature, 36.5, 37.2),
        timestamp: new Date(),
        description: '体温异常',
      });
    }

    return anomalies;
  }

  /**
   * 检测活动数据异常
   */
  private async detectActivityAnomalies(activities: any): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];

    // 检测活动量异常
    if (activities.steps < 1000 || activities.steps > 30000) {
      anomalies.push({
        type: AnomalyType.ACTIVITY,
        metric: 'steps',
        value: activities.steps,
        severity: this.calculateSeverity(activities.steps, 5000, 10000),
        timestamp: new Date(),
        description: '活动量异常',
      });
    }

    // 检测运动强度异常
    if (activities.intensity > 0.8) {
      anomalies.push({
        type: AnomalyType.ACTIVITY,
        metric: 'intensity',
        value: activities.intensity,
        severity: Severity.HIGH,
        timestamp: new Date(),
        description: '运动强度过高',
      });
    }

    return anomalies;
  }

  /**
   * 检测睡眠数据异常
   */
  private async detectSleepAnomalies(sleep: any): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];

    // 检测睡眠时长异常
    if (sleep.duration < 6 || sleep.duration > 10) {
      anomalies.push({
        type: AnomalyType.SLEEP,
        metric: 'duration',
        value: sleep.duration,
        severity: this.calculateSeverity(sleep.duration, 7, 9),
        timestamp: new Date(),
        description: '睡眠时长异常',
      });
    }

    // 检测睡眠质量异常
    if (sleep.quality < 0.6) {
      anomalies.push({
        type: AnomalyType.SLEEP,
        metric: 'quality',
        value: sleep.quality,
        severity: this.calculateSeverity(sleep.quality, 0.7, 0.9),
        timestamp: new Date(),
        description: '睡眠质量较差',
      });
    }

    return anomalies;
  }

  /**
   * 计算异常严重程度
   */
  private calculateSeverity(value: number, normal_min: number, normal_max: number): Severity {
    const deviation = Math.max(Math.abs(value - normal_min), Math.abs(value - normal_max));

    if (deviation > normal_max - normal_min) {
      return Severity.HIGH;
    } else if (deviation > (normal_max - normal_min) / 2) {
      return Severity.MEDIUM;
    } else {
      return Severity.LOW;
    }
  }

  /**
   * 计算整体异常严重程度
   */
  private calculateOverallSeverity(anomalies: AnomalyResult[]): number {
    if (anomalies.length === 0) return 0;

    const severityMap = {
      [Severity.LOW]: 1,
      [Severity.MEDIUM]: 2,
      [Severity.HIGH]: 3,
    };

    const totalSeverity = anomalies.reduce(
      (sum, anomaly) => sum + severityMap[anomaly.severity],
      0,
    );

    return totalSeverity / anomalies.length;
  }
}
