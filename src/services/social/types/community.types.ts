import { BaseHealthData } from '../../health/types/health-base.types';

// 社区互动基础类型
export interface CommunityBase extends BaseHealthData {
  userId: string;
  visibility: 'public' | 'private' | 'group';
  tags: string[];
  engagement: EngagementMetrics;
}

// 互动类型
export type InteractionType = 
  | 'post'           // 普通发帖
  | 'question'       // 健康问题
  | 'achievement'    // 成就分享
  | 'milestone'      // 里程碑
  | 'challenge'      // 挑战
  | 'support'        // 支持鼓励
  | 'experience'     // 经验分享
  | 'tip';           // 健康小贴士

// 互动内容
export interface CommunityInteraction extends CommunityBase {
  type: InteractionType;
  content: {
    title?: string;
    text: string;
    media?: MediaContent[];
    relatedHealth?: HealthReference[];
  };
  healthTags: HealthTag[];
  responses: InteractionResponse[];
}

// 媒体内容
export interface MediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
  description?: string;
  metadata?: Record<string, any>;
}

// 健康标签
export interface HealthTag {
  name: string;
  category: HealthCategory;
  relevance: number;
  verified: boolean;
  description?: string;
}

// 健康分类
export type HealthCategory = 
  | 'exercise'
  | 'nutrition'
  | 'mental'
  | 'sleep'
  | 'medical'
  | 'lifestyle'
  | 'prevention'
  | 'rehabilitation';

// 互动回应
export interface InteractionResponse extends BaseHealthData {
  type: 'comment' | 'reaction' | 'share';
  content?: string;
  reaction?: string;
  userId: string;
  replyTo?: string;
}

// 参与度指标
export interface EngagementMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reports: number;
}

// 健康引用
export interface HealthReference {
  type: 'condition' | 'treatment' | 'medication' | 'exercise' | 'diet';
  id: string;
  name: string;
  description?: string;
  source?: string;
}

// 健康圈子
export interface HealthCircle extends CommunityBase {
  name: string;
  description: string;
  category: HealthCategory;
  members: CircleMember[];
  rules: CircleRule[];
  topics: string[];
  activities: CircleActivity[];
  metrics: CircleMetrics;
}

// 圈子成员
export interface CircleMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinDate: Date;
  contributions: number;
  status: 'active' | 'inactive' | 'banned';
}

// 圈子规则
export interface CircleRule {
  id: string;
  title: string;
  description: string;
  priority: number;
  enforceLevel: 'strict' | 'moderate' | 'lenient';
}

// 圈子活动
export interface CircleActivity extends CommunityBase {
  title: string;
  type: 'challenge' | 'event' | 'discussion' | 'survey';
  schedule: {
    start: Date;
    end?: Date;
    recurring?: boolean;
  };
  participants: {
    current: number;
    max?: number;
    list: string[];
  };
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

// 圈子指标
export interface CircleMetrics {
  memberCount: number;
  activeMembers: number;
  postsPerDay: number;
  engagementRate: number;
  topContributors: string[];
  popularTopics: Array<{
    topic: string;
    count: number;
  }>;
}

// 成就系统
export interface Achievement extends BaseHealthData {
  title: string;
  description: string;
  category: HealthCategory;
  criteria: AchievementCriteria[];
  rewards: AchievementReward[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

// 成就标准
export interface AchievementCriteria {
  type: string;
  target: number;
  current: number;
  description: string;
}

// 成就奖励
export interface AchievementReward {
  type: 'badge' | 'points' | 'feature' | 'title';
  value: any;
  description: string;
} 