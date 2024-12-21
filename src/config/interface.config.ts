import {
  InterfaceComponent,
  IActivityConfig,
  IRewardConfig,
} from '../types/gamification/interface.types';
// 界

面组件配置;
export const INTERFACE_COMPONENTS: InterfaceComponent[] = [
  {
    id: 'profile_summary',
    zone: 'profile',
    name: '个人状态',
    description: '展示个人等级、经验和成就',
    icon: 'profile-icon',
    order: 1,
    actions: {
      onClick: 'openProfileDetail',
      onHover: 'showProfileTooltip',
    },
  },

  // 任务面板区
  {
    id: 'quest_board',
    zone: 'quest',
    name: '任务面板',
    description: '查看当前可用任务',
    icon: 'quest-icon',
    order: 2,
    actions: {
      onClick: 'openQuestPanel',
    },
  },

  // 活动中心区
  {
    id: 'activity_center',
    zone: 'activity',
    name: '活动中心',
    description: '参与限时活动和挑战',
    icon: 'activity-icon',
    order: 3,
    requirements: {
      level: 5,
    },
  },

  // 社交互动区
  {
    id: 'social_hub',
    zone: 'social',
    name: '社交中心',
    description: '与其他用户互动',
    icon: 'social-icon',
    order: 4,
    requirements: {
      level: 8,
      features: ['social_basic'],
    },
  },
];

// 活跃度配置
export const ACTIVITY_CONFIG: IActivityConfig = {
  dailyTasks: {
    login: 10,
    healthRecord: 20,
    exercise: 30,
    socialInteract: 15,
  },
  weeklyTasks: {
    exerciseGoal: 100,
    healthGoal: 150,
    communityPost: 80,
  },
  bonusActivities: {
    inviteFriends: 50,
    shareExperience: 30,
    helpOthers: 40,
  },
};

// 奖励配置
export const REWARD_CONFIG: IRewardConfig = {
  activityRewards: {
    daily: {
      exp: 100,
      points: 50,
      items: ['health_potion', 'energy_drink'],
    },
    weekly: {
      exp: 500,
      points: 200,
      features: ['advanced_tracking'],
    },
    monthly: {
      exp: 2000,
      points: 1000,
      titles: ['health_master', 'exercise_expert'],
    },
  },
  levelRewards: {
    5: {
      exp: 1000,
      points: 500,
      features: ['social_basic'],
      titles: ['novice_master'],
    },
    10: {
      exp: 2000,
      points: 1000,
      features: ['advanced_analysis'],
      titles: ['health_expert'],
    },
  },
};
