import { ILevelProgressionConfig } from '../types/gamification/level-progression.types';

export const LEVEL_PROGRESSION_CONFIG: ILevelProgressionConfig = {
  // 新手期（1-5级）- 1-3天
  novice: {
    maxDays: 3,
    dailyExp: {
      min: 500,
      normal: 800,
      max: 1200,
    },
    keyFeatures: ['basic_health_tracking', 'daily_tasks', 'basic_exercise', 'diet_basic'],
    requirements: {
      dailyTasks: 3,
      totalHealthRecords: 5,
      exerciseRecords: 2,
    },
  },

  // 成长期（6-10级）- 4-7天
  growth: {
    maxDays: 7,
    dailyExp: {
      min: 800,
      normal: 1200,
      max: 1800,
    },
    keyFeatures: ['advanced_health_tracking', 'social_basic', 'exercise_planning', 'diet_analysis'],
    requirements: {
      dailyTasks: 5,
      socialInteractions: 3,
      challengeCompleted: 2,
    },
  },

  // 进阶期（11-15级）- 8-14天
  advanced: {
    maxDays: 14,
    dailyExp: {
      min: 1200,
      normal: 1800,
      max: 2500,
    },
    keyFeatures: [
      'expert_consultation',
      'data_analysis',
      'community_features',
      'personalized_plan',
    ],
    requirements: {
      weeklyGoals: 3,
      expertInteractions: 1,
      contentCreation: 2,
    },
  },

  // 专家期（16-20级）- 15-21天
  expert: {
    maxDays: 21,
    dailyExp: {
      min: 1500,
      normal: 2200,
      max: 3000,
    },
    keyFeatures: ['advanced_analysis', 'group_management', 'professional_tools', 'custom_programs'],
    requirements: {
      mentorshipTasks: 2,
      researchParticipation: 1,
      communityContribution: 5,
    },
  },

  // 大师期（21-25级）- 22-30天
  master: {
    maxDays: 30,
    dailyExp: {
      min: 2000,
      normal: 2800,
      max: 4000,
    },
    keyFeatures: ['premium_content', 'exclusive_events', 'advanced_research', 'leadership_tools'],
    requirements: {
      innovationProjects: 1,
      communityLeadership: 3,
      expertiseRecognition: 2,
    },
  },
};

// 加速机制配置
export const PROGRESSION_BOOSTERS = {
  // 每日加速
  dailyBoosters: {
    perfectDailyTasks: 1.5, // 完成所有每日任务
    qualityContent: 1.3, // 优质内容发布
    helpOthers: 1.2, // 帮助其他用户
    groupActivities: 1.4, // 参与群组活动
  },

  // 成就加速
  achievementBoosters: {
    streakMilestones: 1.6, // 连续打卡里程碑
    challengeCompletion: 1.4, // 完成挑战
    innovationAwards: 1.5, // 创新奖励
  },

  // 社交加速
  socialBoosters: {
    communityContribution: 1.3, // 社区贡献
    teamCollaboration: 1.4, // 团队协作
    mentorship: 1.5, // 指导新用户
  },
};
