import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  PerformanceMetrics,
  PerformanceWarning,
  OptimizationSuggestion,
  PerformanceReport,
  PerformanceConfig
} from './performance.types';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly config: PerformanceConfig = {
    intervals: {
      memory: 5000,
      cpu: 2000,
      fps: 1000,
      network: 10000
    },
    thresholds: {
      memory: 0.9,
      cpu: 0.8,
      fps: 30,
      temperature: 45,
      rtt: 500
    },
    autoOptimize: {
      enabled: true,
      strategies: {
        memoryCleanup: true,
        imageOptimization: true,
        codeOptimization: false
      }
    }
  };

  private metrics = new BehaviorSubject<PerformanceMetrics>({
    memory: { used: 0, total: 0, limit: 0 },
    cpu: { usage: 0, temperature: 0 },
    fps: { current: 0, average: 0, drops: 0 },
    network: { rtt: 0, downlink: 0, effectiveType: 'unknown' },
    battery: { level: 1, charging: false }
  });

  private warnings = new BehaviorSubject<PerformanceWarning[]>([]);
  private fpsHistory: number[] = [];
  private isMonitoring = false;

  constructor(private platform: Platform) {
    if (this.platform.is('cordova')) {
      this.initializeNativeMonitoring();
    } else {
      this.initializeWebMonitoring();
    }
  }

  // 启动性能监控
  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // 启动各项监控
    this.startMemoryMonitoring();
    this.startCPUMonitoring();
    this.startFPSMonitoring();
    this.startNetworkMonitoring();
    this.startBatteryMonitoring();

    // 启动自动优化
    if (this.config.autoOptimize.enabled) {
      this.startAutoOptimization();
    }
  }

  // 停止性能监控
  stopMonitoring(): void {
    this.isMonitoring = false;
    // 清理所有监控定时器
  }

  // 获取性能指标
  getMetrics(): Observable<PerformanceMetrics> {
    return this.metrics.asObservable();
  }

  // 获取性能警告
  getWarnings(): Observable<PerformanceWarning[]> {
    return this.warnings.asObservable();
  }

  // 生成性能报告
  async generateReport(): Promise<PerformanceReport> {
    const currentMetrics = this.metrics.value;
    const currentWarnings = this.warnings.value;
    const suggestions = this.generateOptimizationSuggestions(currentMetrics);

    return {
      timestamp: new Date(),
      metrics: currentMetrics,
      warnings: currentWarnings,
      suggestions,
      score: this.calculatePerformanceScore(currentMetrics)
    };
  }

  // 手动优化
  async optimize(strategies: string[]): Promise<void> {
    for (const strategy of strategies) {
      switch (strategy) {
        case 'memory':
          await this.optimizeMemory();
          break;
        case 'images':
          await this.optimizeImages();
          break;
        case 'code':
          await this.optimizeCode();
          break;
      }
    }
  }

  // 私有方法
  private initializeWebMonitoring(): void {
    // Web环境监控初始化
  }

  private initializeNativeMonitoring(): void {
    // Native环境监控初始化
  }

  private startMemoryMonitoring(): void {
    if ('memory' in performance) {
      interval(this.config.intervals.memory).subscribe(() => {
        const memory = (performance as any).memory;
        this.updateMetrics({
          memory: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          }
        });
        this.checkMemoryWarnings();
      });
    }
  }

  private startCPUMonitoring(): void {
    // 实现CPU监控
  }

  private startFPSMonitoring(): void {
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      if (!this.isMonitoring) return;

      const now = performance.now();
      frames++;

      if (now >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        this.updateFPSMetrics(fps);
        frames = 0;
        lastTime = now;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private startNetworkMonitoring(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        this.updateMetrics({
          network: {
            rtt: connection.rtt,
            downlink: connection.downlink,
            effectiveType: connection.effectiveType
          }
        });
        this.checkNetworkWarnings();
      };

      connection.addEventListener('change', updateNetworkInfo);
      interval(this.config.intervals.network).subscribe(updateNetworkInfo);
    }
  }

  private startBatteryMonitoring(): void {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then(battery => {
        const updateBatteryInfo = () => {
          this.updateMetrics({
            battery: {
              level: battery.level,
              charging: battery.charging
            }
          });
        };

        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
      });
    }
  }

  private startAutoOptimization(): void {
    interval(30000).subscribe(() => {
      const metrics = this.metrics.value;
      
      if (this.shouldOptimize(metrics)) {
        this.performAutoOptimization(metrics);
      }
    });
  }

  private updateMetrics(update: Partial<PerformanceMetrics>): void {
    this.metrics.next({
      ...this.metrics.value,
      ...update
    });
  }

  private updateFPSMetrics(currentFPS: number): void {
    this.fpsHistory.push(currentFPS);
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    const averageFPS = this.calculateAverageFPS();
    const drops = this.countFPSDrops();

    this.updateMetrics({
      fps: {
        current: currentFPS,
        average: averageFPS,
        drops
      }
    });

    this.checkFPSWarnings(currentFPS);
  }

  private calculateAverageFPS(): number {
    return Math.round(
      this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
    );
  }

  private countFPSDrops(): number {
    return this.fpsHistory.filter(fps => fps < this.config.thresholds.fps).length;
  }

  private shouldOptimize(metrics: PerformanceMetrics): boolean {
    return (
      metrics.memory.used / metrics.memory.total > this.config.thresholds.memory ||
      metrics.fps.current < this.config.thresholds.fps ||
      metrics.cpu.usage > this.config.thresholds.cpu
    );
  }

  private async performAutoOptimization(metrics: PerformanceMetrics): Promise<void> {
    const { strategies } = this.config.autoOptimize;

    if (strategies.memoryCleanup && metrics.memory.used / metrics.memory.total > this.config.thresholds.memory) {
      await this.optimizeMemory();
    }

    if (strategies.imageOptimization && metrics.memory.used / metrics.memory.total > 0.7) {
      await this.optimizeImages();
    }

    if (strategies.codeOptimization && metrics.cpu.usage > this.config.thresholds.cpu) {
      await this.optimizeCode();
    }
  }

  private async optimizeMemory(): Promise<void> {
    // 实现内存优化逻辑
  }

  private async optimizeImages(): Promise<void> {
    // 实现图片优化逻辑
  }

  private async optimizeCode(): Promise<void> {
    // 实现代码优化逻辑
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    // 实现性能评分计算逻辑
    return 0;
  }
} 