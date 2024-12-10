import { Component, OnInit } from '@angular/core';
import { PersonalizationService } from '../../services/personalization/personalization.service';
import { ExercisePlan } from '../../services/personalization/types';
import { Theme } from '../../design-system/types';

@Component({
  selector: 'app-exercise-plan',
  template: `
    <div class="exercise-plan" [class]="theme">
      <!-- 计划概览 -->
      <section class="plan-overview">
        <h2>个性化运动计划</h2>
        <div class="progress-card">
          <div class="progress-bar" [style.width.%]="plan?.progress || 0"></div>
          <div class="progress-text">完成度: {{ plan?.progress || 0 }}%</div>
        </div>
      </section>

      <!-- 本周计划 -->
      <section class="weekly-schedule">
        <h3>本周运动安排</h3>
        <div class="schedule-grid">
          <div *ngFor="let day of plan?.schedule" class="day-card">
            <div class="day-header">
              <span class="day-name">{{ getDayName(day.dayOfWeek) }}</span>
              <span class="exercise-count">{{ day.exercises.length }}个项目</span>
            </div>
            <div class="exercise-list">
              <div *ngFor="let exercise of day.exercises" 
                   class="exercise-item"
                   [class]="exercise.intensity">
                <div class="exercise-info">
                  <span class="exercise-name">{{ exercise.name }}</span>
                  <span class="exercise-duration">{{ exercise.duration }}分钟</span>
                </div>
                <div class="exercise-details" *ngIf="showExerciseDetails(exercise)">
                  <span *ngIf="exercise.sets">{{ exercise.sets }}组</span>
                  <span *ngIf="exercise.reps">{{ exercise.reps }}次</span>
                  <span *ngIf="exercise.weight">{{ exercise.weight }}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 进度追踪 -->
      <section class="tracking-stats">
        <h3>本周进度</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">完成训练</div>
            <div class="stat-value">
              {{ plan?.tracking.actualProgress.completedSessions }}/
              {{ plan?.tracking.weeklyTarget.sessions }}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">运动时长</div>
            <div class="stat-value">
              {{ plan?.tracking.actualProgress.totalDuration }}/
              {{ plan?.tracking.weeklyTarget.totalDuration }}分钟
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">消耗热量</div>
            <div class="stat-value">
              {{ plan?.tracking.actualProgress.caloriesBurned }}/
              {{ plan?.tracking.weeklyTarget.caloriesBurn }}千卡
            </div>
          </div>
        </div>
      </section>

      <!-- 注意事项 -->
      <section class="restrictions" *ngIf="plan?.restrictions.length">
        <h3>运动注意事项</h3>
        <div class="restriction-list">
          <div *ngFor="let restriction of plan.restrictions" 
               class="restriction-item">
            <div class="restriction-type">{{ restriction.type }}</div>
            <p class="restriction-desc">{{ restriction.description }}</p>
            <div class="alternatives">
              <span>建议替代:</span>
              <ul>
                <li *ngFor="let alt of restriction.alternatives">{{ alt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./exercise-plan.component.scss']
})
export class ExercisePlanComponent implements OnInit {
  plan: ExercisePlan;
  theme: Theme;
  loading = false;
  error: string;

  constructor(
    private personalizationService: PersonalizationService
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadPlan();
    } catch (error) {
      this.error = '无法加载运动计划';
      console.error('Exercise plan loading error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadPlan() {
    this.plan = await this.personalizationService.createExercisePlan(
      'current-user-id'
    );
  }

  getDayName(dayOfWeek: number): string {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dayOfWeek];
  }

  showExerciseDetails(exercise: any): boolean {
    return exercise.type === 'strength' && 
           (exercise.sets || exercise.reps || exercise.weight);
  }

  async updateProgress(exerciseId: string, completed: boolean) {
    try {
      await this.personalizationService.updatePlanProgress(
        this.plan.id,
        {
          // 更新进度逻辑
        }
      );
      await this.loadPlan(); // 重新加载计划
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }
} 