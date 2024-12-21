/**
 * @fileoverview TS 文件 user-level-privileges.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const USER_LEVEL_PRIVILEGES = {
  // 仓库容量
  inventoryCapacity: {
    level_1: { slots: 20, displaySlots: 5 },
    level_5: { slots: 50, displaySlots: 10 },
    level_10: { slots: 100, displaySlots: 20 },
    level_20: { slots: 200, displaySlots: 40 },
    level_30: { slots: 500, displaySlots: 100 },
  },

  // 展示橱窗权限
  showcasePrivileges: {
    basic: { level: 1, slots: 2, features: ['basic_decoration'] },
    advanced: { level: 10, slots: 4, features: ['advanced_decoration', 'animation'] },
    premium: { level: 20, slots: 6, features: ['premium_effects', 'interaction'] },
    exclusive: { level: 30, slots: 8, features: ['custom_layout', 'special_effects'] },
  },

  // 交易权限
  tradingPrivileges: {
    basic: { level: 1, maxPrice: 1000, features: ['basic_trade'] },
    advanced: { level: 10, maxPrice: 10000, features: ['batch_trade', 'discount'] },
    premium: { level: 20, maxPrice: 50000, features: ['auction', 'limited_sale'] },
    exclusive: { level: 30, maxPrice: null, features: ['custom_trade', 'vip_market'] },
  },
};
