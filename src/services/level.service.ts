import type {
  ILevelSystem,
  EnhancedLevelSystem,
  ModuleType,
  IFeatureTier,
  IFeatureUnlock,
} from '../types/gamification';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserLevel, Specialization, FeaturePrivilege } from '../entities';

@Injec
table()
export class LevelService {
  private readonly levelThresholds = [
    0,
    100,
    300,
    600,
    1000,
    1500,
    2100,
    2800,
    3600,
    4500, // 1-10级
    5500,
    6600,
    7800,
    9100,
    10500,
    12000,
    13600,
    15300,
    17100,
    19000, // 11-20级
  ];

  private readonly moduleUnlockMap: Record<number, ModuleType[]> = {
    1: ['health_tracking'],
    3: ['exercise'],
    5: ['diet'],
    8: ['social'],
    10: ['family_health'],
    15: ['expert_consult'],
    20: ['data_analysis'],
    25: ['premium_content'],
  };

  private readonly featureUnlockConfig: Record<number, FeaturePrivilege[]> = {
    // 1-5级：新手引导与基础功能
    1: [
      {
        id: 'user_profile',
        name: '个人中心',
        moduleType: 'core',
        group: 'onboarding',
        depth: 'tutorial',
        description: '查看和编辑个人信息',
      },
      {
        id: 'basic_health',
        name: '基础健康数据',
        moduleType: 'health_tracking',
        group: 'core',
        depth: 'tutorial',
        description: '记录基本健康指标',
      },
    ],
    3: [
      {
        id: 'basic_exercise',
        name: '运动记录',
        moduleType: 'exercise',
        group: 'core',
        depth: 'basic',
        description: '记录日常运动数据',
      },
    ],
    5: [
      {
        id: 'basic_diet',
        name: '饮食记录',
        moduleType: 'diet',
        group: 'core',
        depth: 'basic',
        description: '记录饮食习惯',
      },
    ],

    // 6-10级：开放更多基础功能
    7: [
      {
        id: 'community_basic',
        name: '社区浏览',
        moduleType: 'social',
        group: 'social',
        depth: 'basic',
        description: '浏览社区内容',
      },
    ],
    10: [
      {
        id: 'family_basic',
        name: '家庭健康',
        moduleType: 'family_health',
        group: 'core',
        depth: 'basic',
        description: '家庭成员健康管理',
      },
    ],

    // 11-20级：完整功能体系
    15: [
      {
        id: 'expert_consult',
        name: '专家咨询',
        moduleType: 'expert_consult',
        group: 'core',
        depth: 'standard',
        description: '在线咨询专家',
      },
      {
        id: 'data_analysis',
        name: '数据分析',
        moduleType: 'data_analysis',
        group: 'analysis',
        depth: 'standard',
        description: '健康数据趋势分析',
      },
    ],

    // 20级以上：高级功能
    20: [
      {
        id: 'premium_analysis',
        name: '高级分析',
        moduleType: 'data_analysis',
        group: 'premium',
        depth: 'advanced',
        description: 'AI驱动的健康预测',
        requirements: {
          points: 10000,
          achievements: ['data_master'],
        },
      },
    ],
    25: [
      {
        id: 'premium_service',
        name: '尊享服务',
        moduleType: 'premium_content',
        group: 'premium',
        depth: 'premium',
        description: '个性化健康管理方案',
        requirements: {
          points: 20000,
          activeTime: 180,
          specialization: '15',
        },
      },
    ],
  };

