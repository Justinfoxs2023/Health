import {
  NutritionData,
  NutritionGoal,
  NutritionReport,
  NutritionAlert,
  UserProfile,
  HealthCondition,
} from '../types/nutrition.types';
import { CacheService } from '../cache/CacheService';
import { DatabaseService } from '../database/DatabaseService';
import { FoodNutritionDatabase } from './FoodNutritionDatabase';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

@inject
able()
export class NutritionAnalysisService {
  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
    @inject() private readonly cache: CacheService,
    @inject() private readonly db: DatabaseService,
    @inject() private readonly nutritionDb: FoodNutritionDatabase,
  ) {}

  /**
   * 追踪用户营养摄入
   */
  public async trackNutrition(
    userId: string,
    nutritionData: NutritionData,
  ): Promise<NutritionReport> {
    const timer = this.metrics.startTimer('nutrition_tracking');
    try {
      // 获取用户信息和健康状况
      const [userProfile, healthCondition] = await Promise.all([
        this.getUserProfile(userId),
        this.getHealthCondition(userId),
      ]);

      // 计算营养目标
      const nutritionGoal = await this.calculateNutritionGoal(userProfile, healthCondition);

      // 获取历史营养数据
      const historicalData = await this.getHistoricalNutritionData(userId);

      // 分析当前营养状况
      const analysis = await this.analyzeNutritionStatus(
        nutritionData,
        historicalData,
        nutritionGoal,
      );

      // 生成营养报告
      const report = await this.generateNutritionReport(analysis, nutritionGoal, healthCondition);

      // 检查营养警报
      const alerts = await this.checkNutritionAlerts(analysis, nutritionGoal);

      // 更新数据库
      await this.updateNutritionData(userId, nutritionData, analysis);

      // 更新缓存
      await this.updateNutritionCache(userId, analysis);

      this.metrics.increment('nutrition_tracking_success');
      return {
        ...report,
        alerts,
      };
    } catch (error) {
      this.logger.error('营养追踪失败', error as Error);
      this.metrics.increment('nutrition_tracking_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 获取用户档案
   */
  private async getUserProfile(userId: string): Promise<UserProfile> {
    const cacheKey = `user_profile_${userId}`;
    let profile = await this.cache.get(cacheKey);

    if (!profile) {
      profile = await this.db.getUserProfile(userId);
      await this.cache.set(cacheKey, profile, 3600); // 缓存1小时
    }

    return profile;
  }

  /**
   * 获取健康状况
   */
  private async getHealthCondition(userId: string): Promise<HealthCondition> {
    const cacheKey = `health_condition_${userId}`;
    let condition = await this.cache.get(cacheKey);

    if (!condition) {
      condition = await this.db.getHealthCondition(userId);
      await this.cache.set(cacheKey, condition, 3600); // 缓存1小时
    }

    return condition;
  }

  /**
   * 计算营养目标
   */
  private async calculateNutritionGoal(
    profile: UserProfile,
    condition: HealthCondition,
  ): Promise<NutritionGoal> {
    // 基础代谢率计算
    const bmr = this.calculateBMR(profile);

    // 活动水平调整
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);

    // 根据健康状况调整目标
    const adjustedGoal = this.adjustGoalForHealthCondition(tdee, condition);

    // 计算各营养素目标
    return {
      calories: adjustedGoal,
      protein: this.calculateProteinGoal(profile, condition),
      carbs: this.calculateCarbsGoal(profile, condition),
      fat: this.calculateFatGoal(profile, condition),
      vitamins: this.calculateVitaminGoals(condition),
      minerals: this.calculateMineralGoals(condition),
      fiber: this.calculateFiberGoal(condition),
      water: this.calculateWaterGoal(profile, condition),
    };
  }

  /**
   * 获取历史营养数据
   */
  private async getHistoricalNutritionData(userId: string): Promise<NutritionData[]> {
    const cacheKey = `nutrition_history_${userId}`;
    let history = await this.cache.get(cacheKey);

    if (!history) {
      history = await this.db.getNutritionHistory(userId, {
        limit: 30, // 获取最近30天的数据
        sort: { date: -1 },
      });
      await this.cache.set(cacheKey, history, 3600); // 缓存1小时
    }

    return history;
  }

  /**
   * 分析营养状况
   */
  private async analyzeNutritionStatus(
    currentData: NutritionData,
    historicalData: NutritionData[],
    goal: NutritionGoal,
  ): Promise<any> {
    // 计算当前营养素摄入比例
    const currentRatios = this.calculateNutrientRatios(currentData);

    // 分析营养素趋势
    const trends = this.analyzeNutrientTrends(historicalData);

    // 计算目标完成度
    const goalCompletion = this.calculateGoalCompletion(currentData, goal);

    // 识别营养不足和过量
    const imbalances = this.identifyNutrientImbalances(currentData, goal);

    // 分析营养素之间的相互作用
    const interactions = this.analyzeNutrientInteractions(currentData);

    return {
      currentRatios,
      trends,
      goalCompletion,
      imbalances,
      interactions,
    };
  }

  /**
   * 生成营养报告
   */
  private async generateNutritionReport(
    analysis: any,
    goal: NutritionGoal,
    condition: HealthCondition,
  ): Promise<NutritionReport> {
    // 生成总体评估
    const overview = this.generateOverview(analysis);

    // 生成详细分析
    const details = this.generateDetailedAnalysis(analysis, goal);

    // 生成改进建议
    const recommendations = this.generateRecommendations(analysis, condition);

    // 生成长期趋势分析
    const trends = this.generateTrendAnalysis(analysis.trends);

    return {
      overview,
      details,
      recommendations,
      trends,
      timestamp: new Date(),
    };
  }

  /**
   * 检查营养警报
   */
  private async checkNutritionAlerts(
    analysis: any,
    goal: NutritionGoal,
  ): Promise<NutritionAlert[]> {
    const alerts: NutritionAlert[] = [];

    // 检查营养素严重不足
    const deficiencies = this.checkNutrientDeficiencies(analysis, goal);
    alerts.push(...deficiencies);

    // 检查营养素过量
    const excesses = this.checkNutrientExcesses(analysis, goal);
    alerts.push(...excesses);

    // 检查营养素比例失衡
    const imbalances = this.checkNutrientImbalances(analysis);
    alerts.push(...imbalances);

    // 检查不良趋势
    const trendAlerts = this.checkNutrientTrends(analysis.trends);
    alerts.push(...trendAlerts);

    return alerts;
  }

  /**
   * 更新营养数据
   */
  private async updateNutritionData(
    userId: string,
    data: NutritionData,
    analysis: any,
  ): Promise<void> {
    await Promise.all([
      this.db.insertNutritionData(userId, {
        ...data,
        analysis,
        timestamp: new Date(),
      }),
      this.db.updateNutritionStats(userId, analysis),
    ]);
  }

  /**
   * 更新营养缓存
   */
  private async updateNutritionCache(userId: string, analysis: any): Promise<void> {
    const cacheKey = `nutrition_analysis_${userId}`;
    await this.cache.set(cacheKey, analysis, 3600); // 缓存1小时
  }

  // 辅助计算方法
  private calculateBMR(profile: UserProfile): number {
    // 使用Mifflin-St Jeor公式计算基础代谢率
    const { weight, height, age, gender } = profile;
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  private calculateTDEE(bmr: number, activityLevel: string): number {
    const activityFactors = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      extraActive: 1.9,
    };
    return bmr * activityFactors[activityLevel];
  }

  private calculateProteinGoal(profile: UserProfile, condition: HealthCondition): number {
    let proteinPerKg = 0.8; // 基础蛋白质需求

    // 根据活动水平调整
    if (profile.activityLevel === 'veryActive') proteinPerKg = 1.2;
    if (profile.activityLevel === 'extraActive') proteinPerKg = 1.6;

    // 根据健康状况调整
    if (condition.muscleBuilding) proteinPerKg = 2.0;
    if (condition.weightLoss) proteinPerKg = 1.5;

    return profile.weight * proteinPerKg;
  }

  private calculateCarbsGoal(profile: UserProfile, condition: HealthCondition): number {
    let carbsPercentage = 0.5; // 基础碳水化合物比例

    // 根据活动水平调整
    if (profile.activityLevel === 'veryActive') carbsPercentage = 0.6;
    if (profile.activityLevel === 'extraActive') carbsPercentage = 0.65;

    // 根据健康状况调整
    if (condition.diabetic) carbsPercentage = 0.4;
    if (condition.ketogenic) carbsPercentage = 0.05;

    return (
      (this.calculateTDEE(this.calculateBMR(profile), profile.activityLevel) * carbsPercentage) / 4
    );
  }

  private calculateFatGoal(profile: UserProfile, condition: HealthCondition): number {
    let fatPercentage = 0.3; // 基础脂肪比例

    // 根据健康状况调整
    if (condition.heartDisease) fatPercentage = 0.25;
    if (condition.ketogenic) fatPercentage = 0.75;

    return (
      (this.calculateTDEE(this.calculateBMR(profile), profile.activityLevel) * fatPercentage) / 9
    );
  }

  private calculateVitaminGoals(condition: HealthCondition): any {
    // 基础维生素需求
    const baseGoals = {
      vitaminA: 900, // mcg
      vitaminC: 90, // mg
      vitaminD: 15, // mcg
      vitaminE: 15, // mg
      vitaminK: 120, // mcg
      vitaminB12: 2.4, // mcg
      folate: 400, // mcg
    };

    // 根据健康状况调整
    if (condition.immuneDeficiency) {
      baseGoals.vitaminC *= 1.5;
      baseGoals.vitaminD *= 2;
    }

    return baseGoals;
  }

  private calculateMineralGoals(condition: HealthCondition): any {
    // 基础矿物质需求
    const baseGoals = {
      calcium: 1000, // mg
      iron: 18, // mg
      magnesium: 400, // mg
      zinc: 11, // mg
      potassium: 3500, // mg
      sodium: 2300, // mg
    };

    // 根据健康状况调整
    if (condition.osteoporosis) {
      baseGoals.calcium = 1200;
      baseGoals.vitaminD = 20;
    }

    if (condition.anemia) {
      baseGoals.iron *= 1.5;
    }

    return baseGoals;
  }

  private calculateFiberGoal(condition: HealthCondition): number {
    let fiberGoal = 25; // 基础膳食纤维需求

    // 根据健康状况调整
    if (condition.digestiveIssues) fiberGoal = 30;
    if (condition.diabetic) fiberGoal = 35;

    return fiberGoal;
  }

  private calculateWaterGoal(profile: UserProfile, condition: HealthCondition): number {
    // 基础水分需求（毫升）
    let waterGoal = profile.weight * 30;

    // 根据活动水平调整
    if (profile.activityLevel === 'veryActive') waterGoal *= 1.2;
    if (profile.activityLevel === 'extraActive') waterGoal *= 1.4;

    // 根据健康状况调整
    if (condition.kidneyDisease) waterGoal *= 0.8;
    if (condition.heartDisease) waterGoal *= 0.9;

    return waterGoal;
  }
}
