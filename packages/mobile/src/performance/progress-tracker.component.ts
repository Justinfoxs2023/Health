import {
  IOptimizationProgress,
  IOptimizationHistory,
  IOptimizationSuggestion,
  IProgressTrackerConfig,
} from './progress-tracker.types';
import { BehaviorSubject, Subject, interval } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PerformanceService } from '../performance/performance.service';
import { takeUntil, switchMap } from 'rxjs/operators';

@Comp
onent({
  selector: 'app-progress-tracker',
  template: `
    <div class="performance-tracker">
      <!-- 优化进度 -->
      <section class="optimization-progress">
        <h3>性能优化进度</h3>
        <ng-container *ngIf="progressList$ | async as progressList">
          <div class="progress-item" *ngFor="let progress of progressList">
            <div class="progress-label">
              <span>{{ getProgressLabel(progress.type) }}</span>
              <span>{{ formatProgress(progress) }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                [style.width]="getProgressPercentage(progress) + '%'"
                [class]="progress.status"
              ></div>
            </div>
          </div>
        </ng-container>
      </section>

      <!-- 优化历史 -->
      <section class="optimization-history">
        <h3>优化历史记录</h3>
        <ng-container *ngIf="historyList$ | async as historyList">
          <div class="history-list">
            <div *ngFor="let record of historyList" class="history-item">
              <div class="history-header">
                <span class="history-type">{{ record.type }}</span>
                <span class="history-time">{{ record.timestamp | date : 'MM-dd HH:mm' }}</span>
              </div>
              <div class="history-metrics">
                <div class="metric">
                  <span>优化前</span>
                  <span>{{ formatMetric(record.before, record.type) }}</span>
                </div>
                <div class="metric-arrow">→</div>
                <div class="metric">
                  <span>优化后</span>
                  <span>{{ formatMetric(record.after, record.type) }}</span>
                </div>
              </div>
              <div class="improvement" [class.positive]="record.improvement > 0">
                {{ formatImprovement(record.improvement) }}
              </div>
              <div class="details" *ngIf="record.details">
                <div class="detail-item">
                  <span>优化措施:</span>
                  <span>{{ record.details.action }}</span>
                </div>
                <div class="detail-item">
                  <span>影响范围:</span>
                  <span>{{ record.details.impact }}</span>
                </div>
                <div class="detail-item">
                  <span>耗时:</span>
                  <span>{{ formatDuration(record.details.duration) }}</span>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </section>

      <!-- 优化建议 -->
      <section class="optimization-suggestions">
        <h3>优化建议</h3>
        <ng-container *ngIf="suggestions$ | async as suggestions">
          <div class="suggestion-list">
            <div
              *ngFor="let suggestion of suggestions"
              class="suggestion-item"
              [class]="suggestion.priority"
            >
              <div class="suggestion-icon">
                <i [class]="suggestion.icon"></i>
              </div>
              <div class="suggestion-content">
                <div class="suggestion-title">{{ suggestion.title }}</div>
                <div class="suggestion-description">{{ suggestion.description }}</div>
                <div class="suggestion-meta">
                  <span class="effort">难度: {{ suggestion.effort }}</span>
                  <span class="impact">收益: {{ suggestion.impact }}%</span>
                </div>
              </div>
              <button
                class="suggestion-action"
                [disabled]="suggestion.status === 'in_progress'"
                (click)="applySuggestion(suggestion)"
              >
                {{ getSuggestionActionText(suggestion) }}
              </button>
            </div>
          </div>
        </ng-container>
      </section>
    </div>
  `,
})
export class ProgressTrackerComponent implements OnInit, OnDestroy {
  @Input() config!: IProgressTrackerConfig;

  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new Subject<void>();

