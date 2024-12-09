import { Component, OnInit } from '@angular/core';
import { PersonalizationService } from '../../services/personalization/personalization.service';
import { ExercisePlan, DietPlan } from '../../services/personalization/types';
import { Theme } from '../../design-system/types';

@Component({
  selector: 'app-progress-tracker',
  template: `
    <div class="progress-tracker" [class]="theme">
      <!-- 总体进度 -->
      <section class="overall-progress">
        <h2>计划完成进度</h2>
        <div class="progress-cards">
          <div class="progress-card exercise">
            <div class="progress-header">
              <span class="card-title">运动计划</span>
              <span class="progress-value">{{ exercisePlan?.progress || 0 }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" 
                   [style.width.%]="exercisePlan?.progress || 0"
                   [class]="getProgressClass(exercisePlan?.progress)">
              </div>
            </div>
            <div class="progress-stats">
              <div class="stat">
                <span class="label">本周训练</span>
                <span class="value">
                  {{ exercisePlan?.tracking.actualProgress.completedSessions }}/
                  {{ exercisePlan?.tracking.weeklyTarget.sessions }}
                </span>
              </div>
              <div class="stat">
                <span class="label">消耗热量</span>
                <span class="value">
                  {{ exercisePlan?.tracking.actualProgress.caloriesBurned }}千卡
                </span>
              </div>
            </div>
          </div>

          <div class="progress-card diet">
            <div class="progress-header">
              <span class="card-title">饮食计划</span>
              <span class="progress-value">{{ dietPlan?.progress || 0 }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" 
                   [style.width.%]="dietPlan?.progress || 0"
                   [class]="getProgressClass(dietPlan?.progress)">
              </div>
            </div>
            <div class="progress-stats">
              <div class="stat">
                <span class="label">今日摄入</span>
                <span class="value">
                  {{ getCurrentCalories() }}/{{ dietPlan?.nutritionTargets.calories }}千卡
                </span>
              </div>
              <div class="stat">
                <span class="label">水分摄入</span>
                <span class="value">
                  {{ getCurrentHydration() }}/{{ dietPlan?.hydration.dailyTarget }}ml
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 目标完成情况 -->
      <section class="goals-progress">
        <h3>目标达成情况</h3>
        <div class="goals-grid">
          <div *ngFor="let goal of getAllGoals()" 
               class="goal-card"
               [class]="goal.priority">
            <div class="goal-info">
              <span class="goal-type">{{ goal.type }}</span>
              <span class="goal-priority">{{ getPriorityText(goal.priority) }}</span>
            </div>
            <div class="goal-progress">
              <div class="current-value">{{ goal.currentValue }}{{ goal.unit }}</div>
              <div class="progress-bar">
                <div class="progress-fill" 
                     [style.width.%]="calculateGoalProgress(goal)">
                </div>
              </div>
              <div class="target-value">目标: {{ goal.target }}{{ goal.unit }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 调整历史 -->
      <section class="adjustments-history">
        <h3>计划调整历史</h3>
        <div class="history-timeline">
          <div *ngFor="let adjustment of getRecentAdjustments()" 
               class="adjustment-item">
            <div class="adjustment-date">
              {{ formatDate(adjustment.date) }}
            </div>
            <div class="adjustment-content">
              <div class="reason">{{ adjustment.reason }}</div>
              <div class="changes">
                <div *ngFor="let change of getChangeDetails(adjustment.changes)" 
                     class="change-item">
                  {{ change }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
  exercisePlan: ExercisePlan;
  dietPlan: DietPlan;
  theme: Theme;
  loading = false;
  error: string;

  constructor(
    private personalizationService: PersonalizationService
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadPlans();
    } catch (error) {
      this.error = '无法加载进度数据';
      console.error('Progress loading error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadPlans() {
    const [exercisePlan, dietPlan] = await Promise.all([
      this.personalizationService.createExercisePlan('current-user-id'),
      this.personalizationService.createDietPlan('current-user-id')
    ]);
    
    this.exercisePlan = exercisePlan;
    this.dietPlan = dietPlan;
  }

  getProgressClass(progress: number): string {
    if (progress >= 80) return 'excellent';
    if (progress >= 60) return 'good';
    if (progress >= 40) return 'fair';
    return 'needs-improvement';
  }

  getPriorityText(priority: string): string {
    const texts = {
      high: '优先',
      medium: '一般',
      low: '次要'
    };
    return texts[priority] || priority;
  }

  getAllGoals() {
    return [
      ...(this.exercisePlan?.goals || []),
      ...(this.dietPlan?.goals || [])
    ];
  }

  calculateGoalProgress(goal: any): number {
    return (goal.currentValue / goal.target) * 100;
  }

  getCurrentCalories(): number {
    // 实现当日卡路里计算逻辑
    return 0;
  }

  getCurrentHydration(): number {
    // 实现当前水分摄入计算逻辑
    return 0;
  }

  getRecentAdjustments() {
    return [
      ...(this.exercisePlan?.adjustments || []),
      ...(this.dietPlan?.adjustments || [])
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getChangeDetails(changes: Record<string, any>): string[] {
    // 实现变更详情格式化逻辑
    return Object.entries(changes).map(([key, value]) => `${key}: ${value}`);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  }
} 