import { IFeatureUnlock, IMasteryBonus } from './base.types';
import { ModuleType } from './feature.types';

export interface IUserLevel {
  /** level 的描述 */
  level: number;
  /** nextLevelExp 的描述 */
  nextLevelExp: number;
  /** title 的描述 */
  title: string;
  /** featureUnlocks 的描述 */
  featureUnlocks: IFeatureUnlock;
  /** masteryBonuses 的描述 */
  masteryBonuses: IMasteryBonus;
  /** specialPrivileges 的描述 */
  specialPrivileges: {
    maxProducts: number;
    maxShowcaseSlots: number;
  };
}

export interface ILevelSystem {
  /** currentLevel 的描述 */
  currentLevel: IUserLevel;
  /** experience 的描述 */
  experience: number;
  /** nextLevelExp 的描述 */
  nextLevelExp: number;
  /** totalExp 的描述 */
  totalExp: number;
  /** levelHistory 的描述 */
  levelHistory: LevelProgress;
  /** unlockedFeatures 的描述 */
  unlockedFeatures: string;
  /** masteryPoints 的描述 */
  masteryPoints: number;
  /** specializations 的描述 */
  specializations: Specialization;
  /** unlockedModules 的描述 */
  unlockedModules: ModuleType;
}
