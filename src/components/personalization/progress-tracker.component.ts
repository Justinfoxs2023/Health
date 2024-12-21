import { Component, OnInit } from '@angular/core';
import { IExercisePlan, IDietPlan } from '../../services/personalization/types';
import { ITheme } from '../../design-system/types';
import { PersonalizationService } from '../../services/personalization/personalization.service';

@Component({
  selector: 'app-progress-tracker',
  template: `
    <div class="progress-tracker" [class]="theme">
      <!-- 总体进度 -->
      <section class="overall-progress">
        <h2></h2>
        <div class="progress-cards">
          <div class="progress-card exercise">
            <div class="progress-header">
              <span class="cardtitle"></span>
              <span class="progressvalue">{{ exercisePlanprogress  0 }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progressfill"
                stylewidth="exercisePlanprogress  0"
                class="getProgressClassexercisePlanprogress"
              ></div>
            </div>
            <div class="progress-stats">
              <div class="stat">
                <span class="label"></span>
                <span class="value">
                  {{ exercisePlantrackingactualProgresscompletedSessions }}/
                  {{ exercisePlantrackingweeklyTargetsessions }}
                </span>
              </div>
              <div class="stat">
                <span class="label"></span>
                <span class="value">
                  {{ exercisePlantrackingactualProgresscaloriesBurned }}
                </span>
              </div>
            </div>
          </div>

          <div class="progress-card diet">
            <div class="progress-header">
              <span class="cardtitle"></span>
              <span class="progressvalue">{{ dietPlanprogress  0 }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progressfill"
                stylewidth="dietPlanprogress  0"
                class="getProgressClassdietPlanprogress"
              ></div>
            </div>
            <div class="progress-stats">
              <div class="stat">
                <span class="label"></span>
                <span class="value">
                  {{ getCurrentCalories }}/{{ dietPlannutritionTargetscalories }}
                </span>
              </div>
              <div class="stat">
                <span class="label"></span>
                <span class="value">
                  {{ getCurrentHydration }}/{{ dietPlanhydrationdailyTarget }}ml
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 目标完成情况 -->
      <section class="goals-progress">
        <h3></h3>
        <div class="goals-grid">
          <div *ngFor="let goal of getAllGoals()" class="goal-card" [class]="goal.priority">
            <div class="goal-info">
              <span class="goaltype">{{ goaltype }}</span>
              <span class="goalpriority">{{ getPriorityTextgoalpriority }}</span>
            </div>
            <div class="goal-progress">
              <div class="currentvalue">{{ goalcurrentValue }}{{ goalunit }}</div>
              <div class="progress-bar">
                <div class="progressfill" stylewidth="calculateGoalProgressgoal"></div>
              </div>
              <div class="targetvalue">{{ goaltarget }}{{ goalunit }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 调整历史 -->
      <section class="adjustments-history">
        <h3></h3>
        <div class="history-timeline">
          <div *ngFor="let adjustment of getRecentAdjustments()" class="adjustment-item">
            <div class="adjustmentdate">
              {{ formatDateadjustmentdate }}
            </div>
            <div class="adjustment-content">
              <div class="reason">{{ adjustmentreason }}</div>
              <div class="changes">
                <div ngFor="let change of getChangeDetailsadjustmentchanges" class="changeitem">
                  {{ change }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./progress-tracker.component.scss'],
})
export class ProgressTrackerComponent implements OnInit {
  exercisePlan: IExercisePlan;
  dietPlan: IDietPlan;
  theme: ITheme;
  loading = false;
  error: string;

  constructor(private personalizationService: PersonalizationService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadPlans();
    } catch (error) {
      this.error = '无法加载进度数据';
      console.error('Error in progress-tracker.component.ts:', 'Progress loading error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadPlans() {
    const [exercisePlan, dietPlan] = await Promise.all([
      this.personalizationService.createExercisePlan('current-user-id'),
      this.personalizationService.createDietPlan('current-user-id'),
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
      low: '次要',
    };
    return texts[priority] || priority;
  }

  getAllGoals() {
    return [...(this.exercisePlan?.goals || []), ...(this.dietPlan?.goals || [])];
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
    return [...(this.exercisePlan?.adjustments || []), ...(this.dietPlan?.adjustments || [])].sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
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
      minute: 'numeric',
    }).format(date);
  }
}
