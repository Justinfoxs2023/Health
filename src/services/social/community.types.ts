// 社区基础类型
export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'health' | 'fitness' | 'nutrition' | 'mental' | 'general';
  createdAt: Date;
  creatorId: string;
  
  // 社区设置
  settings: {
    privacy: 'public' | 'private' | 'invite-only';
    joinApproval: boolean;
    postApproval: boolean;
    allowedContentTypes: ('text' | 'image' | 'video' | 'link')[];
    rules: string[];
  };

  // 统计信息
  stats: {
    memberCount: number;
    postCount: number;
    activeMembers: number;
    weeklyEngagement: number;
  };

  // 标签和分类
  tags: string[];
  categories: string[];
}

// 社区成员
export interface CommunityMember {
  userId: string;
  communityId: string;
  joinDate: Date;
  role: 'admin' | 'moderator' | 'expert' | 'member';
  
  // 成员状态
  status: 'active' | 'inactive' | 'banned';
  reputation: number;
  
  // 贡献统计
  contributions: {
    posts: number;
    comments: number;
    likes: number;
    helped: number;
  };

  // 专业认证(专家用户)
  certification?: {
    type: string;
    issuer: string;
    validUntil: Date;
    verificationUrl: string;
  };
}

// 社区内容
export interface CommunityContent {
  id: string;
  communityId: string;
  authorId: string;
  type: 'post' | 'question' | 'event' | 'article';
  createdAt: Date;
  updatedAt: Date;

  // 内容主体
  content: {
    title: string;
    body: string;
    media?: Array<{
      type: 'image' | 'video';
      url: string;
      thumbnail?: string;
    }>;
    tags: string[];
  };

  // 互动数据
  engagement: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
  };

  // 内容状态
  status: 'draft' | 'pending' | 'published' | 'archived' | 'removed';
  moderationStatus?: {
    reviewed: boolean;
    reviewerId?: string;
    decision?: 'approved' | 'rejected';
    reason?: string;
  };
}

// 活动管理
export interface CommunityEvent {
  id: string;
  communityId: string;
  organizerId: string;
  type: 'offline' | 'online' | 'hybrid';
  
  // 活动信息
  info: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    timezone: string;
    location?: {
      online?: {
        platform: string;
        link: string;
        password?: string;
      };
      offline?: {
        address: string;
        city: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
      };
    };
  };

  // 参与管理
  participation: {
    maxParticipants?: number;
    currentParticipants: number;
    registrationDeadline: Date;
    requirements?: string[];
    fee?: {
      amount: number;
      currency: string;
      refundPolicy?: string;
    };
  };

  // 活动状态
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: Array<{
    userId: string;
    status: 'registered' | 'attended' | 'cancelled';
    registrationTime: Date;
  }>;
}

// 专家问答
export interface ExpertQA {
  id: string;
  communityId: string;
  questionerId: string;
  expertId?: string;
  
  // 问题详情
  question: {
    title: string;
    content: string;
    topics: string[];
    attachments?: Array<{
      type: string;
      url: string;
    }>;
  };

  // 回答管理
  answers: Array<{
    id: string;
    expertId: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    accepted: boolean;
    votes: number;
    comments: Array<{
      userId: string;
      content: string;
      createdAt: Date;
    }>;
  }>;

  // 问答状态
  status: 'open' | 'answered' | 'resolved' | 'closed';
  bounty?: {
    amount: number;
    expiresAt: Date;
    awarded: boolean;
  };
}

// 积分奖励系统
export interface RewardSystem {
  userId: string;
  totalPoints: number;
  level: number;
  
  // 积分历史
  history: Array<{
    timestamp: Date;
    action: string;
    points: number;
    balance: number;
    reference: {
      type: string;
      id: string;
    };
  }>;

  // 成就系统
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    progress: number;
    rewards: {
      points: number;
      badges?: string[];
    };
  }>;

  // 等级特权
  privileges: Array<{
    level: number;
    features: string[];
    unlocked: boolean;
  }>;
} 