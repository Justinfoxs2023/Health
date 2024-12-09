import { Component, Input } from '@angular/core';
import { 
  ImageRecognitionResult, 
  RealTimeAnalysis,
  MultiModalAnalysis 
} from '../../services/ai-service/types';

@Component({
  selector: 'app-analysis-results',
  template: `
    <div class="analysis-results" [class]="theme">
      <!-- AI分析总览 -->
      <section class="analysis-overview">
        <h2>AI健康分析报告</h2>
        <div class="overview-cards">
          <div class="overview-card health">
            <div class="card-header">
              <span class="card-title">健康状况</span>
              <span class="status-indicator" [class]="getHealthStatus()">
                {{ getHealthStatusText() }}
              </span>
            </div>
            <div class="metrics-summary">
              <div class="metric" *ngFor="let metric of healthMetrics">
                <span class="label">{{ metric.label }}</span>
                <span class="value" [class]="metric.status">
                  {{ metric.value }}{{ metric.unit }}
                </span>
              </div>
            </div>
          </div>

          <div class="overview-card lifestyle">
            <div class="card-header">
              <span class="card-title">生活方式分析</span>
            </div>
            <div class="lifestyle-insights">
              <div class="insight" *ngFor="let insight of lifestyleInsights">
                <div class="insight-header">
                  <span class="insight-type">{{ insight.type }}</span>
                  <span class="insight-score">{{ insight.score }}/10</span>
                </div>
                <p class="insight-description">{{ insight.description }}</p>
                <div class="recommendations">
                  <div *ngFor="let rec of insight.recommendations" 
                       class="recommendation"
                       [class]="rec.priority">
                    {{ rec.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细分析结果 -->
      <section class="detailed-analysis">
        <div class="analysis-tabs">
          <button *ngFor="let tab of analysisTabs"
                  class="tab-button"
                  [class.active]="activeTab === tab.id"
                  (click)="setActiveTab(tab.id)">
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content" [ngSwitch]="activeTab">
          <!-- 运动分析 -->
          <div *ngSwitchCase="'exercise'" class="exercise-analysis">
            <div class="pose-analysis">
              <h3>姿态分析</h3>
              <div class="pose-details">
                <div class="pose-metrics">
                  <div class="metric accuracy">
                    <span class="label">准确度</span>
                    <span class="value">{{ poseAnalysis?.accuracy }}%</span>
                  </div>
                  <div class="metric risk">
                    <span class="label">风险等级</span>
                    <span class="value" [class]="poseAnalysis?.riskLevel">
                      {{ getRiskLevelText(poseAnalysis?.riskLevel) }}
                    </span>
                  </div>
                </div>
                <div class="corrections-list" *ngIf="poseAnalysis?.corrections.length">
                  <h4>改进建议</h4>
                  <ul>
                    <li *ngFor="let correction of poseAnalysis?.corrections">
                      {{ correction }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 营养分析 -->
          <div *ngSwitchCase="'nutrition'" class="nutrition-analysis">
            <div class="meal-analysis" *ngIf="foodRecognition">
              <h3>膳食分析</h3>
              <div class="nutrition-chart">
                <!-- 这里可以添加营养成分图表 -->
              </div>
              <div class="nutrition-recommendations">
                <h4>营养建议</h4>
                <ul>
                  <li *ngFor="let suggestion of foodRecognition.suggestions">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 情绪分析 -->
          <div *ngSwitchCase="'emotion'" class="emotion-analysis">
            <div class="emotion-tracking" *ngIf="emotionAnalysis">
              <h3>情绪追踪</h3>
              <div class="emotion-timeline">
                <!-- 这里可以添加情绪变化时间线 -->
              </div>
              <div class="emotion-insights">
                <h4>情绪洞察</h4>
                <div class="insight-cards">
                  <div *ngFor="let insight of emotionInsights" 
                       class="insight-card">
                    <div class="insight-header">
                      <span class="emotion-type">{{ insight.emotion }}</span>
                      <span class="intensity">强度: {{ insight.intensity }}/10</span>
                    </div>
                    <p class="insight-content">{{ insight.analysis }}</p>
                    <div class="suggested-actions">
                      <div *ngFor="let action of insight.actions" 
                           class="action-item">
                        {{ action }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./analysis-results.component.scss']
})
export class AnalysisResultsComponent {
  @Input() poseAnalysis: RealTimeAnalysis['poseAnalysis'];
  @Input() foodRecognition: ImageRecognitionResult['foodRecognition'];
  @Input() emotionAnalysis: MultiModalAnalysis['emotion'];

  activeTab = 'exercise';
  analysisTabs = [
    { id: 'exercise', label: '运动分析' },
    { id: 'nutrition', label: '营养分析' },
    { id: 'emotion', label: '情绪分析' }
  ];

  healthMetrics = [
    { label: '心率', value: 75, unit: 'bpm', status: 'normal' },
    { label: '血压', value: '120/80', unit: 'mmHg', status: 'normal' },
    { label: '血氧', value: 98, unit: '%', status: 'good' }
  ];

  lifestyleInsights = [
    {
      type: '运动习惯',
      score: 8,
      description: '保持良好的运动频率，但可以适当增加强度',
      recommendations: [
        { content: '增加每周高强度训练次数', priority: 'medium' },
        { content: '加入力量训练', priority: 'high' }
      ]
    },
    {
      type: '饮食习惯',
      score: 7,
      description: '营养均衡，但蛋白质摄入略低',
      recommendations: [
        { content: '增加优质蛋白摄入', priority: 'high' },
        { content: '控制精制碳水摄入', priority: 'medium' }
      ]
    }
  ];

  emotionInsights = [
    {
      emotion: '积极',
      intensity: 8,
      analysis: '整体情绪状态良好，保持稳定',
      actions: [
        '继续保持当前的生活节奏',
        '适当增加社交活动'
      ]
    }
  ];

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  getHealthStatus(): string {
    // 实现健康状态判断逻辑
    return 'good';
  }

  getHealthStatusText(): string {
    const statusTexts = {
      good: '状态良好',
      warning: '需要注意',
      alert: '需要改善'
    };
    return statusTexts[this.getHealthStatus()];
  }

  getRiskLevelText(level: string): string {
    const levelTexts = {
      low: '低风险',
      medium: '中等风险',
      high: '高风险'
    };
    return levelTexts[level] || level;
  }
} 