/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用户档案类型
export interface IUserProfile {
  /** id 的描述 */
    id: string;
  /** basicInfo 的描述 */
    basicInfo: {
    username: string;
    avatar: string;
    bio: string;
    location: string;
    joinDate: Date;
  };

  // 健康标签
  /** healthTags 的描述 */
    healthTags: {
    interests: string[]; // 健康兴趣
    goals: string[]; // 健康目标
    achievements: string[]; // 健康成就
    expertise?: string[]; // 专业领域(适用于专家用户)
  };

  // 社交统计
  /** stats 的描述 */
    stats: {
    followers: number;
    following: number;
    posts: number;
    kudos: number; // 获赞数
    helpfulness: number; // 帮助他人评分
  };

  // 认证信息
  /** verification 的描述 */
    verification?: undefined | { type: "expert" | "trainer" | "nutritionist" | "doctor"; credentials: string[]; verifiedAt: Date; };
}

// 健康圈子类型
export interface IHealthCircle {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: condition  lifestyle  fitness  nutrition;
  name: string;
  description: string;
  avatar: string;

   
  rules: {
    guidelines: string;
    moderation: string;
    privacyLevel: public  private  invitation;
  };

  // 成员管理
  members: {
    total: number;
    admins: string[];
    experts: string[];
    regularMembers: string[];
  };

  // 圈子活动
  activities: {
    weeklyTopics?: string[];
    events?: string[];
    challenges?: string[];
  };

  // 统计信息
  stats: {
    postsCount: number;
    activeMembers: number;
    engagementRate: number;
    topContributors: string[];
  };
}

// 社交内容类型
export interface ISocialPost {
  /** id 的描述 */
    id: string;
  /** author 的描述 */
    author: {
    id: string;
    username: string;
    avatar: string;
    isExpert: boolean;
  };

  // 内容
  /** content 的描述 */
    content: {
    type: 'text' | 'image' | 'video' | 'article' | 'question';
    title?: string;
    body: string;
    media?: Array<{
      url: string;
      type: string;
      description?: string;
    }>;
    tags: string[];
    circle?: string; // 所属圈子
  };

  // 互动数据
  /** engagement 的描述 */
    engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views: number;
  };

  // 元数据
  /** metadata 的描述 */
    metadata: {
    createdAt: Date;
    updatedAt?: Date;
    location?: string;
    visibility: 'public' | 'circle' | 'followers';
    language: string;
  };

  // 专业认证
  /** verification 的描述 */
    verification?: undefined | { factChecked: boolean; expertReviewed: boolean; reviewedBy?: string | undefined; };
}

// 专家问答类型
export interface IExpertQA {
  /** id 的描述 */
    id: string;
  /** question 的描述 */
    question: {
    userId: string;
    title: string;
    description: string;
    tags: string;
    askedAt: Date;
    visibility: public  private;
  };

  // 回答
  /** answers 的描述 */
    answers: Array<{
    expertId: string;
    content: string;
    credentials: string[];
    answeredAt: Date;
    upvotes: number;
    isAccepted: boolean;
    references?: string[];
  }>;

  // 状态
  /** status 的描述 */
    status: {
    isAnswered: boolean;
    isResolved: boolean;
    lastActivityAt: Date;
    viewCount: number;
  };

  // 相关推荐
  /** related 的描述 */
    related?: undefined | { similarQuestions: string[]; recommendedResources: string[]; };
}

// 健康活动类型
export interface IHealthEvent {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: workshop  challenge  seminar  group_activity;
  title: string;
  description: string;

   
  details: {
    startDate: Date;
    endDate: Date;
    location: {
      type: online  offline  hybrid;
      venue: string;
      link: string;
    };
    capacity: number;
    requirements?: string[];
  };

  // 组织者信息
  organizer: {
    id: string;
    name: string;
    type: 'expert' | 'circle' | 'platform';
    contact: string;
  };

  // 参与者
  participants: {
    registered: string[];
    attended?: string[];
    completed?: string[];
  };

  // 活动内容
  content: {
    schedule: Array<{
      time: string;
      activity: string;
      duration: number;
    }>;
    resources?: string[];
    rewards?: {
      type: string;
      description: string;
      criteria: string[];
    };
  };

  // 活动状态
  status: {
    phase: 'upcoming' | 'ongoing' | 'completed';
    registrationOpen: boolean;
    participantCount: number;
    completionRate?: number;
  };
}

// 健康挑战类型
export interface IHealthChallenge {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: personal  group  community;
  title: string;
  description: string;

   
  rules: {
    duration: number;
    startDate: Date;
    endDate: Date;
    goals: Array{
      metric: string;
      target: number;
      unit: string;
    }>;
    restrictions?: string[];
  };

  // 参与要求
  requirements: {
    minParticipants?: number;
    maxParticipants?: number;
    healthConditions?: string[];
    fitnessLevel?: string;
  };

  // 进度追踪
  tracking: {
    metrics: string[];
    frequency: 'daily' | 'weekly' | 'custom';
    verificationMethod: 'self' | 'peer' | 'automated';
    checkpoints?: Date[];
  };

  // 奖励机制
  rewards: {
    type: 'points' | 'badges' | 'certificates' | 'physical';
    tiers: Array<{
      level: string;
      requirements: string[];
      rewards: string[];
    }>;
  };

  // 社交元素
  social: {
    leaderboard: boolean;
    teamBased: boolean;
    discussion: boolean;
    sharing: {
      platforms: string[];
      templates?: string[];
    };
  };

  // 统计数据
  stats: {
    participants: number;
    completionRate: number;
    averageProgress: number;
    topPerformers: string[];
  };
}

// 社交互动类型
export interface ISocialInteraction {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: comment  like  share  save;
  userId: string;
  targetId: string;
  targetType: post  comment  event  challenge;

   
  content: {
    text: string;
    media: Array{
      url: string;
      type: string;
    }>;
    emotion?: string;
  };

  // 元数据
  metadata: {
    createdAt: Date;
    updatedAt?: Date;
    platform?: string;
    visibility: 'public' | 'private';
  };

  // 互动反馈
  feedback?: {
    likes: number;
    replies: number;
    reports: number;
  };
}
