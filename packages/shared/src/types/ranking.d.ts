/**
 * @fileoverview TS 文件 ranking.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 方案排序评分
export interface ISolutionScore {
  /** id 的描述 */
  id: string;
  /** solutionId 的描述 */
  solutionId: string;
  /** baseScore 的描述 */
  baseScore: number; // 基础分
  /** qualityScore 的描述 */
  qualityScore: number; // 质量分
  /** popularityScore 的描述 */
  popularityScore: number; // 热度分
  /** activityScore 的描述 */
  activityScore: number; // 活跃度分
  /** finalScore 的描述 */
  finalScore: number; // 最终得分
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 搜索结果评分
export interface ISearchScore extends ISolutionScore {
  /** relevanceScore 的描述 */
  relevanceScore: number; // 相关度分
  /** categoryWeight 的描述 */
  categoryWeight: number; // 分类权重
}

// 评分权重配置
export interface IScoreWeights {
  /** quality 的描述 */
  quality: number; // 质量权重
  /** popularity 的描述 */
  popularity: number; // 热度权重
  /** activity 的描述 */
  activity: number; // 活跃度权重
  /** relevance 的描述 */
  relevance: number; // 搜索相关度权重
}

// 分类权重配置
export interface ICategoryWeights {
  [key: string]: number;
  /** solution 的描述 */
  solution: number; // 方案权重
  /** post 的描述 */
  post: number; // 帖子权重
  /** comment 的描述 */
  comment: number; // 评论权重
}
