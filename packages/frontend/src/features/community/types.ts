/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 社区功能数据类型定义
interface ICommunityTypes {
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