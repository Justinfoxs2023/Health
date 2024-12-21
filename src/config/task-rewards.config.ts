/**
 * @fileoverview TS 文件 task-rewards.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const TASK_REWARDS_CONFIG = {
  // 数据同步任务
  dataSyncTasks: {
    dailySteps: {
      type: 'steps',
      minValue: 8000,
      rewards: { points: 100, coins: 50 },
    },
    sleepTracking: {
      type: 'sleep',
      minHours: 7,
      rewards: { points: 80, coins: 40 },
    },
    heartRate: {
      type: 'heartRate',
      timeSpan: 12,
      rewards: { points: 60, coins: 30 },
    },
    workoutSession: {
      type: 'workout',
      minMinutes: 30,
      rewards: { points: 150, coins: 75 },
    },
  },

  // 成就奖励
  achievements: {
    weeklyStreak: { days: 7, bonus: { points: 500, coins: 200 } },
    monthlyStreak: { days: 30, bonus: { points: 2000, coins: 1000 } },
  },
};
