// 社区功能数据类型定义
interface CommunityTypes {
  // 用户社区类型
  UserProfile {
    userId: string;
    nickname: string;
    avatar: string;
    badges: Badge[];
    healthStats: HealthStatistics;
    posts: Post[];
  }
  
  // 内容发布类型
  Post {
    id: string;
    type: 'experience' | 'recipe' | 'exercise';
    content: {
      text: string;
      media: Media[];
    };
    interactions: {
      likes: number;
      comments: Comment[];
      shares: number;
    };
    tags: string[];
  }
} 