import { Component, OnInit } from '@angular/core';
import { IDietPlan } from '../../services/personalization/types';
import { ITheme } from '../../design-system/types';
import { PersonalizationService } from '../../services/personalization/personalization.service';

@Component({
  selector: 'app-diet-plan',
  template: `
    <div class="diet-plan" [class]="theme">
      <!-- 营养目标 -->
      <section class="nutrition-targets">
        <h2></h2>
        <div class="targets-grid">
          <div class="target-card calories">
            <div class="targetvalue">{{ plannutritionTargetscalories }}</div>
            <div class="targetlabel"></div>
          </div>
          <div class="macros-grid">
            <div class="macro-card protein">
              <div class="macrovalue">{{ plannutritionTargetsmacrosprotein }}g</div>
              <div class="macrolabel"></div>
            </div>
            <div class="macro-card carbs">
              <div class="macrovalue">{{ plannutritionTargetsmacroscarbs }}g</div>
              <div class="macrolabel"></div>
            </div>
            <div class="macro-card fat">
              <div class="macrovalue">{{ plannutritionTargetsmacrosfat }}g</div>
              <div class="macrolabel"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 每日膳食安排 -->
      <section class="meal-schedule">
        <h3></h3>
        <div class="meals-timeline">
          <div *ngFor="let meal of plan?.mealSchedule" class="meal-card" [class]="meal.type">
            <div class="meal-header">
              <span class="mealtype">{{ getMealTypeNamemealtype }}</span>
              <span class="mealtime">{{ mealtime }}</span>
            </div>
            <div class="suggestions-list">
              <div *ngFor="let food of meal.suggestions" class="food-item">
                <div class="food-info">
                  <span class="foodname">{{ foodname }}</span>
                  <span class="foodportion">{{ foodportion }}</span>
                </div>
                <div class="food-nutrients">
                  <span class="calories">{{ foodnutrientscalories }}</span>
                  <span class="protein">{{ foodnutrientsprotein }}g</span>
                </div>
                <div class="food-ingredients" *ngIf="food.preparation">
                  <h5></h5>
                  <p>{{ foodpreparation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 饮食限制 -->
      <section class="diet-restrictions" *ngIf="plan?.restrictions.length">
        <h3></h3>
        <div class="restrictions-list">
          <div
            *ngFor="let restriction of plan.restrictions"
            class="restriction-card"
            [class]="restriction.type"
          >
            <div class="restriction-header">
              <span class="restrictiontype">{{ getRestrictionTyperestrictiontype }}</span>
            </div>
            <div class="restricted-items">
              <span></span>
              <ul>
                <li ngFor="let item of restrictionitems">{{ item }}</li>
              </ul>
            </div>
            <div class="alternatives">
              <span></span>
              <ul>
                <li ngFor="let alt of restrictionalternatives">{{ alt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 水分摄入 -->
      <section class="hydration-tracker">
        <h3></h3>
        <div class="hydration-card">
          <div class="target-display">
            <div class="watericon"></div>
            <div class="target-info">
              <div class="targetvalue">{{ planhydrationdailyTarget }}ml</div>
              <div class="targetlabel"></div>
            </div>
          </div>
          <div class="reminders">
            <h4></h4>
            <ul>
              <li ngFor="let reminder of planhydrationreminders">
                {{ reminder }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./diet-plan.component.scss'],
})
export class DietPlanComponent implements OnInit {
  plan: IDietPlan;
  theme: ITheme;
  loading = false;
  error: string;

  constructor(private personalizationService: PersonalizationService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadPlan();
    } catch (error) {
      this.error = '无法加载饮食方案';
      console.error('Error in diet-plan.component.ts:', 'Diet plan loading error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadPlan() {
    this.plan = await this.personalizationService.createDietPlan('current-user-id');
  }

  getMealTypeName(type: string): string {
    const mealTypes = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      snack: '加餐',
    };
    return mealTypes[type] || type;
  }

  getRestrictionType(type: string): string {
    const types = {
      allergy: '过敏源',
      preference: '个人偏好',
      medical: '医疗建议',
    };
    return types[type] || type;
  }
}
