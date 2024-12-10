// 方案类型定义
export interface Solution {
  id: string;
  vendorId: string;  // 供应商ID
  title: string;
  description: string;
  type: SolutionType;
  price: number;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  
  // 方案内容
  content: {
    features: string[];     // 功能特点
    usage: string[];       // 使用方法
    notices: string[];     // 注意事项
    faqs: SolutionFAQ[];   // 常见问题
  };
  
  // 统计数据
  stats: {
    views: number;
    collections: number;
    contributions: number;
    rating: number;
  };
  
  // 贡献者列表
  contributors: Contributor[];
  
  createdAt: Date;
  updatedAt: Date;
}

// 方案类型
export enum SolutionType {
  DIET = 'diet',           // 饮食方案
  FITNESS = 'fitness',     // 健身方案
  HEALTH = 'health',      // 保健方案
  REHABILITATION = 'rehabilitation' // 康复方案
}

// 贡献者信息
export interface Contributor {
  userId: string;
  username: string;
  avatar: string;
  contributionPoints: number;
  contributions: Contribution[];
  joinedAt: Date;
}

// 贡献内容
export interface Contribution {
  id: string;
  type: ContributionType;
  content: string;
  status: 'pending' | 'accepted' | 'rejected';
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}

// 贡献类型
export enum ContributionType {
  FEATURE = 'feature',     // 功能补充
  USAGE = 'usage',        // 使用经验
  NOTICE = 'notice',      // 注意事项
  FAQ = 'faq',           // 常见问题
  IMPROVEMENT = 'improvement' // 改进建议
}

// FAQ定义
export interface SolutionFAQ {
  question: string;
  answer: string;
  contributors?: string[]; // 贡献者ID列表
} 