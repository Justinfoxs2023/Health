/**
 * @fileoverview TS 文件 growth.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IGrowthActivity {
  /** type 的描述 */
  type: string;
  /** points 的描述 */
  points: number;
  /** timestamp 的描述 */
  timestamp: Date;
  /** metadata 的描述 */
  metadata?: Record<string, any>;
}

export interface IAchievement {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** points 的描述 */
  points: number;
  /** unlockedAt 的描述 */
  unlockedAt: Date;
  /** description 的描述 */
  description?: string;
  /** icon 的描述 */
  icon?: string;
}

export interface IUserLevel {
  /** level 的描述 */
  level: number;
  /** points 的描述 */
  points: number;
  /** achievedAt 的描述 */
  achievedAt: Date;
  /** benefits 的描述 */
  benefits?: {
    discounts?: number;
    features?: string[];
    privileges?: string[];
  };
}

export interface IGrowthMetrics {
  /** totalPoints 的描述 */
  totalPoints: number;
  /** currentLevel 的描述 */
  currentLevel: number;
  /** nextLevelPoints 的描述 */
  nextLevelPoints: number;
  /** achievements 的描述 */
  achievements: IAchievement[];
  /** recentActivities 的描述 */
  recentActivities: IGrowthActivity[];
}
