// 方案排序评分
export interface SolutionScore {
  id: string;
  solutionId: string;
  baseScore: number;      // 基础分
  qualityScore: number;   // 质量分
  popularityScore: number;// 热度分
  activityScore: number;  // 活跃度分
  finalScore: number;     // 最终得分
  updatedAt: Date;
}

// 搜索结果评分
export interface SearchScore extends SolutionScore {
  relevanceScore: number;  // 相关度分
  categoryWeight: number;  // 分类权重
}

// 评分权重配置
export interface ScoreWeights {
  quality: number;     // 质量权重
  popularity: number;  // 热度权重
  activity: number;    // 活跃度权重
  relevance: number;   // 搜索相关度权重
}

// 分类权重配置
export interface CategoryWeights {
  [key: string]: number;
  solution: number;    // 方案权重
  post: number;       // 帖子权重
  comment: number;    // 评论权重
} 