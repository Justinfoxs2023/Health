/**
 * @fileoverview TS 文件 solution.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 方案类型定义
export interface ISolution {
  /** id 的描述 */
  id: string;
  /** vendorId 的描述 */
  vendorId: string; // 供应商ID
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: SolutionType;
  /** price 的描述 */
  price: number;
  /** status 的描述 */
  status: 'draft' | 'published' | 'archived';
  /** tags 的描述 */
  tags: string[];

  // 方案内容
  /** content 的描述 */
  content: {
    features: string[]; // 功能特点
    usage: string[]; // 使用方法
    notices: string[]; // 注意事项
    faqs: ISolutionFAQ[]; // 常见问题
  };

  // 统计数据
  /** stats 的描述 */
  stats: {
    views: number;
    collections: number;
    contributions: number;
    rating: number;
  };

  // 贡献者列表
  /** contributors 的描述 */
  contributors: IContributor[];

  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 方案类型
export enum SolutionType {
  DIET = 'diet', // 饮食方案
  FITNESS = 'fitness', // 健身方案
  HEALTH = 'health', // 保健方案
  REHABILITATION = 'rehabilitation', // 康复方案
}

// 贡献者信息
export interface IContributor {
  /** userId 的描述 */
  userId: string;
  /** username 的描述 */
  username: string;
  /** avatar 的描述 */
  avatar: string;
  /** contributionPoints 的描述 */
  contributionPoints: number;
  /** contributions 的描述 */
  contributions: IContribution[];
  /** joinedAt 的描述 */
  joinedAt: Date;
}

// 贡献内容
export interface IContribution {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: ContributionType;
  /** content 的描述 */
  content: string;
  /** status 的描述 */
  status: 'pending' | 'accepted' | 'rejected';
  /** comments 的描述 */
  comments: string;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 贡献类型
export enum ContributionType {
  FEATURE = 'feature', // 功能补充
  USAGE = 'usage', // 使用经验
  NOTICE = 'notice', // 注意事项
  FAQ = 'faq', // 常见问题
  IMPROVEMENT = 'improvement', // 改进建议
}

// FAQ定义
export interface ISolutionFAQ {
  /** question 的描述 */
  question: string;
  /** answer 的描述 */
  answer: string;
  /** contributors 的描述 */
  contributors?: string[]; // 贡献者ID列表
}
