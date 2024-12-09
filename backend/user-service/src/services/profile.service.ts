import { UserProfile, IUserProfile } from '../models/profile.model';
import { HealthDataService } from './health-data.service';
import { Logger } from '../utils/logger';
import { ProfileNotFoundError } from '../utils/errors';

export class ProfileService {
  private healthDataService: HealthDataService;
  private logger: Logger;

  constructor() {
    this.healthDataService = new HealthDataService();
    this.logger = new Logger('ProfileService');
  }

  /**
   * 创建用户画像
   */
  public async createProfile(userId: string): Promise<IUserProfile> {
    try {
      const profile = new UserProfile({
        userId,
        healthScore: 0,
        healthTags: [],
        preferences: {},
        riskFactors: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await profile.save();
      return profile;
    } catch (error) {
      this.logger.error('创建用户画像失败', error);
      throw error;
    }
  }

  /**
   * 更新用户画像
   */
  public async updateProfile(userId: string, data: Partial<IUserProfile>): Promise<IUserProfile> {
    try {
      const profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        throw new ProfileNotFoundError('用户画像不存在');
      }

      // 更新画像数据
      Object.assign(profile, {
        ...data,
        updatedAt: new Date()
      });

      await profile.save();

      // 触发健康评估
      await this.analyzeHealthProfile(userId);

      return profile;
    } catch (error) {
      this.logger.error('更新用户画像失败', error);
      throw error;
    }
  }

  /**
   * 分析用户健康画像
   */
  private async analyzeHealthProfile(userId: string): Promise<void> {
    try {
      // 获取用户健康数据
      const healthData = await this.healthDataService.getUserHealthData(userId);

      // 计算健康评分
      const healthScore = await this.calculateHealthScore(healthData);

      // 识别健康标签
      const healthTags = await this.identifyHealthTags(healthData);

      // 评估健康风险
      const riskFactors = await this.assessHealthRisks(healthData);

      // 更新用户画像
      await UserProfile.updateOne(
        { userId },
        {
          $set: {
            healthScore,
            healthTags,
            riskFactors,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      this.logger.error('分析用户健康画像失败', error);
      throw error;
    }
  }

  /**
   * 计算健康评分
   */
  private async calculateHealthScore(healthData: any): Promise<number> {
    // 实现健康评分算法
    const scores = {
      vitalSigns: this.calculateVitalSignsScore(healthData.vitalSigns),
      exercise: this.calculateExerciseScore(healthData.exercise),
      diet: this.calculateDietScore(healthData.diet),
      sleep: this.calculateSleepScore(healthData.sleep)
    };

    return Object.values(scores).reduce((acc, score) => acc + score, 0) / Object.keys(scores).length;
  }

  /**
   * 识别健康标签
   */
  private async identifyHealthTags(healthData: any): Promise<string[]> {
    const tags = new Set<string>();

    // 分析生命体征
    if (healthData.vitalSigns) {
      this.analyzeVitalSignsTags(healthData.vitalSigns, tags);
    }

    // 分析运动习惯
    if (healthData.exercise) {
      this.analyzeExerciseTags(healthData.exercise, tags);
    }

    // 分析饮食习惯
    if (healthData.diet) {
      this.analyzeDietTags(healthData.diet, tags);
    }

    return Array.from(tags);
  }

  /**
   * 评估健康风险
   */
  private async assessHealthRisks(healthData: any): Promise<Array<{type: string, level: string, description: string}>> {
    const risks = [];

    // 评估各项指标风险
    if (healthData.vitalSigns) {
      risks.push(...this.assessVitalSignsRisks(healthData.vitalSigns));
    }

    if (healthData.lifestyle) {
      risks.push(...this.assessLifestyleRisks(healthData.lifestyle));
    }

    return risks.sort((a, b) => 
      this.getRiskLevel(b.level) - this.getRiskLevel(a.level)
    );
  }
} 