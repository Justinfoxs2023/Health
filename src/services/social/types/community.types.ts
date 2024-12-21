import { IBaseHealthData } from '../../health/types/health-base.types';

// 社区互动基础类型
export interface ICommunityBase extends IBaseHealthData {
  /** userId 的描述 */
    userId: string;
  /** visibility 的描述 */
    visibility: "public" | "private" | "group";
  /** tags 的描述 */
    tags: string[];
  /** engagement 的描述 */
    engagement: IEngagementMetrics;
}

// 互动类型
export type InteractionType =
  any; // 健康小贴士

// 互动内容
export interface ICommunityInteraction extends ICommunityBase {
  /** type 的描述 */
    type: "post" | "question" | "achievement" | "milestone" | "challenge" | "support" | "experience" | "tip";
  /** content 的描述 */
    content: {
    title?: string;
    text: string;
    media?: IMediaContent[];
    relatedHealth?: IHealthReference[];
  };
  /** healthTags 的描述 */
    healthTags: IHealthTag[];
  /** responses 的描述 */
    responses: InteractionResponse[];
}

// 媒体内容
export interface IMediaContent {
  /** type 的描述 */
    type: image  video  audio;
  url: string;
  thumbnail: string;
  duration: number;
  description: string;
  metadata: Recordstring, any;
}

// 健康标签
export interface IHealthTag {
  /** name 的描述 */
    name: string;
  /** category 的描述 */
    category: "exercise" | "nutrition" | "mental" | "sleep" | "medical" | "lifestyle" | "prevention" | "rehabilitation";
  /** relevance 的描述 */
    relevance: number;
  /** verified 的描述 */
    verified: false | true;
  /** description 的描述 */
    description: string;
}

// 健康分类
export type HealthCategoryType =
  any;

// 互动回应
export interface InteractionResponse extends IBaseHealthData {
  /** type 的描述 */
    type: "comment" | "reaction" | "share";
  /** content 的描述 */
    content?: undefined | string;
  /** reaction 的描述 */
    reaction?: undefined | string;
  /** userId 的描述 */
    userId: string;
  /** replyTo 的描述 */
    replyTo?: undefined | string;
}

// 参与度指标
export interface IEngagementMetrics {
  /** views 的描述 */
    views: number;
  /** likes 的描述 */
    likes: number;
  /** comments 的描述 */
    comments: number;
  /** shares 的描述 */
    shares: number;
  /** saves 的描述 */
    saves: number;
  /** reports 的描述 */
    reports: number;
}

// 健康引用
export interface IHealthReference {
  /** type 的描述 */
    type: condition  treatment  medication  exercise  diet;
  id: string;
  name: string;
  description: string;
  source: string;
}

// 健康圈子
export interface IHealthCircle extends ICommunityBase {
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** category 的描述 */
    category: "exercise" | "nutrition" | "mental" | "sleep" | "medical" | "lifestyle" | "prevention" | "rehabilitation";
  /** members 的描述 */
    members: ICircleMember[];
  /** rules 的描述 */
    rules: ICircleRule[];
  /** topics 的描述 */
    topics: string[];
  /** activities 的描述 */
    activities: ICircleActivity[];
  /** metrics 的描述 */
    metrics: ICircleMetrics;
}

// 圈子成员
export interface ICircleMember {
  /** userId 的描述 */
    userId: string;
  /** role 的描述 */
    role: admin  moderator  member;
  joinDate: Date;
  contributions: number;
  status: active  inactive  banned;
}

// 圈子规则
export interface ICircleRule {
  /** id 的描述 */
    id: string;
  /** title 的描述 */
    title: string;
  /** description 的描述 */
    description: string;
  /** priority 的描述 */
    priority: number;
  /** enforceLevel 的描述 */
    enforceLevel: strict  moderate  lenient;
}

// 圈子活动
export interface ICircleActivity extends ICommunityBase {
  /** title 的描述 */
    title: string;
  /** type 的描述 */
    type: "challenge" | "event" | "discussion" | "survey";
  /** schedule 的描述 */
    schedule: {
    start: Date;
    end?: Date;
    recurring?: boolean;
  };
  /** participants 的描述 */
    participants: {
    current: number;
    max?: number;
    list: string[];
  };
  /** status 的描述 */
    status: "active" | "completed" | "upcoming" | "cancelled";
}

// 圈子指标
export interface ICircleMetrics {
  /** memberCount 的描述 */
    memberCount: number;
  /** activeMembers 的描述 */
    activeMembers: number;
  /** postsPerDay 的描述 */
    postsPerDay: number;
  /** engagementRate 的描述 */
    engagementRate: number;
  /** topContributors 的描述 */
    topContributors: string;
  /** popularTopics 的描述 */
    popularTopics: Array{
    topic: string;
    count: number;
  }>;
}

// 成就系统
export interface IAchievement extends IBaseHealthData {
  /** title 的描述 */
    title: string;
  /** description 的描述 */
    description: string;
  /** category 的描述 */
    category: "exercise" | "nutrition" | "mental" | "sleep" | "medical" | "lifestyle" | "prevention" | "rehabilitation";
  /** criteria 的描述 */
    criteria: IAchievementCriteria[];
  /** rewards 的描述 */
    rewards: IAchievementReward[];
  /** rarity 的描述 */
    rarity: "common" | "rare" | "epic" | "legendary";
  /** progress 的描述 */
    progress: number;
  /** unlocked 的描述 */
    unlocked: false | true;
  /** unlockedAt 的描述 */
    unlockedAt?: undefined | Date;
}

// 成就标准
export interface IAchievementCriteria {
  /** type 的描述 */
    type: string;
  /** target 的描述 */
    target: number;
  /** current 的描述 */
    current: number;
  /** description 的描述 */
    description: string;
}

// 成就奖励
export interface IAchievementReward {
  /** type 的描述 */
    type: badge  points  feature  title;
  value: any;
  description: string;
}
