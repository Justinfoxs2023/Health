import { ConfigService } from '@nestjs/config';
import { IVitalSigns, IAnomalyDetection } from './types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '../../infrastructure/logger/logger.service';
import { MetricsService } from '../../infrastructure/monitoring/metrics.service';
import { Subject, Observable } from 'rxjs';
import { filter, map, buffer, debounceTime } from 'rxjs/operators';

@Injectable()
export class RealTimeProcessorService implements OnModuleInit {
  private readonly dataStream = new Subject<IVitalSigns>();
  private readonly anomalyStream = new Subject<IAnomalyDetection>();
  private readonly alertThresholds: Map<string, { min: number; max: number }>;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly metrics: MetricsService,
  ) {
    this.alertThresholds = this.loadAlertThresholds();
  }

  async onModuleInit() {
    this.setupDataProcessing();
  }

  private loadAlertThresholds(): Map<string, { min: number; max: number }> {
    // 从配置加载警报阈值
    return new Map([
      ['heartRate', { min: 60, max: 100 }],
      ['systolic', { min: 90, max: 140 }],
      ['diastolic', { min: 60, max: 90 }],
      ['temperature', { min: 36.1, max: 37.2 }],
      ['respiratoryRate', { min: 12, max: 20 }],
      ['oxygenSaturation', { min: 95, max: 100 }],
    ]);
  }

  private setupDataProcessing() {
    // 设置实时数据处理管道
    this.dataStream
      .pipe(
        // 缓冲收集数据
        buffer(this.dataStream.pipe(debounceTime(1000))),
        // 过滤空数据
        filter(data => data.length > 0),
        // 处理数据批次
        map(batch => this.processBatch(batch)),
      )
      .subscribe(
        anomalies => {
          anomalies.forEach(anomaly => this.anomalyStream.next(anomaly));
        },
        error => {
          this.logger.error('Error processing real-time data:', error);
        },
      );
  }

  // 接收新的生命体征数据
  processVitalSigns(vitalSigns: IVitalSigns): void {
    this.dataStream.next(vitalSigns);
  }

  // 订阅异常检测结果
  subscribeToAnomalies(): Observable<IAnomalyDetection> {
    return this.anomalyStream.asObservable();
  }

  private processBatch(batch: IVitalSigns[]): IAnomalyDetection[] {
    const anomalies: IAnomalyDetection[] = [];
    const startTime = Date.now();

    try {
      batch.forEach(signs => {
        // 检查每个生命体征指标
        this.checkVitalSign(signs, 'heartRate', signs.heartRate, anomalies);
        this.checkVitalSign(signs, 'systolic', signs.bloodPressure.systolic, anomalies);
        this.checkVitalSign(signs, 'diastolic', signs.bloodPressure.diastolic, anomalies);
        this.checkVitalSign(signs, 'temperature', signs.temperature, anomalies);
        this.checkVitalSign(signs, 'respiratoryRate', signs.respiratoryRate, anomalies);
        this.checkVitalSign(signs, 'oxygenSaturation', signs.oxygenSaturation, anomalies);
      });

      // 记录处理性能
      const duration = Date.now() - startTime;
      this.metrics.recordProcessingTime('vitalSigns', duration);

      return anomalies;
    } catch (error) {
      this.logger.error('Error processing vital signs batch:', error);
      return [];
    }
  }

  private checkVitalSign(
    signs: IVitalSigns,
    metric: string,
    value: number,
    anomalies: IAnomalyDetection[],
  ): void {
    const threshold = this.alertThresholds.get(metric);
    if (!threshold) return;

    if (value < threshold.min || value > threshold.max) {
      anomalies.push({
        metric,
        value,
        expectedRange: threshold,
        severity: this.calculateSeverity(value, threshold),
        timestamp: signs.timestamp,
      });
    }
  }

  private calculateSeverity(
    value: number,
    threshold: { min: number; max: number },
  ): 'low' | 'medium' | 'high' {
    const minDiff = Math.abs(value - threshold.min);
    const maxDiff = Math.abs(value - threshold.max);
    const deviation = Math.min(minDiff, maxDiff);

    if (deviation > (threshold.max - threshold.min) * 0.5) {
      return 'high';
    } else if (deviation > (threshold.max - threshold.min) * 0.2) {
      return 'medium';
    }
    return 'low';
  }
}
