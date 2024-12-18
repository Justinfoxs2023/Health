/**
 * @fileoverview TS 文件 level.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 功能模块类型
type ModuleType =
  any; // 高级内容

// 功能深度类型
type FeatureDepthType =
  any; // 高级功能

// 功能分组
type FeatureGroupType =
  any; // 高级特权

// 扩展功能特权配置
interface IFeaturePrivilege {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** moduleType 的描述 */
  moduleType: "health_tracking" | "exercise" | "diet" | "social" | "expert_consult" | "family_health" | "data_analysis" | "premium_content";
  /** group 的描述 */
  group: "social" | "onboarding" | "core" | "analysis" | "premium";
  /** description 的描述 */
  description: string;
  /** minLevel 的描述 */
  minLevel: number;
  /** depth 的描述 */
  depth: "tutorial" | "basic" | "standard" | "advanced" | "premium";
  /** requirements 的描述 */
  requirements: {
    points: number;
    achievements: string;
    specialization: string;
    activeTime: number;
  };
}

// 等级称号配置
interface ILevelTitle {
  /** level 的描述 */
  level: number;
  /** title 的描述 */
  title: string;
  /** badge 的描述 */
  badge: string;
  /** description 的描述 */
  description: string;
  /** privileges 的描述 */
  privileges: string /** ID 的描述 */;
  /** ID 的描述 */
  ID;
}

// 扩展用户等级系统
interface IEnhancedLevelSystem extends LevelSystem {
  /** unlockedModules 的描述 */
  unlockedModules: ModuleType[];
  /** currentTitle 的描述 */
  currentTitle: ILevelTitle;
  /** availableFeatures 的描述 */
  availableFeatures: IFeaturePrivilege[];
  /** lockedFeatures 的描述 */
  lockedFeatures: IFeaturePrivilege[];
  /** specializations 的描述 */
  specializations: {
    [key in ModuleType]?: {
      level: number;
      progress: number;
      unlockedFeatures: string[];
    };
  };
}
