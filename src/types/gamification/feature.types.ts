/**
 * @fileoverview TS 文件 feature.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export type ModuleType =
  any; // 高级内容

export type FeatureDepthType =
  any; // 尊享功能（25级以上）

export type FeatureGroupType =
  any; // 高级特权

export interface IFeaturePrivilege {
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
    depth: "tutorial" | "basic" | "standard" | "advanced" | "premium" | "exclusive";
  /** requirements 的描述 */
    requirements: {
    points: number;
    achievements: string;
    specialization: string;
    activeTime: number;
  };
}

// 新增功能层级配置
export interface IFeatureTier {
  /** depth 的描述 */
    depth: "tutorial" | "basic" | "standard" | "advanced" | "premium" | "exclusive";
  /** minLevel 的描述 */
    minLevel: number;
  /** features 的描述 */
    features: {
    key in ModuleType: string;  ID
  };
  requirements?: {
    activeTime?: number; // 活跃天数要求
    points?: number; // 积分要求
    achievements?: string[]; // 成就要求
  };
}
