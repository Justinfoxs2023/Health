import { BaseHealthData } from '../../health/types/health-base.types';

// 教育内容
export interface EducationContent extends BaseHealthData {
  title: string;
  category: EducationCategory;
  type: ContentType;
  level: ContentLevel;
  content: {
    summary: string;
    body: string;
    media?: MediaContent[];
    references?: Reference[];
  };
  metadata: ContentMetadata;
  engagement: ContentEngagement;
}

// 学习进度
export interface LearningProgress extends BaseHealthData {
  contentId: string;
  status: LearningStatus;
  progress: number;
  score?: number;
  timeSpent: number;
  lastAccessed: Date;
  notes: Note[];
  achievements: Achievement[];
}

// 学习计划
export interface LearningPlan extends BaseHealthData {
  goals: LearningGoal[];
  schedule: LearningSchedule;
  content: PlannedContent[];
  progress: PlanProgress;
  adaptations: PlanAdaptation[];
}

// 类型定义
export type EducationCategory = 
  | 'disease'
  | 'nutrition'
  | 'exercise'
  | 'mental'
  | 'prevention'
  | 'rehabilitation'
  | 'medication';

export type ContentType = 
  | 'article'
  | 'video'
  | 'quiz'
  | 'interactive'
  | 'assessment';

export type ContentLevel = 
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'professional';

export type LearningStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'paused';

// 接口定义
export interface MediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  duration?: number;
  thumbnail?: string;
  description?: string;
}

export interface Reference {
  title: string;
  authors: string[];
  source: string;
  url?: string;
  date: Date;
}

export interface ContentMetadata {
  author: string;
  reviewedBy?: string;
  lastUpdated: Date;
  version: string;
  tags: string[];
  language: string;
  estimatedTime: number;
}

export interface ContentEngagement {
  views: number;
  completions: number;
  averageRating: number;
  reviews: Review[];
  shares: number;
}

export interface Note {
  content: string;
  timestamp: Date;
  tags?: string[];
  relatedContent?: string;
}

export interface Achievement {
  type: string;
  title: string;
  description: string;
  earnedAt: Date;
  criteria: string[];
}

export interface LearningGoal {
  description: string;
  targetDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'achieved';
  metrics: GoalMetric[];
}

export interface LearningSchedule {
  startDate: Date;
  endDate: Date;
  sessions: ScheduledSession[];
  flexibility: 'strict' | 'moderate' | 'flexible';
}

export interface PlannedContent {
  content: EducationContent;
  order: number;
  prerequisites: string[];
  estimatedDuration: number;
  adaptiveContent?: AdaptiveContent[];
}

export interface PlanProgress {
  overallProgress: number;
  goalAchievement: Record<string, number>;
  timeSpent: number;
  lastActivity: Date;
  nextMilestone: string;
}

export interface PlanAdaptation {
  trigger: AdaptationTrigger;
  changes: ContentAdjustment[];
  appliedAt: Date;
  effectiveness?: number;
}

export interface Review {
  rating: number;
  comment: string;
  userId: string;
  timestamp: Date;
  helpful: number;
}

export interface GoalMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
}

export interface ScheduledSession {
  startTime: Date;
  duration: number;
  contentIds: string[];
  completed: boolean;
  feedback?: SessionFeedback;
}

export interface AdaptiveContent {
  condition: string;
  content: Partial<EducationContent>;
  priority: number;
}

export interface AdaptationTrigger {
  type: 'performance' | 'engagement' | 'feedback' | 'time';
  condition: string;
  threshold: number;
}

export interface ContentAdjustment {
  type: 'add' | 'remove' | 'modify' | 'reorder';
  contentId: string;
  changes: Record<string, any>;
}

export interface SessionFeedback {
  difficulty: number;
  relevance: number;
  engagement: number;
  comments: string;
} 