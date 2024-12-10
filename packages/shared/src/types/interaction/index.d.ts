// 用户查询类型
export interface UserQuery {
  id: string;
  userId: string;
  content: string;
  type: QueryType;
  context?: QueryContext;
  timestamp: Date;
}

export type QueryType = 
  | 'health_question'    // 健康问题
  | 'feature_help'       // 功能帮助
  | 'data_explanation'   // 数据解释
  | 'recommendation'     // 建议咨询
  | 'technical_support'; // 技术支持

export interface QueryContext {
  previousQueries?: string[];
  relatedData?: any;
  userPreferences?: any;
}

// 情感分析类型
export interface Sentiment {
  primary: EmotionType;
  secondary?: EmotionType;
  intensity: number;  // 0-1
  confidence: number; // 0-1
  triggers?: string[];
  suggestions?: string[];
}

export type EmotionType = 
  | 'happy'
  | 'anxious'
  | 'frustrated'
  | 'confused'
  | 'neutral';

// 用户行为类型
export interface UserBehavior {
  userId: string;
  sessions: SessionData[];
  preferences: UserPreference;
  interactions: Interaction[];
  patterns: BehaviorPattern[];
}

export interface SessionData {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  activities: Activity[];
  engagement: EngagementMetrics;
}

export interface UserPreference {
  theme: 'light' | 'dark';
  fontSize: number;
  language: string;
  notifications: NotificationPreference;
  accessibility: AccessibilitySettings;
}

export interface UIConfig {
  layout: LayoutConfig;
  theme: ThemeConfig;
  features: FeatureConfig;
  accessibility: AccessibilityConfig;
} 