  private readonly featureTiers: IFeatureTier[] = [
    {
      depth: 'tutorial',
      minLevel: 1,
      features: {
        health_tracking: ['basic_metrics', 'daily_record'],
        exercise: ['step_counting', 'activity_log'],
        diet: ['meal_record', 'water_intake'],
        social: ['view_community'],
      },
    },
    {
      depth: 'basic',
      minLevel: 6,
      features: {
        health_tracking: ['health_trends', 'vital_signs'],
        exercise: ['workout_plans', 'exercise_library'],
        diet: ['nutrition_tracking', 'meal_planning'],
        social: ['join_groups', 'basic_interaction'],
        family_health: ['family_members'],
      },
      requirements: {
        activeTime: 7,
        points: 1000,
      },
    },
    {
      depth: 'standard',
      minLevel: 11,
      features: {
        health_tracking: ['health_reports', 'custom_metrics'],
        exercise: ['training_programs', 'performance_analytics'],
        diet: ['diet_analysis', 'recipe_database'],
        social: ['create_content', 'challenge_participation'],
        family_health: ['family_sharing', 'health_monitoring'],
        data_analysis: ['basic_insights'],
      },
      requirements: {
        activeTime: 30,
        points: 3000,
        achievements: ['health_basics'],
      },
    },
    {
      depth: 'advanced',
      minLevel: 16,
      features: {
        health_tracking: ['health_predictions', 'correlation_analysis'],
        exercise: ['ai_coaching', 'advanced_analytics'],
        diet: ['personalized_plans', 'nutrition_ai'],
        social: ['community_leadership', 'expert_interaction'],
        family_health: ['family_insights', 'care_coordination'],
        data_analysis: ['trend_analysis', 'health_forecasting'],
        expert_consult: ['basic_consultation'],
      },
      requirements: {
        activeTime: 90,
        points: 6000,
        achievements: ['health_expert'],
      },
    },
    {
      depth: 'premium',
      minLevel: 21,
      features: {
        health_tracking: ['ai_health_assistant', 'research_participation'],
        exercise: ['pro_coaching', 'competition_access'],
        diet: ['expert_guidance', 'premium_content'],
        social: ['verified_expert', 'premium_events'],
        family_health: ['family_consultation', 'emergency_support'],
        data_analysis: ['predictive_analytics', 'research_insights'],
        expert_consult: ['priority_consultation', 'specialist_access'],
        premium_content: ['exclusive_content', 'early_access'],
      },
      requirements: {
        activeTime: 180,
        points: 10000,
        achievements: ['health_master'],
      },
    },
  ];

  constructor(
    @InjectRepository()
    private readonly levelRepository: Repository<UserLevel>,
    @InjectRepository()
    private readonly specializationRepository: Repository<Specialization>,
    @InjectRepository()
    private readonly featureRepository: Repository<FeaturePrivilege>,
  ) {}

  async calculateExperience(
    userId: string,
    action: string,
    baseExp: number,
    context?: any,
  ): Promise<number> {
    const levelSystem = await this.getLevelSystem(userId);
    let expMultiplier = 1;

    // 计算专精加成
    levelSystem.specializations.forEach(spec => {
      const boosts = spec.benefits.filter(
        b => b.type === 'exp_boost' && spec.level >= b.unlockLevel,
      );
      expMultiplier += boosts.reduce((sum, b) => sum + b.value, 0);
    });

    // 计算等级加成
    const levelBoosts = levelSystem.currentLevel.masteryBonuses
      .filter(b => b.type === 'exp_boost')
      .reduce((sum, b) => sum + b.value, 0);
    expMultiplier += levelBoosts;

    return Math.floor(baseExp * expMultiplier);
  }

  async addExperience(userId: string, exp: number): Promise<void> {
    const levelSystem = await this.getLevelSystem(userId);
    levelSystem.experience += exp;
    levelSystem.totalExp += exp;

    // 检查是否升级
    while (levelSystem.experience >= levelSystem.nextLevelExp) {
      await this.performLevelUp(userId, levelSystem);
    }

    await this.saveLevelSystem(userId, levelSystem);
  }

  private async performLevelUp(userId: string, levelSystem: ILevelSystem): Promise<void> {
    const nextLevel = levelSystem.currentLevel.level + 1;
    const newLevel = await this.levelRepository.findOne({
      where: { level: nextLevel },
    });

    if (!newLevel) return;

    // 记录等级进度
    levelSystem.levelHistory.push({
      level: nextLevel,
      achievedAt: new Date(),
      expGained: levelSystem.experience,
      unlockedFeatures: newLevel.featureUnlocks.map(f => f.featureId),
      achievements: [],
    });

    // 更新等级信息
    levelSystem.currentLevel = newLevel;
    levelSystem.experience -= levelSystem.nextLevelExp;
    levelSystem.nextLevelExp = this.levelThresholds[nextLevel];
    levelSystem.masteryPoints += 1;

    // 解锁新功能
    levelSystem.unlockedFeatures = [
      ...levelSystem.unlockedFeatures,
      ...newLevel.featureUnlocks.map(f => f.featureId),
    ];

    // 发送通知
    await this.notifyLevelUp(userId, nextLevel, newLevel.featureUnlocks);
  }

