import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { MongoService } from '../database/mongo.service';
import { UserProfile, NutritionGoal, DietaryRestriction, NutritionRecommendation } from './types';

@Injectable()
export class NutritionRecommendationService {
  constructor(
    private readonly config: ConfigService,
    private readonly mongo: MongoService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 生成个性化营养建议
   */
  async generateRecommendations(
    userId: string,
    profile: UserProfile,
    goal: NutritionGoal,
    restrictions: DietaryRestriction[],
  ): Promise<NutritionRecommendation[]> {
    try {
      // 1. 获取用户历史数据
      const history = await this.getUserHistory(userId);

      // 2. 分析当前营养状况
      const nutritionStatus = await this.analyzeNutritionStatus(history);

      // 3. 考虑用户目标
      const goalBasedRecs = this.generateGoalBasedRecommendations(goal, nutritionStatus);

      // 4. 考虑饮食限制
      const adjustedRecs = this.adjustForRestrictions(goalBasedRecs, restrictions);

      // 5. 个性化调整
      const personalizedRecs = this.personalizeRecommendations(adjustedRecs, profile);

      // 6. 保存建议记录
      await this.saveRecommendations(userId, personalizedRecs);

      return personalizedRecs;
    } catch (error) {
      this.logger.error('Failed to generate nutrition recommendations', { error, userId });
      throw error;
    }
  }

  /**
   * 生成智能食谱推荐
   */
  async generateMealPlan(userId: string, days: number, preferences: any): Promise<any> {
    try {
      // 1. 获取用户信息
      const userProfile = await this.getUserProfile(userId);
      const restrictions = await this.getUserRestrictions(userId);

      // 2. 计算每日营养需求
      const dailyNeeds = this.calculateDailyNutrients(userProfile);

      // 3. 获取可用食物列表
      const availableFoods = await this.getAvailableFoods(restrictions);

      // 4. 生成食谱组合
      const mealPlan = this.generateMealCombinations(days, dailyNeeds, availableFoods, preferences);

      // 5. 优化食谱
      const optimizedPlan = this.optimizeMealPlan(mealPlan);

      // 6. 保存食谱计划
      await this.saveMealPlan(userId, optimizedPlan);

      return optimizedPlan;
    } catch (error) {
      this.logger.error('Failed to generate meal plan', { error, userId });
      throw error;
    }
  }

  private async getUserHistory(userId: string): Promise<any> {
    const history = await this.mongo
      .collection('meal_records')
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(30)
      .toArray();

    return history;
  }

  private async analyzeNutritionStatus(history: any[]): Promise<any> {
    // 1. 计算平均营养摄入
    const averageIntake = this.calculateAverageIntake(history);

    // 2. 分析营养趋势
    const trends = this.analyzeNutritionTrends(history);

    // 3. 识别营养不足
    const deficiencies = this.identifyDeficiencies(averageIntake);

    // 4. 识别营养过剩
    const excesses = this.identifyExcesses(averageIntake);

    return {
      averageIntake,
      trends,
      deficiencies,
      excesses,
    };
  }

  private generateGoalBasedRecommendations(
    goal: NutritionGoal,
    status: any,
  ): NutritionRecommendation[] {
    const recommendations: NutritionRecommendation[] = [];

    switch (goal.type) {
      case 'weight_loss':
        recommendations.push(
          {
            type: 'calorie_control',
            priority: 'high',
            message: '控制每日热量摄入，建议在基础代谢率基础上减少300-500卡路里',
            actionItems: ['选择低热量、高饱腹感的食物', '控制碳水化合物的摄入', '增加蛋白质的比例'],
          },
          {
            type: 'meal_timing',
            priority: 'medium',
            message: '合理安排用餐时间，避免夜间进食',
            actionItems: ['保持规律的三餐时间', '晚餐建议在睡前3小时完成', '避免夜间零食'],
          },
        );
        break;

      case 'muscle_gain':
        recommendations.push(
          {
            type: 'protein_intake',
            priority: 'high',
            message: '增加优质蛋白质的摄入，建议达到每公斤体重2.0-2.2克',
            actionItems: [
              '增加瘦肉、鱼、蛋、奶制品的摄入',
              '训练后及时补充蛋白质',
              '合理分配一日蛋白质摄入量',
            ],
          },
          {
            type: 'meal_frequency',
            priority: 'medium',
            message: '增加餐次，确保肌肉持续获得营养',
            actionItems: ['每3-4小时进食一次', '训练前后都要进食', '睡前可以适当补充酪蛋白'],
          },
        );
        break;

      case 'health_maintenance':
        recommendations.push(
          {
            type: 'balanced_diet',
            priority: 'high',
            message: '保持均衡的营养摄入，确保各类营养素充足',
            actionItems: [
              '每餐包含主食、蛋白质、蔬菜',
              '注意补充优质脂肪',
              '保证充足的膳食纤维摄入',
            ],
          },
          {
            type: 'variety',
            priority: 'medium',
            message: '注意饮食多样性，轮换不同食材',
            actionItems: ['选择不同颜色的蔬菜水果', '尝试不同种类的主食', '变换蛋白质来源'],
          },
        );
        break;
    }

    // 根据营养状况添加特定建议
    if (status.deficiencies.length > 0) {
      recommendations.push({
        type: 'deficiency_correction',
        priority: 'high',
        message: '注意补充以下营养素：' + status.deficiencies.join(', '),
        actionItems: status.deficiencies.map(d => `增加${d}的食物来源`),
      });
    }

    return recommendations;
  }

  private adjustForRestrictions(
    recommendations: NutritionRecommendation[],
    restrictions: DietaryRestriction[],
  ): NutritionRecommendation[] {
    const adjustedRecs = [...recommendations];

    restrictions.forEach(restriction => {
      switch (restriction.type) {
        case 'allergy':
          adjustedRecs.push({
            type: 'allergy_warning',
            priority: 'high',
            message: `注意避免${restriction.foods.join(', ')}`,
            actionItems: ['仔细阅读食品标签', '在外用餐时提前告知服务员', '准备替代食材'],
          });
          break;

        case 'vegetarian':
          // 调整蛋白质来源建议
          const proteinRecIndex = adjustedRecs.findIndex(r => r.type === 'protein_intake');
          if (proteinRecIndex >= 0) {
            adjustedRecs[proteinRecIndex].actionItems = [
              '增加豆制品、坚果的摄入',
              '注意补充植物性蛋白',
              '可以考虑添加蛋白粉补充',
            ];
          }
          break;

        case 'religious':
          adjustedRecs.push({
            type: 'religious_restriction',
            priority: 'high',
            message: `遵循${restriction.details}的饮食要求`,
            actionItems: ['选择符合要求的食材', '注意食材的加工方式', '准备替代方案'],
          });
          break;
      }
    });

    return adjustedRecs;
  }

  private personalizeRecommendations(
    recommendations: NutritionRecommendation[],
    profile: UserProfile,
  ): NutritionRecommendation[] {
    const personalizedRecs = [...recommendations];

    // 根据年龄调整
    if (profile.age > 60) {
      personalizedRecs.push({
        type: 'age_specific',
        priority: 'medium',
        message: '注意适合老年人的饮食建议',
        actionItems: ['选择易消化的食物', '注意补充钙质', '控制盐分摄入'],
      });
    }

    // 根据活动水平调整
    if (profile.activityLevel === 'high') {
      personalizedRecs.push({
        type: 'activity_level',
        priority: 'medium',
        message: '针对高强度活动的营养建议',
        actionItems: ['增加碳水化合物摄入', '注意补充电解质', '保证充足的能量摄入'],
      });
    }

    // 根据健康状况调整
    if (profile.healthConditions?.length > 0) {
      profile.healthConditions.forEach(condition => {
        personalizedRecs.push({
          type: 'health_condition',
          priority: 'high',
          message: `针对${condition}的饮食建议`,
          actionItems: this.getHealthConditionRecommendations(condition),
        });
      });
    }

    return personalizedRecs;
  }

  private calculateAverageIntake(history: any[]): any {
    // TODO: 实现平均营养摄入计算
    return {};
  }

  private analyzeNutritionTrends(history: any[]): any {
    // TODO: 实现营养趋势分析
    return {};
  }

  private identifyDeficiencies(averageIntake: any): string[] {
    // TODO: 实现营养不足识别
    return [];
  }

  private identifyExcesses(averageIntake: any): string[] {
    // TODO: 实现营养过剩识别
    return [];
  }

  private async getUserProfile(userId: string): Promise<UserProfile> {
    // TODO: 实现用户档案获取
    return {} as UserProfile;
  }

  private async getUserRestrictions(userId: string): Promise<DietaryRestriction[]> {
    // TODO: 实现用户饮食限制获取
    return [];
  }

  private calculateDailyNutrients(profile: UserProfile): any {
    // TODO: 实现每日营养需求计算
    return {};
  }

  private async getAvailableFoods(restrictions: DietaryRestriction[]): Promise<any[]> {
    // TODO: 实现可用食物列表获取
    return [];
  }

  private generateMealCombinations(
    days: number,
    dailyNeeds: any,
    availableFoods: any[],
    preferences: any,
  ): any {
    // TODO: 实现食谱组合生成
    return {};
  }

  private optimizeMealPlan(mealPlan: any): any {
    // TODO: 实现食谱优化
    return {};
  }

  private async saveMealPlan(userId: string, mealPlan: any): Promise<void> {
    // TODO: 实现食谱计划保存
  }

  private async saveRecommendations(
    userId: string,
    recommendations: NutritionRecommendation[],
  ): Promise<void> {
    await this.mongo.collection('nutrition_recommendations').insertOne({
      user_id: userId,
      recommendations,
      created_at: new Date(),
    });
  }

  private getHealthConditionRecommendations(condition: string): string[] {
    switch (condition) {
      case 'diabetes':
        return ['控制碳水化合物摄入', '选择低血糖指数的食物', '规律进食，避免血糖波动'];
      case 'hypertension':
        return ['限制钠的摄入', '增加钾的摄入', '选择富含镁的食物'];
      case 'heart_disease':
        return ['限制饱和脂肪摄入', '增加omega-3脂肪酸', '控制钠的摄入'];
      default:
        return ['请咨询医生获取具体的饮食建议'];
    }
  }
}
