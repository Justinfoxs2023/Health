/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export { UserLevel } from './user-level.entity';
export { Specialization } from './specialization.entity';
export { FeaturePrivilege } from './feature-privilege.entity';
export { Reward } from './reward.entity';

// 用户相关实体
export * from './user/user.entity';
export * from './user/user-profile.entity';

// 健康相关实体
export * from './health/health-record.entity';
export * from './health/vital-signs.entity';
export * from './health/exercise-data.entity';

// 社交相关实体
export * from './social/social-interaction.entity';
export * from './social/community-activity.entity';

// 商业相关实体
export * from './commerce/transaction.entity';
export * from './commerce/order.entity';
export * from './commerce/payment.entity';

// 游戏化相关实体
export * from './gamification/achievement.entity';
export * from './gamification/level.entity';
export * from './gamification/quest.entity';

// 物流相关实体
export * from './logistics/logistics-order.entity';
export * from './logistics/logistics-provider.entity';
