import { FoodItem, NutritionAnalysis } from './types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NutritionCalculator {
  /**
   * 计算总营养成分
   */
  calculateTotalNutrients(foodItems: FoodItem[]): NutritionAnalysis['totalNutrients'] {
    const total = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
    };

    foodItems.forEach(item => {
      const multiplier = item.quantity / 100; // 假设营养成分是按100g计算的
      total.calories += item.nutrients.protein * multiplier;
      total.protein += item.nutrients.protein * multiplier;
      total.fat += item.nutrients.fat * multiplier;
      total.carbs += item.nutrients.carbs * multiplier;
      total.fiber += (item.nutrients.fiber || 0) * multiplier;
      total.sugar += (item.nutrients.sugar || 0) * multiplier;
      total.sodium += (item.nutrients.sodium || 0) * multiplier;
      total.cholesterol += (item.nutrients.cholesterol || 0) * multiplier;
    });

    return total;
  }

  /**
   * 计算营养均衡分析
   */
  calculateBalanceAnalysis(
    nutrients: NutritionAnalysis['totalNutrients'],
  ): NutritionAnalysis['balanceAnalysis'] {
    const totalCalories = nutrients.calories;
    const caloriesFromProtein = nutrients.protein * 4;
    const caloriesFromFat = nutrients.fat * 9;
    const caloriesFromCarbs = nutrients.carbs * 4;

    return {
      proteinRatio: caloriesFromProtein / totalCalories,
      fatRatio: caloriesFromFat / totalCalories,
      carbsRatio: caloriesFromCarbs / totalCalories,
      fiberAdequacy: this.calculateFiberAdequacy(nutrients.fiber),
      vitaminAdequacy: 0, // TODO: 实现维生素充足度计算
      mineralAdequacy: 0, // TODO: 实现矿物质充足度计算
    };
  }

  /**
   * 计算营养评分
   */
  calculateNutritionScore(
    nutrients: NutritionAnalysis['totalNutrients'],
    balanceAnalysis: NutritionAnalysis['balanceAnalysis'],
  ): number {
    let score = 100;

    // 1. 评估宏量营养素比例 (40分)
    score -= this.evaluateMacroRatios(balanceAnalysis) * 0.4;

    // 2. 评估总热量 (20分)
    score -= this.evaluateCalories(nutrients.calories) * 0.2;

    // 3. 评估微量营养素 (20分)
    score -= this.evaluateMicronutrients(nutrients) * 0.2;

    // 4. 评估其他营养素 (20分)
    score -= this.evaluateOtherNutrients(nutrients) * 0.2;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 生成营养警告
   */
  generateWarnings(
    nutrients: NutritionAnalysis['totalNutrients'],
    balanceAnalysis: NutritionAnalysis['balanceAnalysis'],
  ): NutritionAnalysis['warnings'] {
    const warnings: NutritionAnalysis['warnings'] = [];

    // 1. 检查热量
    if (nutrients.calories > 800) {
      warnings.push({
        type: 'calories',
        severity: 'high',
        message: '单餐热量过高，建议适当减少食物摄入量',
      });
    }

    // 2. 检查宏量营养素比例
    if (balanceAnalysis.proteinRatio < 0.1) {
      warnings.push({
        type: 'protein',
        severity: 'medium',
        message: '蛋白质摄入不足，建议增加优质蛋白的摄入',
      });
    }

    if (balanceAnalysis.fatRatio > 0.35) {
      warnings.push({
        type: 'fat',
        severity: 'high',
        message: '脂肪摄入过多，建议减少油脂的使用',
      });
    }

    // 3. 检查钠含量
    if (nutrients.sodium > 2000) {
      warnings.push({
        type: 'sodium',
        severity: 'high',
        message: '钠含量过高，建议减少盐的摄入',
      });
    }

    // 4. 检查膳食纤维
    if (nutrients.fiber < 10) {
      warnings.push({
        type: 'fiber',
        severity: 'low',
        message: '膳食纤维摄���不足，建议增加蔬菜水果的摄入',
      });
    }

    return warnings;
  }

  /**
   * 生成营养建议
   */
  generateRecommendations(
    nutrients: NutritionAnalysis['totalNutrients'],
    balanceAnalysis: NutritionAnalysis['balanceAnalysis'],
  ): string[] {
    const recommendations: string[] = [];

    // 1. 热量建议
    if (nutrients.calories < 500) {
      recommendations.push('当前餐食热量偏低，建议适当增加食物摄入量');
    } else if (nutrients.calories > 800) {
      recommendations.push(
        '当前餐食热量偏高，建议：\n- 减少主食份量\n- 选择低脂烹饪方式\n- 增加蔬菜比例',
      );
    }

    // 2. 宏量营养素建议
    if (balanceAnalysis.proteinRatio < 0.1) {
      recommendations.push(
        '蛋白质摄入不足，建议：\n- 增加瘦肉、鱼、蛋、豆制品的摄入\n- 每餐搭配优质蛋白',
      );
    }

    if (balanceAnalysis.fatRatio > 0.35) {
      recommendations.push(
        '脂肪摄入过多，建议：\n- 选择蒸、煮、炖等低脂烹饪方式\n- 减少油炸食品\n- 选择瘦肉',
      );
    }

    if (balanceAnalysis.carbsRatio < 0.5) {
      recommendations.push('碳水化合物摄入不足，建议：\n- 适当增加全谷物主食\n- 搭配薯类、豆类');
    }

    // 3. 膳食纤维建议
    if (nutrients.fiber < 10) {
      recommendations.push(
        '膳食纤维摄入不足，建议：\n- 增加蔬菜水果摄入\n- 选择全谷物食品\n- 适量食用坚果',
      );
    }

    // 4. 钠含量建议
    if (nutrients.sodium > 2000) {
      recommendations.push('钠含量过高，建议：\n- 减少盐的使用\n- 少吃加工食品\n- 选择新鲜食材');
    }

    return recommendations;
  }

  private calculateFiberAdequacy(fiber: number): number {
    const dailyRecommended = 25; // 每日推荐摄入量
    const mealRatio = 0.3; // 假设这一餐占每日的30%
    return Math.min(1, fiber / (dailyRecommended * mealRatio));
  }

  private evaluateMacroRatios(balanceAnalysis: NutritionAnalysis['balanceAnalysis']): number {
    let penalty = 0;

    // 蛋白质比例应该在10-20%
    if (balanceAnalysis.proteinRatio < 0.1) {
      penalty += (20 * (0.1 - balanceAnalysis.proteinRatio)) / 0.1;
    } else if (balanceAnalysis.proteinRatio > 0.2) {
      penalty += (10 * (balanceAnalysis.proteinRatio - 0.2)) / 0.1;
    }

    // 脂肪比例应该在20-35%
    if (balanceAnalysis.fatRatio < 0.2) {
      penalty += (15 * (0.2 - balanceAnalysis.fatRatio)) / 0.2;
    } else if (balanceAnalysis.fatRatio > 0.35) {
      penalty += (25 * (balanceAnalysis.fatRatio - 0.35)) / 0.15;
    }

    // 碳水化合物比例应该在50-65%
    if (balanceAnalysis.carbsRatio < 0.5) {
      penalty += (20 * (0.5 - balanceAnalysis.carbsRatio)) / 0.5;
    } else if (balanceAnalysis.carbsRatio > 0.65) {
      penalty += (15 * (balanceAnalysis.carbsRatio - 0.65)) / 0.15;
    }

    return Math.min(100, penalty);
  }

  private evaluateCalories(calories: number): number {
    // 假设一餐的理想热量在500-800卡路里之间
    if (calories < 500) {
      return (50 * (500 - calories)) / 500;
    } else if (calories > 800) {
      return (50 * (calories - 800)) / 400;
    }
    return 0;
  }

  private evaluateMicronutrients(nutrients: NutritionAnalysis['totalNutrients']): number {
    let penalty = 0;

    // 评估钠含量
    if (nutrients.sodium > 2000) {
      penalty += (50 * (nutrients.sodium - 2000)) / 1000;
    }

    // TODO: 评估维生素和矿物质

    return Math.min(100, penalty);
  }

  private evaluateOtherNutrients(nutrients: NutritionAnalysis['totalNutrients']): number {
    let penalty = 0;

    // 评估膳食纤维
    const mealFiberTarget = 8; // 假设一餐需要8g膳食纤维
    if (nutrients.fiber < mealFiberTarget) {
      penalty += (30 * (mealFiberTarget - nutrients.fiber)) / mealFiberTarget;
    }

    // 评估胆固醇
    if (nutrients.cholesterol > 300) {
      penalty += (40 * (nutrients.cholesterol - 300)) / 200;
    }

    // 评估糖分
    if (nutrients.sugar > 25) {
      penalty += (30 * (nutrients.sugar - 25)) / 15;
    }

    return Math.min(100, penalty);
  }
}
