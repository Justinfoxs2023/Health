/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用户查询类型
export interface IUserQuery {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** content 的描述 */
  content: string;
  /** type 的描述 */
  type: "health_question" | "feature_help" | "data_explanation" | "recommendation" | "technical_support";
  /** context 的描述 */
  context: IQueryContext;
  /** timestamp 的描述 */
  timestamp: Date;
}

export type QueryType =
  any; // 技术支持

export interface IQueryContext {
  /** previousQueries 的描述 */
  previousQueries: string;
  /** relatedData 的描述 */
  relatedData: any;
  /** userPreferences 的描述 */
  userPreferences: any;
}

// 情感分析类型
export interface ISentiment {
  /** primary 的描述 */
  primary: "happy" | "anxious" | "frustrated" | "confused" | "neutral";
  /** secondary 的描述 */
  secondary: "happy" | "anxious" | "frustrated" | "confused" | "neutral";
  /** intensity 的描述 */
  intensity: number /** 01 的描述 */;
  /** 01 的描述 */
  01;
  /** confidence 的描述 */
  confidence: number /** 01 的描述 */;
  /** 01 的描述 */
  01;
  /** triggers 的描述 */
  triggers: string;
  /** suggestions 的描述 */
  suggestions: string;
}

export type EmotionType = any;

// 用户行为类型
export interface IUserBehavior {
  /** userId 的描述 */
  userId: string;
  /** sessions 的描述 */
  sessions: ISessionData;
  /** preferences 的描述 */
  preferences: IUserPreference;
  /** interactions 的描述 */
  interactions: Interaction;
  /** patterns 的描述 */
  patterns: BehaviorPattern;
}

export interface ISessionData {
  /** startTime 的描述 */
  startTime: Date;
  /** endTime 的描述 */
  endTime: Date;
  /** duration 的描述 */
  duration: number;
  /** activities 的描述 */
  activities: Activity;
  /** engagement 的描述 */
  engagement: EngagementMetrics;
}

export interface IUserPreference {
  /** theme 的描述 */
  theme: light /** dark 的描述 */;
  /** dark 的描述 */
  dark;
  /** fontSize 的描述 */
  fontSize: number;
  /** language 的描述 */
  language: string;
  /** notifications 的描述 */
  notifications: NotificationPreference;
  /** accessibility 的描述 */
  accessibility: AccessibilitySettings;
}

export interface IUIConfig {
  /** layout 的描述 */
  layout: LayoutConfig;
  /** theme 的描述 */
  theme: IThemeConfig;
  /** features 的描述 */
  features: FeatureConfig;
  /** accessibility 的描述 */
  accessibility: AccessibilityConfig;
}
