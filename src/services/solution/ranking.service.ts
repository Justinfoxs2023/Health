import { ISolution } from '../../types/solution';
import { ISolutionScore, ISearchScore, IScoreWeights, ICategoryWeights } from '../../types/ranking';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
  private readonly scoreWeights: IScoreWeights = {
    quality: 0.3,
    popularity: 0.3,
    activity: 0.2,
    relevance: 0.2,
  };

  private readonly categoryWeights: ICategoryWeights = {
    solution: 1.0,
    post: 0.8,
    comment: 0.5,
  };

  // 计算方案基础评分
  async calculateSolutionScore(solution: ISolution): Promise<ISolutionScore> {
    const qualityScore = this.calculateQualityScore(solution);
    const popularityScore = this.calculatePopularityScore(solution);
    const activityScore = this.calculateActivityScore(solution);

    const finalScore =
      qualityScore * this.scoreWeights.quality +
      popularityScore * this.scoreWeights.popularity +
      activityScore * this.scoreWeights.activity;

    return {
      id: Date.now().toString(),
      solutionId: solution.id,
      baseScore: (qualityScore + popularityScore + activityScore) / 3,
      qualityScore,
      popularityScore,
      activityScore,
      finalScore,
      updatedAt: new Date(),
    };
  }

  // 计算搜索结果评分
  async calculateSearchScore(solution: ISolution, keyword: string): Promise<ISearchScore> {
    const baseScore = await this.calculateSolutionScore(solution);
    const relevanceScore = this.calculateRelevanceScore(solution, keyword);

    const finalScore =
      baseScore.finalScore * (1 - this.scoreWeights.relevance) +
      relevanceScore * this.scoreWeights.relevance;

    return {
      ...baseScore,
      relevanceScore,
      categoryWeight: this.categoryWeights.solution,
      finalScore,
    };
  }

  private calculateQualityScore(solution: ISolution): number {
    const completenessScore = this.assessCompleteness(solution);
    const contributorScore = this.assessContributors(solution);
    const ratingScore = solution.stats.rating;

    return (completenessScore + contributorScore + ratingScore) / 3;
  }

  private calculatePopularityScore(solution: ISolution): number {
    const viewScore = this.normalizeViews(solution.stats.views);
    const collectionScore = this.normalizeCollections(solution.stats.collections);

    return (viewScore + collectionScore) / 2;
  }

  private calculateActivityScore(solution: ISolution): number {
    const contributionScore = this.normalizeContributions(solution.stats.contributions);
    const recencyScore = this.calculateRecency(solution.updatedAt);

    return (contributionScore + recencyScore) / 2;
  }

  private calculateRelevanceScore(solution: ISolution, keyword: string): number {
    const titleMatch = this.calculateTextMatch(solution.title, keyword);
    const descMatch = this.calculateTextMatch(solution.description, keyword);
    const tagMatch = this.calculateTagMatch(solution.tags, keyword);

    return titleMatch * 0.5 + descMatch * 0.3 + tagMatch * 0.2;
  }

  // 全局搜索排序
  async globalSearch(
    keyword: string,
    contents: Array<{ type: string; content: any }>,
  ): Promise<Array<{ type: string; content: any; score: number }>> {
    const scoredContents = await Promise.all(
      contents.map(async ({ type, content }) => {
        const baseScore =
          type === 'solution'
            ? await this.calculateSearchScore(content, keyword)
            : await this.calculateContentScore(content, keyword);

        return {
          type,
          content,
          score: baseScore.finalScore * this.categoryWeights[type],
        };
      }),
    );

    return scoredContents.sort((a, b) => b.score - a.score);
  }
}
