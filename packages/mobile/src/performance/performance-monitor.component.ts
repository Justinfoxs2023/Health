import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerformanceService } from './performance.service';
import { PerformanceMetrics, PerformanceWarning, OptimizationSuggestion } from './performance.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-performance-monitor',
  template: `
    <div class="performance-monitor">
      <!-- 性能指标卡片 -->
      <section class="metrics-cards">
        <div class="metric-card memory" [class.warning]="isMemoryWarning">
          <div class="metric-header">
            <i class="icon-memory"></i>
            <span>内存使用</span>
          </div>
          <div class="metric-value">
            {{ formatMemory(metrics.memory.used) }} / 
            {{ formatMemory(metrics.memory.total) }}
          </div>
          <div class="metric-progress">
            <div class="progress-bar" 
                 [style.width]="getMemoryUsage() + '%'"
                 [class.critical]="isMemoryCritical">
            </div>
          </div>
        </div>

        <div class="metric-card cpu" [class.warning]="isCPUWarning">
          <div class="metric-header">
            <i class="icon-cpu"></i>
            <span>CPU使用率</span>
          </div>
          <div class="metric-value">
            {{ (metrics.cpu.usage * 100).toFixed(1) }}%
          </div>
          <div class="metric-detail">
            温度: {{ metrics.cpu.temperature }}°C
          </div>
        </div>

        <div class="metric-card fps" [class.warning]="isFPSWarning">
          <div class="metric-header">
            <i class="icon-fps"></i>
            <span>帧率</span>
          </div>
          <div class="metric-value">
            {{ metrics.fps.current }} FPS
          </div>
          <div class="metric-detail">
            掉帧: {{ metrics.fps.drops }}次
          </div>
        </div>

        <div class="metric-card network">
          <div class="metric-header">
            <i class="icon-network"></i>
            <span>网络状态</span>
          </div>
          <div class="metric-value">
            {{ metrics.network.effectiveType }}
          </div>
          <div class="metric-detail">
            延迟: {{ metrics.network.rtt }}ms
          </div>
        </div>
      </section>

      <!-- 性能警告 -->
      <section class="warnings" *ngIf="warnings.length">
        <h3>性能警告</h3>
        <div class="warning-list">
          <div *ngFor="let warning of warnings"
               class="warning-item"
               [class]="warning.level">
            <i [class]="getWarningIcon(warning)"></i>
            <div class="warning-content">
              <div class="warning-message">{{ warning.message }}</div>
              <div class="warning-time">
                {{ warning.timestamp | date:'HH:mm:ss' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 优化建议 -->
      <section class="suggestions" *ngIf="suggestions.length">
        <h3>优化建议</h3>
        <div class="suggestion-list">
          <div *ngFor="let suggestion of suggestions"
               class="suggestion-item"
               [class]="suggestion.priority">
            <div class="suggestion-header">
              <span class="suggestion-title">{{ suggestion.title }}</span>
              <span class="suggestion-priority">{{ suggestion.priority }}</span>
            </div>
            <p class="suggestion-description">{{ suggestion.description }}</p>
            <div class="suggestion-actions">
              <button *ngFor="let action of suggestion.actions"
                      (click)="executeSuggestion(suggestion, action)">
                {{ action }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./performance-monitor.component.scss']
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  metrics: PerformanceMetrics;
  warnings: PerformanceWarning[] = [];
  suggestions: OptimizationSuggestion[] = [];

  constructor(private performanceService: PerformanceService) {}

  ngOnInit() {
    // 订阅性能指标更新
    this.performanceService.getMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.metrics = metrics;
        this.checkWarnings();
      });

    // 订阅性能警告
    this.performanceService.getWarnings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(warnings => {
        this.warnings = warnings;
        this.updateSuggestions();
      });

    // 启动性能监控
    this.performanceService.startMonitoring();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.performanceService.stopMonitoring();
  }

  // 格式化内存大小
  formatMemory(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  // 获取内存使用百分比
  getMemoryUsage(): number {
    return (this.metrics.memory.used / this.metrics.memory.total) * 100;
  }

  // 获取警告图标
  getWarningIcon(warning: PerformanceWarning): string {
    switch (warning.type) {
      case 'memory': return 'icon-memory-warning';
      case 'cpu': return 'icon-cpu-warning';
      case 'fps': return 'icon-fps-warning';
      case 'network': return 'icon-network-warning';
      case 'battery': return 'icon-battery-warning';
      default: return 'icon-warning';
    }
  }

  // 执行优化建议
  async executeSuggestion(suggestion: OptimizationSuggestion, action: string) {
    try {
      await this.performanceService.optimize([suggestion.type]);
      // 更新建议状态
      this.updateSuggestions();
    } catch (error) {
      console.error('Failed to execute suggestion:', error);
    }
  }

  // 检查性能警告
  private checkWarnings() {
    const { memory, cpu, fps } = this.metrics;

    this.isMemoryWarning = memory.used / memory.total > 0.8;
    this.isMemoryCritical = memory.used / memory.total > 0.9;
    this.isCPUWarning = cpu.usage > 0.8;
    this.isFPSWarning = fps.current < 30;
  }

  // 更新优化建议
  private async updateSuggestions() {
    const report = await this.performanceService.generateReport();
    this.suggestions = report.suggestions;
  }
} 