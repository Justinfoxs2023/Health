import { IBaseHealthData } from '../../health/types/health-base.types';

// 教育内容
export interface IEducationContent extends IBaseHealthData {
  /** title 的描述 */
    title: string;
  /** category 的描述 */
    category: "disease" | "nutrition" | "exercise" | "mental" | "prevention" | "rehabilitation" | "medication";
  /** type 的描述 */
    type: "article" | "video" | "quiz" | "interactive" | "assessment";
  /** level 的描述 */
    level: "beginner" | "intermediate" | "advanced" | "professional";
  /** content 的描述 */
    content: {
    summary: string;
    body: string;
    media?: IMediaContent[];
    references?: IReference[];
  };
  /** metadata 的描述 */
    metadata: IContentMetadata;
  /** engagement 的描述 */
    engagement: IContentEngagement;
}

// 学习进度
export interface ILearningProgress extends IBaseHealthData {
  /** contentId 的描述 */
    contentId: string;
  /** status 的描述 */
    status: "not_started" | "in_progress" | "completed" | "paused";
  /** progress 的描述 */
    progress: number;
  /** score 的描述 */
    score?: undefined | number;
  /** timeSpent 的描述 */
    timeSpent: number;
  /** lastAccessed 的描述 */
    lastAccessed: Date;
  /** notes 的描述 */
    notes: INote[];
  /** achievements 的描述 */
    achievements: IAchievement[];
}

// 学习计划
export interface ILearningPlan extends IBaseHealthData {
  /** goals 的描述 */
    goals: ILearningGoal[];
  /** schedule 的描述 */
    schedule: ILearningSchedule;
  /** content 的描述 */
    content: IPlannedContent[];
  /** progress 的描述 */
    progress: IPlanProgress;
  /** adaptations 的描述 */
    adaptations: IPlanAdaptation[];
}

// 类型定义
export type EducationCategoryType =
  any;

export type ContentType = any;

export type ContentLevelType = any;

export type LearningStatusType = any;

// 接口定义
export interface IMediaContent {
  /** type 的描述 */
    type: image  video  audio;
  url: string;
  duration: number;
  thumbnail: string;
  description: string;
}

export interface IReference {
  /** title 的描述 */
    title: string;
  /** authors 的描述 */
    authors: string;
  /** source 的描述 */
    source: string;
  /** url 的描述 */
    url: string;
  /** date 的描述 */
    date: Date;
}

export interface IContentMetadata {
  /** author 的描述 */
    author: string;
  /** reviewedBy 的描述 */
    reviewedBy: string;
  /** lastUpdated 的描述 */
    lastUpdated: Date;
  /** version 的描述 */
    version: string;
  /** tags 的描述 */
    tags: string;
  /** language 的描述 */
    language: string;
  /** estimatedTime 的描述 */
    estimatedTime: number;
}

export interface IContentEngagement {
  /** views 的描述 */
    views: number;
  /** completions 的描述 */
    completions: number;
  /** averageRating 的描述 */
    averageRating: number;
  /** reviews 的描述 */
    reviews: IReview;
  /** shares 的描述 */
    shares: number;
}

export interface INote {
  /** content 的描述 */
    content: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** tags 的描述 */
    tags: string;
  /** relatedContent 的描述 */
    relatedContent: string;
}

export interface IAchievement {
  /** type 的描述 */
    type: string;
  /** title 的描述 */
    title: string;
  /** description 的描述 */
    description: string;
  /** earnedAt 的描述 */
    earnedAt: Date;
  /** criteria 的描述 */
    criteria: string;
}

export interface ILearningGoal {
  /** description 的描述 */
    description: string;
  /** targetDate 的描述 */
    targetDate: Date;
  /** priority 的描述 */
    priority: high  medium  low;
  status: pending  in_progress  achieved;
  metrics: GoalMetric;
}

export interface ILearningSchedule {
  /** startDate 的描述 */
    startDate: Date;
  /** endDate 的描述 */
    endDate: Date;
  /** sessions 的描述 */
    sessions: IScheduledSession;
  /** flexibility 的描述 */
    flexibility: strict  moderate  flexible;
}

export interface IPlannedContent {
  /** content 的描述 */
    content: IEducationContent;
  /** order 的描述 */
    order: number;
  /** prerequisites 的描述 */
    prerequisites: string;
  /** estimatedDuration 的描述 */
    estimatedDuration: number;
  /** adaptiveContent 的描述 */
    adaptiveContent: IAdaptiveContent;
}

export interface IPlanProgress {
  /** overallProgress 的描述 */
    overallProgress: number;
  /** goalAchievement 的描述 */
    goalAchievement: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
  /** timeSpent 的描述 */
    timeSpent: number;
  /** lastActivity 的描述 */
    lastActivity: Date;
  /** nextMilestone 的描述 */
    nextMilestone: string;
}

export interface IPlanAdaptation {
  /** trigger 的描述 */
    trigger: IAdaptationTrigger;
  /** changes 的描述 */
    changes: IContentAdjustment;
  /** appliedAt 的描述 */
    appliedAt: Date;
  /** effectiveness 的描述 */
    effectiveness: number;
}

export interface IReview {
  /** rating 的描述 */
    rating: number;
  /** comment 的描述 */
    comment: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** helpful 的描述 */
    helpful: number;
}

export interface IGoalMetric {
  /** name 的描述 */
    name: string;
  /** target 的描述 */
    target: number;
  /** current 的描述 */
    current: number;
  /** unit 的描述 */
    unit: string;
}

export interface IScheduledSession {
  /** startTime 的描述 */
    startTime: Date;
  /** duration 的描述 */
    duration: number;
  /** contentIds 的描述 */
    contentIds: string;
  /** completed 的描述 */
    completed: false | true;
  /** feedback 的描述 */
    feedback: ISessionFeedback;
}

export interface IAdaptiveContent {
  /** condition 的描述 */
    condition: string;
  /** content 的描述 */
    content: PartialEducationContent;
  /** priority 的描述 */
    priority: number;
}

export interface IAdaptationTrigger {
  /** type 的描述 */
    type: performance  engagement  feedback  time;
  condition: string;
  threshold: number;
}

export interface IContentAdjustment {
  /** type 的描述 */
    type: add  remove  modify  reorder;
  contentId: string;
  changes: Recordstring, any;
}

export interface ISessionFeedback {
  /** difficulty 的描述 */
    difficulty: number;
  /** relevance 的描述 */
    relevance: number;
  /** engagement 的描述 */
    engagement: number;
  /** comments 的描述 */
    comments: string;
}
