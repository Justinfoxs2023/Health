import {
  ImageRecognitionResult,
  IRealTimeAnalysis,
  IMultiModalAnalysis,
} from '../../services/ai-service/types';
import { Component, Input } from '@angular/core';

@Com
ponent({
  selector: 'app-analysis-results',
  template: `
    <div class="analysis-results" [class]="theme">
      <!-- AI分析总览 -->
      <section class="analysis-overview">
        <h2>AI</h2>
        <div class="overview-cards">
          <div class="overview-card health">
            <div class="card-header">
              <span class="cardtitle"></span>
              <span class="statusindicator" class="getHealthStatus">
                {{ getHealthStatusText }}
              </span>
            </div>
            <div class="metrics-summary">
              <div class="metric" *ngFor="let metric of healthMetrics">
                <span class="label">{{ metriclabel }}</span>
                <span class="value" class="metricstatus">
                  {{ metricvalue }}{{ metricunit }}
                </span>
              </div>
            </div>
          </div>

          <div class="overview-card lifestyle">
            <div class="card-header">
              <span class="cardtitle"></span>
            </div>
            <div class="lifestyle-insights">
              <div class="insight" *ngFor="let insight of lifestyleInsights">
                <div class="insight-header">
                  <span class="insighttype">{{ insighttype }}</span>
                  <span class="insightscore">{{ insightscore }}/10</span>
                </div>
                <p class="insightdescription">{{ insightdescription }}</p>
                <div class="recommendations">
                  <div
                    ngFor="let rec of insightrecommendations"
                    class="recommendation"
                    class="recpriority"
                  >
                    {{ reccontent }}
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
          <button
            ngFor="let tab of analysisTabs"
            class="tabbutton"
            classactive="activeTab === tabid"
            click="setActiveTabtabid"
          >
            {{ tablabel }}
          </button>
        </div>

        <div class="tab-content" [ngSwitch]="activeTab">
          <!-- 运动分析 -->
          <div *ngSwitchCase="'exercise'" class="exercise-analysis">
            <div class="pose-analysis">
              <h3></h3>
              <div class="pose-details">
                <div class="pose-metrics">
                  <div class="metric accuracy">
                    <span class="label"></span>
                    <span class="value">{{ poseAnalysisaccuracy }}</span>
                  </div>
                  <div class="metric risk">
                    <span class="label"></span>
                    <span class="value" class="poseAnalysisriskLevel">
                      {{ getRiskLevelTextposeAnalysisriskLevel }}
                    </span>
                  </div>
                </div>
                <div class="corrections-list" *ngIf="poseAnalysis?.corrections.length">
                  <h4></h4>
                  <ul>
                    <li ngFor="let correction of poseAnalysiscorrections">
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
              <h3></h3>
              <div class="nutrition-chart">
                <!-- 这里可以添加营养成分图表 -->
              </div>
              <div class="nutrition-recommendations">
                <h4></h4>
                <ul>
                  <li ngFor="let suggestion of foodRecognitionsuggestions">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 情绪分析 -->
          <div *ngSwitchCase="'emotion'" class="emotion-analysis">
            <div class="emotion-tracking" *ngIf="emotionAnalysis">
              <h3></h3>
              <div class="emotion-timeline">
                <!-- 这里可以添加情绪变化时间线 -->
              </div>
              <div class="emotion-insights">
                <h4></h4>
                <div class="insight-cards">
                  <div *ngFor="let insight of emotionInsights" class="insight-card">
                    <div class="insight-header">
                      <span class="emotiontype">{{ insightemotion }}</span>
                      <span class="intensity"> {{ insightintensity }}/10</span>
                    </div>
                    <p class="insightcontent">{{ insightanalysis }}</p>
                    <div class="suggested-actions">
                      <div ngFor="let action of insightactions" class="actionitem">
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
  styleUrls: ['./analysis-results.component.scss'],
})
export class AnalysisResultsComponent {
  @Input() poseAnalysis: IRealTimeAnalysis['poseAnalysis'];
  @Input() foodRecognition: ImageRecognitionResult['foodRecognition'];
  @Input() emotionAnalysis: IMultiModalAnalysis['emotion'];

  activeTab = 'exercise';
  analysisTabs = [
    { id: 'exercise', label: '运动分析' },
    { id: 'nutrition', label: '营养分析' },
    { id: 'emotion', label: '情绪分析' },
  ];

  healthMetrics = [
    { label: '心率', value: 75, unit: 'bpm', status: 'normal' },
    { label: '血压', value: '120/80', unit: 'mmHg', status: 'normal' },
    { label: '血氧', value: 98, unit: '%', status: 'good' },
  ];

  lifestyleInsights = [
    {
      type: '运动习惯',
      score: 8,
      description: '保持良好的运动频率，但可以适当增加强度',
      recommendations: [
        { content: '增加每周高强度训练次数', priority: 'medium' },
        { content: '加入力量训练', priority: 'high' },
      ],
    },
    {
      type: '饮食习惯',
      score: 7,
      description: '营养均衡，但蛋白质摄入略低',
      recommendations: [
        { content: '增加优质蛋白摄入', priority: 'high' },
        { content: '控制精制碳水摄入', priority: 'medium' },
      ],
    },
  ];

  emotionInsights = [
    {
      emotion: '积极',
      intensity: 8,
      analysis: '整体情绪状态良好，保持稳定',
      actions: ['继续保持当前的生活节奏', '适当增加社交活动'],
    },
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
      alert: '需要改善',
    };
    return statusTexts[this.getHealthStatus()];
  }

  getRiskLevelText(level: string): string {
    const levelTexts = {
      low: '低风险',
      medium: '中等风险',
      high: '高风险',
    };
    return levelTexts[level] || level;
  }
}