  progressList$ = new BehaviorSubject<IOptimizationProgress[]>([]);
  historyList$ = new BehaviorSubject<IOptimizationHistory[]>([]);
  suggestions$ = new BehaviorSubject<IOptimizationSuggestion[]>([]);

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.initializeTracker();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 格式化方法
  getProgressLabel(type: IOptimizationProgress['type']): string {
    const labels: Record<IOptimizationProgress['type'], string> = {
      memory: '内存优化',
      performance: '性能优化',
      network: '网络优化',
    };
    return labels[type];
  }

  formatProgress(progress: IOptimizationProgress): string {
    const current = this.formatMetric(progress.current, progress.type);
    const target = this.formatMetric(progress.target, progress.type);
    return `${current} / ${target}`;
  }

  getProgressPercentage(progress: IOptimizationProgress): number {
    const percentage = (progress.current / progress.target) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }

  formatMetric(value: number, type: IOptimizationProgress['type']): string {
    switch (type) {
      case 'memory':
        return `${(value / (1024 * 1024)).toFixed(1)} MB`;
      case 'performance':
        return `${value.toFixed(1)} fps`;
      case 'network':
        return `${value.toFixed(0)} ms`;
      default:
        return value.toString();
    }
  }

  formatImprovement(value: number): string {
    const sign = value > 0 ? '+' : '';
    const formattedValue = Math.abs(value).toFixed(1);
    return `${sign}${formattedValue}%`;
  }

  formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }
    const seconds = milliseconds / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }

  getSuggestionActionText(suggestion: IOptimizationSuggestion): string {
    const texts: Record<IOptimizationSuggestion['status'], string> = {
      pending: '应用',
      in_progress: '优化中...',
      completed: '已完成',
    };
    return texts[suggestion.status];
  }

  // 操作方法
  async applySuggestion(suggestion: IOptimizationSuggestion): Promise<void> {
    if (suggestion.status !== 'pending') return;

    try {
      const updatedSuggestion = { ...suggestion, status: 'in_progress' as const };
      this.updateSuggestion(updatedSuggestion);

      await this.performanceService.optimize(suggestion.type);

      this.updateSuggestion({
        ...updatedSuggestion,
        status: 'completed' as const,
      });
      this.refresh$.next();
    } catch (error) {
      this.updateSuggestion({
        ...suggestion,
        status: 'pending' as const,
      });
      console.error('Error in progress-tracker.component.ts:', '优化应用失败:', error);
    }
  }

  // 私有方法
  private async initializeTracker(): Promise<void> {
    try {
      await this.refreshData();
      this.subscribeToUpdates();
    } catch (error) {
      console.error('Error in progress-tracker.component.ts:', '初始化追踪器失败:', error);
    }
  }

  private setupAutoRefresh(): void {
    if (this.config.refreshInterval > 0) {
      interval(this.config.refreshInterval)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.refresh$.next());
    }
  }

  private async refreshData(): Promise<void> {
    try {
      const [progress, history, suggestions] = await Promise.all([
        this.performanceService.getOptimizationProgress(),
        this.performanceService.getOptimizationHistory(),
        this.performanceService.getOptimizationSuggestions(),
      ]);

      this.progressList$.next(progress);
      this.historyList$.next(history);
      this.suggestions$.next(suggestions);
    } catch (error) {
      console.error('Error in progress-tracker.component.ts:', '数据刷新失败:', error);
    }
  }

  private subscribeToUpdates(): void {
    this.refresh$
      .pipe(
        switchMap(() => from(this.refreshData())),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.performanceService
      .optimizationUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh$.next());
  }

  private updateSuggestion(suggestion: IOptimizationSuggestion): void {
    const currentSuggestions = this.suggestions$.value;
    const index = currentSuggestions.findIndex(s => s.id === suggestion.id);
    if (index !== -1) {
      const updatedSuggestions = [
        ...currentSuggestions.slice(0, index),
        suggestion,
        ...currentSuggestions.slice(index + 1),
      ];
      this.suggestions$.next(updatedSuggestions);
    }
  }
}