  async checkModuleAccess(userId: string, moduleType: ModuleType): Promise<boolean> {
    const levelSystem = await this.getLevelSystem(userId);
    return levelSystem.unlockedModules.includes(moduleType);
  }

  private async updateModuleAccess(
    userId: string,
    levelSystem: EnhancedLevelSystem,
  ): Promise<void> {
    const currentLevel = levelSystem.currentLevel.level;

    // 检查并解锁新模块
    Object.entries(this.moduleUnlockMap).forEach(([reqLevel, modules]) => {
      if (currentLevel >= parseInt(reqLevel)) {
        modules.forEach(module => {
          if (!levelSystem.unlockedModules.includes(module)) {
            levelSystem.unlockedModules.push(module);
          }
        });
      }
    });

    // 更新可用特权
    const allPrivileges = await this.featureRepository.find();
    levelSystem.availableFeatures = allPrivileges.filter(
      feature =>
        feature.minLevel <= currentLevel && this.checkFeatureRequirements(feature, levelSystem),
    );

    levelSystem.lockedFeatures = allPrivileges.filter(
      feature => !levelSystem.availableFeatures.includes(feature),
    );

    await this.saveLevelSystem(userId, levelSystem);
  }

  private checkFeatureRequirements(
    feature: FeaturePrivilege,
    levelSystem: EnhancedLevelSystem,
  ): boolean {
    if (!feature.requirements) return true;

    const { points, achievements, specialization } = feature.requirements;

    if (points && levelSystem.totalExp < points) return false;

    if (achievements?.length) {
      const hasAchievements = achievements.every(id => levelSystem.achievements.includes(id));
      if (!hasAchievements) return false;
    }

    if (specialization) {
      const specLevel = levelSystem.specializations[feature.moduleType]?.level || 0;
      if (specLevel < parseInt(specialization)) return false;
    }

    return true;
  }

  private async getLevelSystem(userId: string): Promise<ILevelSystem> {
    // 实现获取用户等级系统的逻辑
    return {} as ILevelSystem;
  }

  private async saveLevelSystem(userId: string, levelSystem: ILevelSystem): Promise<void> {
    // 实现保存用户等级系统的逻辑
  }

  private async notifyLevelUp(
    userId: string,
    level: number,
    features: IFeatureUnlock[],
  ): Promise<void> {
    // 实现等级提升通知的逻辑
  }

  private async checkFeatureAvailability(
    userId: string,
    feature: FeaturePrivilege,
    levelSystem: EnhancedLevelSystem,
  ): Promise<boolean> {
    const currentLevel = levelSystem.currentLevel.level;
    const availableTiers = this.featureTiers.filter(
      tier => currentLevel >= tier.minLevel && this.checkTierRequirements(tier, levelSystem),
    );

    // 检查功能是否在可用层级中
    const isFeatureAvailable = availableTiers.some(tier =>
      tier.features[feature.moduleType]?.includes(feature.id),
    );

    if (!isFeatureAvailable) return false;

    // 检查特定功能的额外要求
    return this.checkFeatureRequirements(feature, levelSystem);
  }

  private checkTierRequirements(tier: IFeatureTier, levelSystem: EnhancedLevelSystem): boolean {
    if (!tier.requirements) return true;

    const { points, achievements, activeTime } = tier.requirements;

    if (points && levelSystem.totalExp < points) return false;

    if (achievements?.length) {
      const hasAchievements = achievements.every(id => levelSystem.achievements.includes(id));
      if (!hasAchievements) return false;
    }

    if (activeTime) {
      const userActiveTime = levelSystem.activeTime || 0;
      if (userActiveTime < activeTime) return false;
    }

    return true;
  }
}
