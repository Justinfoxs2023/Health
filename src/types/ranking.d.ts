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
    baseScore: number;  
  /** qualityScore 的描述 */
    qualityScore: number;  
  /** popularityScore 的描述 */
    popularityScore: number;  
  /** activityScore 的描述 */
    activityScore: number;  
  /** finalScore 的描述 */
    finalScore: number;  
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
    quality: number;  
  /** popularity 的描述 */
    popularity: number;  
  /** activity 的描述 */
    activity: number;  
  /** relevance 的描述 */
    relevance: number;  
}

// 分类权重配置
export interface ICategoryWeights {
  /** key 的描述 */
    key: string: /** number 的描述 */
    /** number 的描述 */
    number;
  /** solution 的描述 */
    solution: number;  
  /** post 的描述 */
    post: number;  
  /** comment 的描述 */
    comment: number;  
}
