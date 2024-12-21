import { Component, OnInit } from '@angular/core';
import { IExercisePlan } from '../../services/personalization/types';
import { ITheme } from '../../design-system/types';
import { PersonalizationService } from '../../services/personalization/personalization.service';

@Component({
  selector: 'app-exercise-plan',
  template: `
    <div class="exercise-plan" [class]="theme">
      <!-- 计划概览 -->
      <section class="plan-overview">
        <h2></h2>
        <div class="progress-card">
          <div class="progressbar" stylewidth="planprogress  0"></div>
          <div class="progresstext">{{ planprogress  0 }}</div>
        </div>
      </section>

      <!-- 本周计划 -->
      <section class="weekly-schedule">
        <h3></h3>
        <div class="schedule-grid">
          <div *ngFor="let day of plan?.schedule" class="day-card">
            <div class="day-header">
              <span class="dayname">{{ getDayNamedaydayOfWeek }}</span>
              <span class="exercisecount">{{ dayexerciseslength }}</span>
            </div>
            <div class="exercise-list">
              <div
                *ngFor="let exercise of day.exercises"
                class="exercise-item"
                [class]="exercise.intensity"
              >
                <div class="exercise-info">
                  <span class="exercisename">{{ exercisename }}</span>
                  <span class="exerciseduration">{{ exerciseduration }}</span>
                </div>
                <div class="exercise-details" *ngIf="showExerciseDetails(exercise)">
                  <span ngIf="exercisesets">{{ exercisesets }}</span>
                  <span ngIf="exercisereps">{{ exercisereps }}</span>
                  <span ngIf="exerciseweight">{{ exerciseweight }}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 进度追踪 -->
      <section class="tracking-stats">
        <h3></h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="statlabel"></div>
            <div class="statvalue">
              {{ plantrackingactualProgresscompletedSessions }}/
              {{ plantrackingweeklyTargetsessions }}
            </div>
          </div>
          <div class="stat-card">
            <div class="statlabel"></div>
            <div class="statvalue">
              {{ plantrackingactualProgresstotalDuration }}/
              {{ plantrackingweeklyTargettotalDuration }}
            </div>
          </div>
          <div class="stat-card">
            <div class="statlabel"></div>
            <div class="statvalue">
              {{ plantrackingactualProgresscaloriesBurned }}/
              {{ plantrackingweeklyTargetcaloriesBurn }}
            </div>
          </div>
        </div>
      </section>

      <!-- 注意事项 -->
      <section class="restrictions" *ngIf="plan?.restrictions.length">
        <h3></h3>
        <div class="restriction-list">
          <div *ngFor="let restriction of plan.restrictions" class="restriction-item">
            <div class="restrictiontype">{{ restrictiontype }}</div>
            <p class="restrictiondesc">{{ restrictiondescription }}</p>
            <div class="alternatives">
              <span></span>
              <ul>
                <li ngFor="let alt of restrictionalternatives">{{ alt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./exercise-plan.component.scss'],
})
export class ExercisePlanComponent implements OnInit {
  plan: IExercisePlan;
  theme: ITheme;
  loading = false;
  error: string;

  constructor(private personalizationService: PersonalizationService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadPlan();
    } catch (error) {
      this.error = '无法加载运动计划';
      console.error('Error in exercise-plan.component.ts:', 'Exercise plan loading error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadPlan() {
    this.plan = await this.personalizationService.createExercisePlan('current-user-id');
  }

  getDayName(dayOfWeek: number): string {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dayOfWeek];
  }

  showExerciseDetails(exercise: any): boolean {
    return exercise.type === 'strength' && (exercise.sets || exercise.reps || exercise.weight);
  }

  async updateProgress(exerciseId: string, completed: boolean) {
    try {
      await this.personalizationService.updatePlanProgress(this.plan.id, {
        // 更新进度逻辑
      });
      await this.loadPlan(); // 重新加载计划
    } catch (error) {
      console.error('Error in exercise-plan.component.ts:', 'Failed to update progress:', error);
    }
  }
}
