import { AnalysisService } from '../analysis/AnalysisService';
import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IUserProfile {
  /** id 的描述 */
    id: string;
  /** preferences 的描述 */
    preferences: {
    healthGoals: string;
    dietaryRestrictions: string;
    exercisePreferences: string;
    sleepSchedule: {
      bedtime: string;
      wakeTime: string;
    };
    [key: string]: any;
  };
  /** healthData 的描述 */
    healthData: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    medicalConditions: string[];
    medications: string[];
    allergies: string[];
    [key: string]: any;
  };
  /** activityHistory 的描述 */
    activityHistory: {
    exercises: Array<{
      type: string;
      duration: number;
      intensity: string;
      timestamp: Date;
    }>;
    meals: Array<{
      type: string;
      foods: string[];
      nutrients: Record<string, number>;
      timestamp: Date;
    }>;
    sleep: Array<{
      duration: number;
      quality: number;
      startTime: Date;
      endTime: Date;
    }>;
    [key: string]: any;
  };
  /** updatedAt 的描述 */
    updatedAt: Date;
}

export interface IRecommendationItem {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: exercise  diet  lifestyle  tcm  health_check;
  category: string;
  title: string;
  description: string;
  priority: number;
  confidence: number;
  reasons: string;
  suggestedActions: Array{
    type: string;
    title: string;
    description: string;
    duration: number;
    frequency: string;
    intensity: string;
    key: string: any;
  }>;
  metadata: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export interface IHealthAssistantResponse {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** query 的描述 */
    query: string;
  /** response 的描述 */
    response: {
    type: text  suggestion  alert  guidance;
    content: string;
    suggestions: string;
    actions: Array{
      type: string;
      title: string;
      description: string;
      key: string: any;
    }>;
  };
  metadata: Record<string, any>;
  createdAt: Date;
}

@injectable()
export class RecommendationService {
  private userProfiles: Map<string, IUserProfile> = new Map();
  private recommendations: Map<string, IRecommendationItem[]> = new Map();
  private assistantResponses: Map<string, IHealthAssistantResponse[]> = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private cacheManager: CacheManager,
    @inject() private analysisService: AnalysisService,
  ) {
    this.initializeData();
  }

  /**
   * 初始化数据
   */
  private async initializeData(): Promise<void> {
    try {
      const [cachedProfiles, cachedRecommendations, cachedResponses] = await Promise.all([
        this.cacheManager.get('recommendation:profiles'),
        this.cacheManager.get('recommendation:items'),
        this.cacheManager.get('recommendation:responses'),
      ]);

      if (cachedProfiles && cachedRecommendations && cachedResponses) {
        this.userProfiles = new Map(Object.entries(cachedProfiles));
        this.recommendations = new Map(Object.entries(cachedRecommendations));
        this.assistantResponses = new Map(Object.entries(cachedResponses));
      } else {
        await Promise.all([
          this.loadUserProfilesFromDB(),
          this.loadRecommendationsFromDB(),
          this.loadAssistantResponsesFromDB(),
        ]);
      }

      this.logger.info('推荐服务数据初始化成功');
    } catch (error) {
      this.logger.error('推荐服务数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 更新用户画像
   */
  public async updateUserProfile(
    userId: string,
    profileData: Partial<IUserProfile>,
  ): Promise<IUserProfile> {
    try {
      let profile = this.userProfiles.get(userId);
      if (!profile) {
        profile = {
          id: userId,
          preferences: {
            healthGoals: [],
            dietaryRestrictions: [],
            exercisePreferences: [],
            sleepSchedule: {
              bedtime: '22:00',
              wakeTime: '06:00',
            },
          },
          healthData: {
            age: 0,
            gender: '',
            height: 0,
            weight: 0,
            medicalConditions: [],
            medications: [],
            allergies: [],
          },
          activityHistory: {
            exercises: [],
            meals: [],
            sleep: [],
          },
          updatedAt: new Date(),
        };
      }

      // 深度合并更新数据
      profile = this.mergeProfileData(profile, profileData);
      profile.updatedAt = new Date();

      await this.saveUserProfile(profile);

      // 触发推荐更新
      await this.generateRecommendations(userId);

      return profile;
    } catch (error) {
      this.logger.error('更新用户画像失败', error);
      throw error;
    }
  }

  /**
   * 生成个性化推荐
   */
  public async generateRecommendations(userId: string): Promise<IRecommendationItem[]> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        throw new Error('用户画像不存在');
      }

      const recommendations: IRecommendationItem[] = [];

      // 生成运动建议
      const exerciseRecommendations = await this.generateExerciseRecommendations(profile);
      recommendations.push(...exerciseRecommendations);

      // 生成饮食建议
      const dietRecommendations = await this.generateDietRecommendations(profile);
      recommendations.push(...dietRecommendations);

      // 生成生活方式建议
      const lifestyleRecommendations = await this.generateLifestyleRecommendations(profile);
      recommendations.push(...lifestyleRecommendations);

      // 生成中医养生建议
      const tcmRecommendations = await this.generateTCMRecommendations(profile);
      recommendations.push(...tcmRecommendations);

      // 生成健康检查建议
      const healthCheckRecommendations = await this.generateHealthCheckRecommendations(profile);
      recommendations.push(...healthCheckRecommendations);

      // 保存推荐结果
      await this.saveRecommendations(userId, recommendations);

      return recommendations;
    } catch (error) {
      this.logger.error('生成推荐失败', error);
      throw error;
    }
  }

