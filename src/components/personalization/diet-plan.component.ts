import { Component, OnInit } from '@angular/core';
import { PersonalizationService } from '../../services/personalization/personalization.service';
import { DietPlan } from '../../services/personalization/types';
import { Theme } from '../../design-system/types';

@Component({
  selector: 'app-diet-plan',
  template: `
    <div class="diet-plan" [class]="theme">
      <!-- 营养目标 -->
      <section class="nutrition-targets">
        <h2>每日营养目标</h2>
        <div class="targets-grid">
          <div class="target-card calories">
            <div class="target-value">{{ plan?.nutritionTargets.calories }}千卡</div>
            <div class="target-label">总热量</div>
          </div>
          <div class="macros-grid">
            <div class="macro-card protein">
              <div class="macro-value">{{ plan?.nutritionTargets.macros.protein }}g</div>
              <div class="macro-label">蛋白质</div>
            </div>
            <div class="macro-card carbs">
              <div class="macro-value">{{ plan?.nutritionTargets.macros.carbs }}g</div>
              <div class="macro-label">碳水化合物</div>
            </div>
            <div class="macro-card fat">
              <div class="macro-value">{{ plan?.nutritionTargets.macros.fat }}g</div>
              <div class="macro-label">脂肪</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 每日膳食安排 -->
      <section class="meal-schedule">
        <h3>今日膳食安排</h3>
        <div class="meals-timeline">
          <div *ngFor="let meal of plan?.mealSchedule" 
               class="meal-card"
               [class]="meal.type">
            <div class="meal-header">
              <span class="meal-type">{{ getMealTypeName(meal.type) }}</span>
              <span class="meal-time">{{ meal.time }}</span>
            </div>
            <div class="suggestions-list">
              <div *ngFor="let food of meal.suggestions" class="food-item">
                <div class="food-info">
                  <span class="food-name">{{ food.name }}</span>
                  <span class="food-portion">{{ food.portion }}克</span>
                </div>
                <div class="food-nutrients">
                  <span class="calories">{{ food.nutrients.calories }}千卡</span>
                  <span class="protein">蛋白质{{ food.nutrients.protein }}g</span>
                </div>
                <div class="food-ingredients" *ngIf="food.preparation">
                  <h5>准备方法</h5>
                  <p>{{ food.preparation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 饮食限制 -->
      <section class="diet-restrictions" *ngIf="plan?.restrictions.length">
        <h3>饮食注意事项</h3>
        <div class="restrictions-list">
          <div *ngFor="let restriction of plan.restrictions" 
               class="restriction-card"
               [class]="restriction.type">
            <div class="restriction-header">
              <span class="restriction-type">{{ getRestrictionType(restriction.type) }}</span>
            </div>
            <div class="restricted-items">
              <span>需要避免:</span>
              <ul>
                <li *ngFor="let item of restriction.items">{{ item }}</li>
              </ul>
            </div>
            <div class="alternatives">
              <span>建议替代:</span>
              <ul>
                <li *ngFor="let alt of restriction.alternatives">{{ alt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 水分摄入 -->
      <section class="hydration-tracker">
        <h3>水分摄入</h3>
        <div class="hydration-card">
          <div class="target-display">
            <div class="water-icon">💧</div>
            <div class="target-info">
              <div class="target-value">{{ plan?.hydration.dailyTarget }}ml</div>
              <div class="target-label">每日目标</div>
            </div>
          </div>
          <div class="reminders">
            <h4>温馨提示</h4>
            <ul>
              <li *ngFor="let reminder of plan?.hydration.reminders">
                {{ reminder }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./diet-plan.component.scss']
})
export class DietPlanComponent implements OnInit {
  plan: DietPlan;
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
      this.error = '无法加载饮食方案';
      console.error('Diet plan loading error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadPlan() {
    this.plan = await this.personalizationService.createDietPlan(
      'current-user-id'
    );
  }

  getMealTypeName(type: string): string {
    const mealTypes = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      snack: '加餐'
    };
    return mealTypes[type] || type;
  }

  getRestrictionType(type: string): string {
    const types = {
      allergy: '过敏源',
      preference: '个人偏好',
      medical: '医疗建议'
    };
    return types[type] || type;
  }
} 