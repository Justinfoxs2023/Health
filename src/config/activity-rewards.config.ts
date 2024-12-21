import { IActivityLevelConfig, IActivityRewardRule } from '../types/gamification/activity.types';

// 活跃度等级配置
export const ACTIVITY_LEVEL_CONFIG: IActivityLevelConfig[] = [
  {
    level: 1,
    requirements: {
      dailyActions: 3,
      weeklyActions: 15,
      monthlyActions: 50,
      continuousLogin: 3,
    },
    rewards: {
      baseExp: 100,
      bonusExp: 50,
      points: 100,
      items: ['newbie_pack'],
      features: ['basic_tracking'],
      tutorials: ['health_tracking_guide'],
    },
    preferences: {
      exerciseTypes: ['walking', 'yoga', 'swimming'],
      intensityLevels: ['beginner'],
      timeSlots: ['morning', 'evening'],
    },
  },
  {
    level: 6,
    requirements: {
      dailyActions: 5,
      weeklyActions: 25,
      monthlyActions: 80,
      continuousLogin: 5,
    },
    rewards: {
      baseExp: 200,
      bonusExp: 100,
      points: 200,
      features: ['advanced_tracking', 'nutrition_planning'],
      tutorials: ['nutrition_guide', 'advanced_exercise_tracking'],
    },
    preferences: {
      exerciseTypes: ['running', 'cycling', 'gym'],
      intensityLevels: ['intermediate'],
      dietTypes: ['balanced', 'protein_focused'],
    },
  },
  {
    level: 11,
    requirements: {
      dailyActions: 8,
      weeklyActions: 40,
      monthlyActions: 120,
      continuousLogin: 7,
    },
    rewards: {
      baseExp: 300,
      bonusExp: 150,
      points: 300,
      features: ['expert_analysis', 'community_leadership'],
      tutorials: ['community_guide', 'expert_tools_tutorial'],
    },
    preferences: {
      exerciseTypes: ['hiit', 'crossfit', 'sports'],
      intensityLevels: ['advanced'],
      socialFeatures: ['group_activities', 'mentoring'],
    },
  },
];

// 活跃度奖励规则
export const ACTIVITY_REWARD_RULES: Record<string, IActivityRewardRule> = {
  daily_login: {
    activityType: 'daily_login',
    basePoints: 10,
    levelMultipliers: {
      1: 1.0,
      5: 1.2,
      10: 1.5,
      15: 1.8,
      20: 2.0,
    },
    featureUnlocks: {
      5: ['personalized_recommendations'],
      10: ['advanced_analytics'],
      15: ['expert_community_access'],
    },
    tutorialTriggers: {
      5: ['personalization_guide'],
      10: ['analytics_tutorial'],
      15: ['community_expert_guide'],
    },
  },
  health_record: {
    activityType: 'health_record',
    basePoints: 20,
    specialRules: {
      timeBonus: [
        { startHour: 6, endHour: 9, multiplier: 1.5 },
        { startHour: 18, endHour: 22, multiplier: 1.3 },
      ],
      qualityBonus: [
        { condition: 'detailed_record', multiplier: 1.5 },
        { condition: 'with_photos', multiplier: 1.8 },
      ],
    },
    progressiveUnlocks: {
      recordCount: {
        10: ['health_insights'],
        30: ['trend_analysis'],
        100: ['ai_health_assistant'],
      },
    },
  },
  group_exercise: {
    activityType: 'group_exercise',
    basePoints: 30,
    specialRules: {
      timeBonus: [
        { startHour: 6, endHour: 9, multiplier: 1.8 },
        { startHour: 17, endHour: 20, multiplier: 1.5 },
      ],
      qualityBonus: [
        { condition: 'group_size_5+', multiplier: 1.5 },
        { condition: 'duration_60min+', multiplier: 1.8 },
      ],
    },
    socialFeatures: {
      groupSize: {
        5: ['group_challenges'],
        10: ['team_analytics'],
        20: ['community_events'],
      },
    },
  },
};

// AI任务奖励规则
export const AI_TASK_REWARDS: Record<string, IActivityRewardRule> = {
  health_management: {
    activityType: 'health_management',
    basePoints: 30,
    specialRules: {
      difficultyBonus: [
        { level: 'easy', multiplier: 1.0 },
        { level: 'medium', multiplier: 1.5 },
        { level: 'hard', multiplier: 2.0 },
      ],
      personalizedBonus: [
        { condition: 'health_condition_managed', multiplier: 1.3 },
        { condition: 'lifestyle_improved', multiplier: 1.4 },
        { condition: 'goal_exceeded', multiplier: 1.5 },
      ],
    },
    progressiveUnlocks: {
      taskCompletion: {
        10: ['advanced_health_tracking'],
        30: ['personalized_guidance'],
        50: ['health_expert_consultation'],
      },
    },
  },
  // ... 其他AI任务奖励规则 ...
};
