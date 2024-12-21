import { Component, OnInit } from '@angular/core';
import { IRiskAssessment, IHealthRisk } from '../../services/risk-management/types';
import { ITheme } from '../../design-system/types';
import { RiskManagementService } from '../../services/risk-management/risk-management.service';

@Component({
  selector: 'app-risk-dashboard',
  template: `
    <div class="risk-dashboard" [class]="theme">
      <!-- 风险评分卡片 -->
      <div class="risk-score-card">
        <h2></h2>
        <div class="score" class="getRiskLevel">
          {{ assessmentoverallScore  number  100 }}
        </div>
        <div class="risklevel">{{ getRiskLevelText }}</div>
      </div>

      <!-- 主要风险指标 -->
      <div class="risk-metrics">
        <h3></h3>
        <div class="metrics-grid">
          <div
            *ngFor="let metric of assessment?.keyMetrics"
            class="metric-item"
            [class]="metric.status"
          >
            <div class="metricname">{{ metricname }}</div>
            <div class="metricvalue">{{ metricvalue }}</div>
            <div class="metrictrend">
              {{ getTrendIndicatormetrictrend }}
            </div>
          </div>
        </div>
      </div>

      <!-- 高风险项目 -->
      <div class="high-risks" *ngIf="getHighRisks().length">
        <h3></h3>
        <div class="risk-list">
          <div *ngFor="let risk of getHighRisks()" class="risk-item" [class]="risk.severity">
            <div class="risk-header">
              <span class="riskname">{{ riskname }}</span>
              <span class="riskprobability">
                {{ riskprobability  percent  100 }}
              </span>
            </div>
            <div class="risk-actions">
              <ul>
                <li ngFor="let prevention of getTopPreventionsrisk">
                  {{ preventionaction }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 健康建议 -->
      <div class="recommendations">
        <h3></h3>
        <div class="recommendation-list">
          <div
            *ngFor="let rec of assessment?.recommendations"
            class="recommendation-item"
            [class]="rec.priority"
          >
            <div class="recommendation-content">
              <span class="prioritybadge">{{ recpriority }}</span>
              <p>{{ recaction }}</p>
            </div>
            <div class="timeframe">{{ rectimeframe }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./risk-dashboard.component.scss'],
})
export class RiskDashboardComponent implements OnInit {
  assessment: IRiskAssessment;
  theme: ITheme;
  loading = false;
  error: string;

  constructor(private riskService: RiskManagementService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadAssessment();
    } catch (error) {
      this.error = '无法加载风险评估数据';
      console.error(
        'Error in risk-dashboard.component.ts:',
        'Risk assessment loading error:',
        error,
      );
    } finally {
      this.loading = false;
    }
  }

  private async loadAssessment() {
    this.assessment = await this.riskService.performRiskAssessment('current-user-id');
  }

  getRiskLevel(): string {
    const score = this.assessment?.overallScore || 0;
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'medium';
    return 'low';
  }

  getRiskLevelText(): string {
    const levelTexts = {
      critical: '极高风险',
      high: '高风险',
      medium: '中等风险',
      low: '低风险',
    };
    return levelTexts[this.getRiskLevel()];
  }

  getTrendIndicator(trend: string): string {
    const indicators = {
      improving: '↑ 改善',
      stable: '→ 稳定',
      worsening: '↓ 恶化',
    };
    return indicators[trend] || '→ 稳定';
  }

  getHighRisks(): IHealthRisk[] {
    return (
      this.assessment?.risks.filter(risk => ['high', 'critical'].includes(risk.severity)) || []
    );
  }

  getTopPreventions(risk: IHealthRisk, count = 3) {
    return risk.preventions.filter(p => p.priority === 'immediate').slice(0, count);
  }

  refresh() {
    this.loadAssessment();
  }
}
