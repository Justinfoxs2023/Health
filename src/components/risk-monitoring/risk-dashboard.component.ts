import { Component, OnInit } from '@angular/core';
import { RiskManagementService } from '../../services/risk-management/risk-management.service';
import { RiskAssessment, HealthRisk } from '../../services/risk-management/types';
import { Theme } from '../../design-system/types';

@Component({
  selector: 'app-risk-dashboard',
  template: `
    <div class="risk-dashboard" [class]="theme">
      <!-- 风险评分卡片 -->
      <div class="risk-score-card">
        <h2>健康风险评分</h2>
        <div class="score" [class]="getRiskLevel()">
          {{ assessment?.overallScore | number:'1.0-0' }}
        </div>
        <div class="risk-level">{{ getRiskLevelText() }}</div>
      </div>

      <!-- 主要风险指标 -->
      <div class="risk-metrics">
        <h3>关键指标</h3>
        <div class="metrics-grid">
          <div *ngFor="let metric of assessment?.keyMetrics"
               class="metric-item"
               [class]="metric.status">
            <div class="metric-name">{{ metric.name }}</div>
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-trend">
              {{ getTrendIndicator(metric.trend) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 高风险项目 -->
      <div class="high-risks" *ngIf="getHighRisks().length">
        <h3>需要关注的风险</h3>
        <div class="risk-list">
          <div *ngFor="let risk of getHighRisks()"
               class="risk-item"
               [class]="risk.severity">
            <div class="risk-header">
              <span class="risk-name">{{ risk.name }}</span>
              <span class="risk-probability">
                {{ risk.probability | percent:'1.0-0' }}
              </span>
            </div>
            <div class="risk-actions">
              <ul>
                <li *ngFor="let prevention of getTopPreventions(risk)">
                  {{ prevention.action }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 健康建议 -->
      <div class="recommendations">
        <h3>建议措施</h3>
        <div class="recommendation-list">
          <div *ngFor="let rec of assessment?.recommendations"
               class="recommendation-item"
               [class]="rec.priority">
            <div class="recommendation-content">
              <span class="priority-badge">{{ rec.priority }}</span>
              <p>{{ rec.action }}</p>
            </div>
            <div class="timeframe">{{ rec.timeframe }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./risk-dashboard.component.scss']
})
export class RiskDashboardComponent implements OnInit {
  assessment: RiskAssessment;
  theme: Theme;
  loading = false;
  error: string;

  constructor(
    private riskService: RiskManagementService
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadAssessment();
    } catch (error) {
      this.error = '无法加载风险评估数据';
      console.error('Risk assessment loading error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadAssessment() {
    this.assessment = await this.riskService.performRiskAssessment(
      'current-user-id'
    );
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
      low: '低风险'
    };
    return levelTexts[this.getRiskLevel()];
  }

  getTrendIndicator(trend: string): string {
    const indicators = {
      improving: '↑ 改善',
      stable: '→ 稳定',
      worsening: '↓ 恶化'
    };
    return indicators[trend] || '→ 稳定';
  }

  getHighRisks(): HealthRisk[] {
    return this.assessment?.risks.filter(
      risk => ['high', 'critical'].includes(risk.severity)
    ) || [];
  }

  getTopPreventions(risk: HealthRisk, count = 3) {
    return risk.preventions
      .filter(p => p.priority === 'immediate')
      .slice(0, count);
  }

  refresh() {
    this.loadAssessment();
  }
} 