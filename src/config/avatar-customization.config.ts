/**
 * @fileoverview TS 文件 avatar-customization.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const AVATAR_CUSTOMIZATION_CONFIG = {
  // 装扮类别
  categories: {
    face: {
      features: ['eyes', 'nose', 'mouth', 'ears'],
      materials: ['skin_texture', 'makeup'],
    },
    hair: {
      styles: ['short', 'long', 'curly', 'straight'],
      colors: ['black', 'brown', 'blonde', 'custom'],
    },
    body: {
      types: ['slim', 'medium', 'athletic'],
      heights: ['short', 'medium', 'tall'],
    },
    clothing: {
      tops: ['casual', 'formal', 'sports', 'medical'],
      bottoms: ['pants', 'skirts', 'shorts'],
      shoes: ['casual', 'formal', 'sports'],
      accessories: ['glasses', 'watches', 'jewelry'],
    },
  },

  // 解锁条件
  unlockRequirements: {
    basic: { level: 1, points: 0 },
    advanced: { level: 10, points: 1000 },
    premium: { level: 20, points: 5000 },
    exclusive: { level: 30, points: 10000 },
  },

  // 奖励规则
  rewards: {
    dailyTask: { points: 100, items: 1 },
    weeklyChallenge: { points: 500, items: 3 },
    achievement: { points: 1000, items: 5 },
    specialEvent: { points: 2000, items: 10 },
  },
};
