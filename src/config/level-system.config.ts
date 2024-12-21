import { ILevelSystemConfig } from '../types/gamification/level-system.types';

export const LEVEL_SYSTEM_CONFIG: ILevelSystemConfig = {
  expConfig: {
    baseExp: 1000,
    expGrowthRate: 1.2,
    maxLevel: 50,
  },

  levelPrivileges: {
    1: {
      features: ['basic_health_tracking', 'daily_tasks'],
      questLines: ['main_health_journey'],
      rewards: {
        items: ['welcome_pack'],
        points: 100,
      },
      interfaceElements: ['profile_summary', 'quest_board'],
    },
    5: {
      features: ['advanced_health_tracking', 'social_basic'],
      questLines: ['social_interaction'],
      rewards: {
        items: ['health_booster'],
        points: 500,
        titles: ['health_enthusiast'],
      },
      interfaceElements: ['social_hub', 'achievement_wall'],
    },
    10: {
      features: ['expert_consultation', 'data_analysis'],
      questLines: ['expert_growth'],
      rewards: {
        items: ['premium_tracker'],
        points: 1000,
        titles: ['health_expert'],
      },
      interfaceElements: ['expert_zone', 'analytics_dashboard'],
    },
    // ... 更多等级配置
  },

  participationRequirements: {
    dailyTasks: 3,
    weeklyGoals: 5,
    socialInteractions: 10,
    contentCreation: 2,
  },
};
