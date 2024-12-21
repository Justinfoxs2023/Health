/**
 * @fileoverview TS 文件 trading-rewards.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const TRADING_ACHIEVEMENTS = {
  // 交易等级称号
  tradingTitles: {
    novice_trader: { minVolume: 1000, reward: 100 },
    skilled_trader: { minVolume: 5000, reward: 500 },
    expert_trader: { minVolume: 20000, reward: 2000 },
    master_trader: { minVolume: 50000, reward: 5000 },
    legendary_trader: { minVolume: 100000, reward: 10000 },
  },

  // 交易特权解锁
  tradingPrivileges: {
    price_setting: { level: 5, requirement: 'novice_trader' },
    poster_creation: { level: 10, requirement: 'skilled_trader' },
    commission_earning: { level: 20, requirement: 'expert_trader' },
    bulk_trading: { level: 30, requirement: 'master_trader' },
  },

  // 佣金等级
  commissionRates: {
    level_1: { rate: 0.01, requirement: 'novice_trader' },
    level_2: { rate: 0.02, requirement: 'skilled_trader' },
    level_3: { rate: 0.03, requirement: 'expert_trader' },
    level_4: { rate: 0.04, requirement: 'master_trader' },
    level_5: { rate: 0.05, requirement: 'legendary_trader' },
  },
};
