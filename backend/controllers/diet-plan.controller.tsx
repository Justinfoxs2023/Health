import { DietPlan } from '../models/diet-plan.model';
import { IAuthRequest } from '../types/models';
import { Recipe } from '../models/recipe.model';
import { Response } from 'express';
import { User } from '../models/user.model';

export class DietPlanController {
  /**
   * 生成饮食计划
   */
  public async generateDietPlan(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { goal, duration = 7 } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
        });
      }

      // 计算每日所需热量
      const dailyCalories = this.calculateDailyCalories(user);

      // 根据目标调整热量
      let targetCalories = dailyCalories;
      if (goal === '减重') {
        targetCalories = dailyCalories - 500; // 每天减少500卡路里
      } else if (goal === '增重') {
        targetCalories = dailyCalories + 500; // 每天增加500卡路里
      }

      // 计算营养素比例
      const nutritionRatio = this.calculateNutritionRatio(goal);
      const nutritionTargets = {
        protein: Math.round((targetCalories * nutritionRatio.protein) / 4), // 蛋白质4卡/克
        fat: Math.round((targetCalories * nutritionRatio.fat) / 9), // 脂肪9卡/克
        carbohydrates: Math.round((targetCalories * nutritionRatio.carbs) / 4), // 碳水4卡/克
        fiber: Math.round((targetCalories / 1000) * 14), // 每1000卡推荐14克膳食纤维
      };

      // 获取符合条件的食谱
      const recipes = await Recipe.find({
        'nutrition.calories': {
          $gte: targetCalories * 0.2, // 单餐热量不低于目标热量的20%
          $lte: targetCalories * 0.4, // 单餐热量不超过目标热量的40%
        },
      });

      // 生成每日饮食计划
      const weeklyPlan = [];
      for (let day = 1; day <= duration; day++) {
        const meals = [];
        let dailyCaloriesSum = 0;

        // 早餐 (25% 目标热量)
        const breakfast = this.selectMeal(
          recipes,
          targetCalories * 0.25,
          dailyCaloriesSum,
          user.profile.dietaryRestrictions,
        );
        if (breakfast) {
          meals.push({
            type: '早餐',
            recipe: breakfast._id,
            portions: 1,
          });
          dailyCaloriesSum += breakfast.nutrition.calories;
        }

        // 午餐 (35% 目标热量)
        const lunch = this.selectMeal(
          recipes,
          targetCalories * 0.35,
          dailyCaloriesSum,
          user.profile.dietaryRestrictions,
        );
        if (lunch) {
          meals.push({
            type: '午餐',
            recipe: lunch._id,
            portions: 1,
          });
          dailyCaloriesSum += lunch.nutrition.calories;
        }

        // 晚餐 (30% 目标热量)
        const dinner = this.selectMeal(
          recipes,
          targetCalories * 0.3,
          dailyCaloriesSum,
          user.profile.dietaryRestrictions,
        );
        if (dinner) {
          meals.push({
            type: '晚餐',
            recipe: dinner._id,
            portions: 1,
          });
          dailyCaloriesSum += dinner.nutrition.calories;
        }

        // 加餐 (10% 目标热量)
        const snack = this.selectMeal(
          recipes,
          targetCalories * 0.1,
          dailyCaloriesSum,
          user.profile.dietaryRestrictions,
        );
        if (snack) {
          meals.push({
            type: '加餐',
            recipe: snack._id,
            portions: 1,
          });
        }

        weeklyPlan.push({
          dayOfWeek: day,
          meals,
        });
      }

      // 创建饮食计划
      const dietPlan = new DietPlan({
        userId,
        name: `${goal}饮食计划`,
        goal,
        dailyCalorieTarget: targetCalories,
        nutritionTargets,
        weeklyPlan,
        restrictions: user.profile.dietaryRestrictions,
        startDate: new Date(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
        status: '进行中',
      });

      await dietPlan.save();

      res.status(201).json({
        success: true,
        data: dietPlan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误',
      });
    }
  }

  private calculateDailyCalories(user: any): number {
    // 基础代谢率计算 (Harris-Benedict公式)
    let bmr;
    if (user.profile.gender === '男') {
      bmr = 66 + 13.7 * user.profile.weight + 5 * user.profile.height - 6.8 * user.profile.age;
    } else {
      bmr = 655 + 9.6 * user.profile.weight + 1.8 * user.profile.height - 4.7 * user.profile.age;
    }

    // 活动系数
    const activityFactors = {
      久坐: 1.2,
      轻度活动: 1.375,
      中度活动: 1.55,
      重度活动: 1.725,
    };

    return Math.round(bmr * activityFactors[user.profile.activityLevel]);
  }

  private calculateNutritionRatio(goal: string): { protein: number; fat: number; carbs: number } {
    switch (goal) {
      case '增肌':
        return { protein: 0.3, fat: 0.2, carbs: 0.5 }; // 高蛋白
      case '减重':
        return { protein: 0.35, fat: 0.25, carbs: 0.4 }; // 低碳水
      case '维持体重':
      default:
        return { protein: 0.2, fat: 0.25, carbs: 0.55 }; // 均衡配比
    }
  }

  private selectMeal(
    recipes: any[],
    targetCalories: number,
    currentCalories: number,
    restrictions: string[],
  ): any {
    // 过滤出符合限制条件的食谱
    const availableRecipes = recipes.filter(recipe => {
      // 检查是否符合饮食限制
      if (restrictions?.length > 0) {
        const hasRestriction = recipe.ingredients.some((ingredient: any) =>
          restrictions.includes(ingredient.food.category),
        );
        if (hasRestriction) return false;
      }

      // 检查热量是否合适
      const calories = recipe.nutrition.calories;
      return calories >= targetCalories * 0.8 && calories <= targetCalories * 1.2;
    });

    // 随机选择一个食谱
    if (availableRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableRecipes.length);
      return availableRecipes[randomIndex];
    }

    return null;
  }
}

export const dietPlanController = new DietPlanController();
