import {
  FeatureUnlock,
  MasteryBonus,
  LevelProgress,
  Specialization,
  ModuleType,
  LevelSystem,
  EnhancedLevelSystem,
} from './gamification/base.types';
export {
  FeatureUnlock,
  MasteryBonus,
  LevelProgress,
  Specialization,
  ModuleType,
  LevelSystem,
  EnhancedLevelSystem,
};

// 扩展现有类型
export interface IUserLevel {
  /** level 的描述 */
  level: number;
  /** nextLevelExp 的描述 */
  nextLevelExp: number;
  /** title 的描述 */
  title: string;
  /** featureUnlocks 的描述 */
  featureUnlocks: FeatureUnlock;
  /** masteryBonuses 的描述 */
  masteryBonuses: MasteryBonus;
  /** specialPrivileges 的描述 */
  specialPrivileges: {
    maxProducts: number;
  };
}