  /**
   * 获取健康助手回应
   */
  public async getHealthAssistantResponse(
    userId: string,
    query: string,
  ): Promise<IHealthAssistantResponse> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        throw new Error('用户画像不存在');
      }

      // 分析用户查询
      const analysisResult = await this.analysisService.analyzeHealthQuery(query, profile);

      // 生成回应
      const response: IHealthAssistantResponse = {
        id: Date.now().toString(),
        userId,
        query,
        response: {
          type: 'text',
          content: '',
          suggestions: [],
          actions: [],
        },
        metadata: {},
        createdAt: new Date(),
      };

      // 根据分析结果生成回应内容
      switch (analysisResult.type) {
        case 'health_inquiry':
          response.response = await this.generateHealthInquiryResponse(analysisResult, profile);
          break;
        case 'lifestyle_advice':
          response.response = await this.generateLifestyleAdviceResponse(analysisResult, profile);
          break;
        case 'emergency_guidance':
          response.response = await this.generateEmergencyGuidanceResponse(analysisResult, profile);
          break;
        case 'general_question':
          response.response = await this.generateGeneralResponse(analysisResult, profile);
          break;
        default:
          throw new Error(`不支持的查询类型: ${analysisResult.type}`);
      }

      // 保存回应记录
      await this.saveAssistantResponse(response);

      return response;
    } catch (error) {
      this.logger.error('获取健康助手回应失败', error);
      throw error;
    }
  }

  /**
   * 生成运动建议
   */
  private async generateExerciseRecommendations(
    profile: IUserProfile,
  ): Promise<IRecommendationItem[]> {
    const recommendations: IRecommendationItem[] = [];

    // 分析用户运动历史
    const exerciseHistory = profile.activityHistory.exercises;
    const recentExercises = exerciseHistory.filter(
      e => new Date().getTime() - e.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000,
    );

    // 根据用户偏好和历史生成建议
    const exerciseTypes = new Set(profile.preferences.exercisePreferences);
    const exerciseIntensities = this.calculateExerciseIntensities(recentExercises);

    // 添加运动建议
    recommendations.push({
      id: Date.now().toString(),
      userId: profile.id,
      type: 'exercise',
      category: 'daily_exercise',
      title: '每日运动建议',
      description: '根据您的运动习惯和健康目标制定的运动计划',
      priority: 1,
      confidence: 0.85,
      reasons: ['保持规律运动有助于提升身体素质', '符合您的运动偏好和强度要求'],
      suggestedActions: [
        {
          type: 'exercise',
          title: '有氧运动',
          description: '进行30分钟中等强度的有氧运动',
          duration: 30,
          frequency: 'daily',
          intensity: 'moderate',
        },
      ],
      metadata: {
        exerciseTypes: Array.from(exerciseTypes),
        intensities: exerciseIntensities,
      },
      createdAt: new Date(),
    });

    return recommendations;
  }

  /**
   * 生成饮食建议
   */
  private async generateDietRecommendations(profile: IUserProfile): Promise<IRecommendationItem[]> {
    const recommendations: IRecommendationItem[] = [];

    // 分析用户饮食历史
    const mealHistory = profile.activityHistory.meals;
    const recentMeals = mealHistory.filter(
      m => new Date().getTime() - m.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000,
    );

    // 分析营养摄入
    const nutritionAnalysis = this.analyzeNutritionIntake(recentMeals);

    // 添加饮食建议
    recommendations.push({
      id: Date.now().toString(),
      userId: profile.id,
      type: 'diet',
      category: 'nutrition_balance',
      title: '营养均衡建议',
      description: '根据您的饮食习惯和营养需求制定的膳食计划',
      priority: 1,
      confidence: 0.9,
      reasons: ['确保营养均衡摄入', '符合您的饮食限制要求'],
      suggestedActions: [
        {
          type: 'diet',
          title: '增加蛋白质摄入',
          description: '建议每天摄入适量的优质蛋白',
          frequency: 'daily',
        },
      ],
      metadata: {
        nutritionAnalysis,
      },
      createdAt: new Date(),
    });

    return recommendations;
  }

  /**
   * 生成生活方式建议
   */
  private async generateLifestyleRecommendations(
    profile: IUserProfile,
  ): Promise<IRecommendationItem[]> {
    const recommendations: IRecommendationItem[] = [];

    // 分析睡眠情况
    const sleepHistory = profile.activityHistory.sleep;
    const recentSleep = sleepHistory.filter(
      s => new Date().getTime() - s.startTime.getTime() <= 7 * 24 * 60 * 60 * 1000,
    );

    const sleepAnalysis = this.analyzeSleepPatterns(recentSleep);

    // 添加生活方式建议
    recommendations.push({
      id: Date.now().toString(),
      userId: profile.id,
      type: 'lifestyle',
      category: 'sleep_improvement',
      title: '睡眠质量改善建议',
      description: '根据您的作息规律提供的睡眠改善建议',
      priority: 2,
      confidence: 0.8,
      reasons: ['良好的睡眠质量对健康至关重要', '帮助调整作息规律'],
      suggestedActions: [
        {
          type: 'lifestyle',
          title: '优化睡眠环境',
          description: '保持安静、黑暗的睡眠环境',
          frequency: 'daily',
        },
      ],
      metadata: {
        sleepAnalysis,
      },
      createdAt: new Date(),
    });

    return recommendations;
  }

  /**
   * 生成中医养生建议
   */
  private async generateTCMRecommendations(profile: IUserProfile): Promise<IRecommendationItem[]> {
    const recommendations: IRecommendationItem[] = [];

    // 分析体质特征
    const constitutionAnalysis = await this.analyzeTCMConstitution(profile);

    // 添加中医养生建议
    recommendations.push({
      id: Date.now().toString(),
      userId: profile.id,
      type: 'tcm',
      category: 'constitution_care',
      title: '体质调养建议',
      description: '根据您的体质特征提供的养生保健建议',
      priority: 2,
      confidence: 0.75,
      reasons: ['根据体质特征进行调养', '结合节气特点提供建议'],
      suggestedActions: [
        {
          type: 'tcm',
          title: '穴位按摩',
          description: '每日按摩足三里穴位3-5分钟',
          duration: 5,
          frequency: 'daily',
        },
      ],
      metadata: {
        constitutionAnalysis,
      },
      createdAt: new Date(),
    });

    return recommendations;
  }

  /**
   * 生成健康检查建议
   */
  private async generateHealthCheckRecommendations(
    profile: IUserProfile,
  ): Promise<IRecommendationItem[]> {
    const recommendations: IRecommendationItem[] = [];

    // 分析健康风险
    const healthRiskAnalysis = await this.analyzeHealthRisks(profile);

    // 添加健康检查建议
    recommendations.push({
      id: Date.now().toString(),
      userId: profile.id,
      type: 'health_check',
      category: 'regular_checkup',
      title: '定期体检建议',
      description: '根据您的健康状况提供的体检建议',
      priority: 3,
      confidence: 0.85,
      reasons: ['预防潜在健康风险', '及时发现健康问题'],
      suggestedActions: [
        {
          type: 'health_check',
          title: '常规体检',
          description: '建议进行年度体检',
          frequency: 'yearly',
        },
      ],
      metadata: {
        healthRiskAnalysis,
      },
      createdAt: new Date(),
    });

    return recommendations;
  }

  /**
   * 生成健康咨询回应
   */
  private async generateHealthInquiryResponse(
    analysis: any,
    profile: IUserProfile,
  ): Promise<IHealthAssistantResponse['response']> {
    return {
      type: 'text',
      content: '根据您的健康状况，建议...',
      suggestions: ['保持规律作息', '注意营养均衡', '适量运动'],
      actions: [
        {
          type: 'schedule',
          title: '预约专���咨询',
          description: '可以预约专家进行详细咨询',
        },
      ],
    };
  }

  /**
   * 生成生活方式建议回应
   */
  private async generateLifestyleAdviceResponse(
    analysis: any,
    profile: IUserProfile,
  ): Promise<IHealthAssistantResponse['response']> {
    return {
      type: 'suggestion',
      content: '为了改善生活质量，建议您...',
      suggestions: ['早睡早起', '规律运动', '健康饮食'],
      actions: [
        {
          type: 'track',
          title: '记录生活习惯',
          description: '开始记录您的日常生活习惯',
        },
      ],
    };
  }

  /**
   * 生成紧急指导回应
   */
  private async generateEmergencyGuidanceResponse(
    analysis: any,
    profile: IUserProfile,
  ): Promise<IHealthAssistantResponse['response']> {
    return {
      type: 'alert',
      content: '请立即采取以下措施...',
      suggestions: ['保持冷静', '寻求医疗帮助', '记录症状'],
      actions: [
        {
          type: 'emergency',
          title: '拨打急救电话',
          description: '如果情况严重，请立即就医',
        },
      ],
    };
  }

  /**
   * 生成一般问题回应
   */
  private async generateGeneralResponse(
    analysis: any,
    profile: IUserProfile,
  ): Promise<IHealthAssistantResponse['response']> {
    return {
      type: 'text',
      content: '您可以参考以下信息...',
      suggestions: ['了解更多健康知识', '养成良好习惯', '定期体检'],
      actions: [
        {
          type: 'learn',
          title: '浏览健康文章',
          description: '查看相关的健康知识文章',
        },
      ],
    };
  }

  /**
   * 分析运动强度
   */
  private calculateExerciseIntensities(
    exercises: IUserProfile['activityHistory']['exercises'],
  ): Record<string, number> {
    const intensities: Record<string, number> = {
      low: 0,
      moderate: 0,
      high: 0,
    };

    exercises.forEach(exercise => {
      intensities[exercise.intensity.toLowerCase()]++;
    });

    return intensities;
  }

  /**
   * 分析营养摄入
   */
  private analyzeNutritionIntake(
    meals: IUserProfile['activityHistory']['meals'],
  ): Record<string, number> {
    const nutrition: Record<string, number> = {};

    meals.forEach(meal => {
      Object.entries(meal.nutrients).forEach(([nutrient, amount]) => {
        nutrition[nutrient] = (nutrition[nutrient] || 0) + amount;
      });
    });

    return nutrition;
  }

  /**
   * 分析睡���模式
   */
  private analyzeSleepPatterns(
    sleepRecords: IUserProfile['activityHistory']['sleep'],
  ): Record<string, any> {
    const analysis = {
      averageDuration: 0,
      averageQuality: 0,
      regularityScore: 0,
    };

    if (sleepRecords.length === 0) {
      return analysis;
    }

    // 计算平均值
    analysis.averageDuration =
      sleepRecords.reduce((sum, record) => sum + record.duration, 0) / sleepRecords.length;
    analysis.averageQuality =
      sleepRecords.reduce((sum, record) => sum + record.quality, 0) / sleepRecords.length;

    // 计算规律性得分
    const startTimes = sleepRecords.map(
      record => record.startTime.getHours() * 60 + record.startTime.getMinutes(),
    );
    const timeVariance = this.calculateVariance(startTimes);
    analysis.regularityScore = Math.max(0, 1 - timeVariance / (4 * 60)); // 4小时作为最大方差

    return analysis;
  }

  /**
   * 分析中医体质
   */
  private async analyzeTCMConstitution(profile: IUserProfile): Promise<Record<string, any>> {
    // 实现中医体质分析逻辑
    return {};
  }

  /**
   * 分析健康风险
   */
  private async analyzeHealthRisks(profile: IUserProfile): Promise<Record<string, any>> {
    // 实现健康风险分析逻辑
    return {};
  }

  /**
   * 计算方差
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  /**
   * 合并用户画像数据
   */
  private mergeProfileData(target: IUserProfile, source: Partial<IUserProfile>): IUserProfile {
    return {
      ...target,
      ...source,
      preferences: {
        ...target.preferences,
        ...source.preferences,
      },
      healthData: {
        ...target.healthData,
        ...source.healthData,
      },
      activityHistory: {
        ...target.activityHistory,
        ...source.activityHistory,
      },
    };
  }

  /**
   * 获取用户画像
   */
  public async getUserProfile(userId: string): Promise<IUserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  /**
   * 获取用户推荐
   */
  public async getUserRecommendations(
    userId: string,
    filters?: {
      type?: IRecommendationItem['type'];
      category?: string;
      minConfidence?: number;
    },
  ): Promise<IRecommendationItem[]> {
    const recommendations = this.recommendations.get(userId) || [];
    return recommendations.filter(recommendation => {
      if (filters?.type && recommendation.type !== filters.type) {
        return false;
      }

      if (filters?.category && recommendation.category !== filters.category) {
        return false;
      }

      if (filters?.minConfidence && recommendation.confidence < filters.minConfidence) {
        return false;
      }

      return true;
    });
  }

  /**
   * 从数据库加载用户画像
   */
  private async loadUserProfilesFromDB(): Promise<void> {
    // 实现从数据库加载用户画像的逻辑
  }

  /**
   * 从数据库加载推荐数据
   */
  private async loadRecommendationsFromDB(): Promise<void> {
    // 实现从数据库加载推荐数据的逻辑
  }

  /**
   * 从数据库加载助手回应
   */
  private async loadAssistantResponsesFromDB(): Promise<void> {
    // 实现从数据库加载助手回应的逻辑
  }

  /**
   * 保存用户画像
   */
  private async saveUserProfile(profile: IUserProfile): Promise<void> {
    try {
      this.userProfiles.set(profile.id, profile);
      // 保存到数据库
      this.logger.info(`保存用户画像: ${profile.id}`);
    } catch (error) {
      this.logger.error('保存用户画像失败', error);
      throw error;
    }
  }

  /**
   * 保存推荐数据
   */
  private async saveRecommendations(
    userId: string,
    recommendations: IRecommendationItem[],
  ): Promise<void> {
    try {
      this.recommendations.set(userId, recommendations);
      // 保存到数据库
      this.logger.info(`保存用户推荐数据: ${userId}`);
    } catch (error) {
      this.logger.error('保存推荐数据失败', error);
      throw error;
    }
  }

  /**
   * 保存助手回应
   */
  private async saveAssistantResponse(response: IHealthAssistantResponse): Promise<void> {
    try {
      const userResponses = this.assistantResponses.get(response.userId) || [];
      userResponses.push(response);
      this.assistantResponses.set(response.userId, userResponses);
      // 保存到数据库
      this.logger.info(`保存助手回应: ${response.id}`);
    } catch (error) {
      this.logger.error('保存助手回应失败', error);
      throw error;
    }
  }
}
