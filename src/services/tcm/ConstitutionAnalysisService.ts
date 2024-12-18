import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { OpenAIService } from '../ai/OpenAIService';
import { injectable, inject } from 'inversify';

export interface IConstitutionQuestion {
  /** id 的描述 */
    id: string;
  /** category 的描述 */
    category: string;
  /** question 的描述 */
    question: string;
  /** options 的描述 */
    options: Array{
    value: string;
    score: number;
    constitutionTypes: Array{
      type: string;
      weight: number;
    }>;
  }>;
}

export interface IConstitutionType {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** characteristics 的描述 */
    characteristics: string;
  /** healthRisks 的描述 */
    healthRisks: string;
  /** lifestyle 的描述 */
    lifestyle: {
    diet: string;
    exercise: string;
    rest: string;
    environment: string;
  };
  /** recommendations 的描述 */
    recommendations: {
    food: string[];
    herbs: string[];
    acupoints: string[];
    exercises: string[];
    lifestyle: string[];
  };
  /** contraindications 的描述 */
    contraindications: string[];
}

export interface IConstitutionAssessment {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** answers 的描述 */
    answers: Array{
    questionId: string;
    answer: string;
    score: number;
  }>;
  results: Array<{
    constitutionType: string;
    score: number;
    percentage: number;
    level: 'primary' | 'secondary' | 'minimal';
  }>;
  primaryType: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    healthRisks: string[];
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
  };
}

@injectable()
export class ConstitutionAnalysisService {
  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private openAIService: OpenAIService,
    @inject() private eventBus: EventBus,
  ) {}

  /**
   * 获取体质评估问题
   */
  public async getQuestions(category?: string): Promise<IConstitutionQuestion[]> {
    try {
      const query: any = {};
      if (category) {
        query.category = category;
      }

      const questions = await this.databaseService.find('constitution_questions', query, {
        sort: { category: 1, id: 1 },
      });

      return questions;
    } catch (error) {
      this.logger.error('获取体质评估问题失败', error);
      throw error;
    }
  }

  /**
   * 提交体质评估
   */
  public async submitAssessment(
    userId: string,
    answers: Array<{
      questionId: string;
      answer: string;
    }>,
  ): Promise<IConstitutionAssessment> {
    try {
      // 获取问题详情
      const questions = await this.getQuestionsByIds(answers.map(a => a.questionId));

      // 计算得分
      const scores = this.calculateScores(answers, questions);

      // 分析体质类型
      const constitutionResults = await this.analyzeConstitution(scores);

      // 生成分析报告
      const analysis = await this.generateAnalysis(constitutionResults, userId);

      // 创建评估记录
      const assessment: IConstitutionAssessment = {
        id: crypto.randomUUID(),
        userId,
        timestamp: new Date(),
        answers: answers.map(answer => ({
          questionId: answer.questionId,
          answer: answer.answer,
          score: this.getAnswerScore(answer, questions),
        })),
        results: constitutionResults,
        primaryType: constitutionResults[0].constitutionType,
        analysis,
      };

      // 保存评估记录
      await this.databaseService.insert('constitution_assessments', assessment);

      // 发布事件
      this.eventBus.publish('constitution.assessed', {
        userId,
        assessmentId: assessment.id,
        primaryType: assessment.primaryType,
      });

      return assessment;
    } catch (error) {
      this.logger.error('提交体质评估失败', error);
      throw error;
    }
  }

  /**
   * 获取体质类型详情
   */
  public async getConstitutionType(typeId: string): Promise<IConstitutionType> {
    try {
      const type = await this.databaseService.findOne('constitution_types', { id: typeId });

      if (!type) {
        throw new Error('体质类型不存在');
      }

      return type;
    } catch (error) {
      this.logger.error('获取体质类型详情失败', error);
      throw error;
    }
  }

  /**
   * 获取用户评估历史
   */
  public async getAssessmentHistory(userId: string): Promise<IConstitutionAssessment[]> {
    try {
      const assessments = await this.databaseService.find(
        'constitution_assessments',
        { userId },
        {
          sort: { timestamp: -1 },
        },
      );

      return assessments;
    } catch (error) {
      this.logger.error('获取用户评估历史失败', error);
      throw error;
    }
  }

  /**
   * 分析体质变化趋势
   */
  public async analyzeConstitutionTrend(userId: string): Promise<{
    trend: Array<{
      timestamp: Date;
      primaryType: string;
      scores: Record<string, number>;
    }>;
    analysis: {
      changes: Array<{
        from: string;
        to: string;
        timestamp: Date;
        possibleReasons: string[];
      }>;
      recommendations: string[];
    };
  }> {
    try {
      // 获取历史评估记录
      const assessments = await this.getAssessmentHistory(userId);

      if (assessments.length < 2) {
        throw new Error('评估记录不足，无法分析趋势');
      }

      // 提取趋势数据
      const trend = assessments.map(assessment => ({
        timestamp: assessment.timestamp,
        primaryType: assessment.primaryType,
        scores: Object.fromEntries(assessment.results.map(r => [r.constitutionType, r.score])),
      }));

      // 分析体质变化
      const changes = [];
      for (let i = 1; i < assessments.length; i++) {
        if (assessments[i].primaryType !== assessments[i - 1].primaryType) {
          changes.push({
            from: assessments[i - 1].primaryType,
            to: assessments[i].primaryType,
            timestamp: assessments[i].timestamp,
            possibleReasons: await this.analyzePossibleReasons(assessments[i - 1], assessments[i]),
          });
        }
      }

      // 生成建议
      const recommendations = await this.generateTrendRecommendations(trend, changes);

      return {
        trend,
        analysis: {
          changes,
          recommendations,
        },
      };
    } catch (error) {
      this.logger.error('分析体质变化趋势失败', error);
      throw error;
    }
  }

  /**
   * 获取体质调理建议
   */
  public async getConstitutionAdvice(assessmentId: string): Promise<{
    lifestyle: string[];
    diet: string[];
    exercise: string[];
    acupoints: string[];
    herbs: string[];
    precautions: string[];
  }> {
    try {
      const assessment = await this.databaseService.findOne('constitution_assessments', {
        id: assessmentId,
      });

      if (!assessment) {
        throw new Error('评估记录不存在');
      }

      // 获取体质类型详情
      const constitutionTypes = await Promise.all(
        assessment.results
          .filter(r => r.level !== 'minimal')
          .map(r => this.getConstitutionType(r.constitutionType)),
      );

      // 生成综合建议
      return this.generateComprehensiveAdvice(constitutionTypes, assessment.results);
    } catch (error) {
      this.logger.error('获取体质调理建议失败', error);
      throw error;
    }
  }

  /**
   * 根据ID获取问题
   */
  private async getQuestionsByIds(ids: string[]): Promise<IConstitutionQuestion[]> {
    try {
      const questions = await this.databaseService.find('constitution_questions', {
        id: { $in: ids },
      });

      if (questions.length !== ids.length) {
        throw new Error('部分问题不存在');
      }

      return questions;
    } catch (error) {
      this.logger.error('获取问题失败', error);
      throw error;
    }
  }

  /**
   * 计算得分
   */
  private calculateScores(
    answers: Array<{
      questionId: string;
      answer: string;
    }>,
    questions: IConstitutionQuestion[],
  ): Record<string, number> {
    const scores: Record<string, number> = {};

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return;

      const option = question.options.find(o => o.value === answer.answer);
      if (!option) return;

      option.constitutionTypes.forEach(type => {
        scores[type.type] = (scores[type.type] || 0) + option.score * type.weight;
      });
    });

    return scores;
  }

  /**
   * 获取答案得分
   */
  private getAnswerScore(
    answer: {
      questionId: string;
      answer: string;
    },
    questions: IConstitutionQuestion[],
  ): number {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return 0;

    const option = question.options.find(o => o.value === answer.answer);
    return option ? option.score : 0;
  }

  /**
   * 分析体质类型
   */
  private async analyzeConstitution(scores: Record<string, number>): Promise<
    Array<{
      constitutionType: string;
      score: number;
      percentage: number;
      level: 'primary' | 'secondary' | 'minimal';
    }>
  > {
    // 计算总分
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

    // 计算每种体质的百分比
    const results = Object.entries(scores).map(([type, score]) => ({
      constitutionType: type,
      score,
      percentage: (score / total) * 100,
      level: 'minimal' as 'primary' | 'secondary' | 'minimal',
    }));

    // 排序并确定级别
    results.sort((a, b) => b.percentage - a.percentage);

    if (results.length > 0) {
      results[0].level = 'primary';

      for (let i = 1; i < results.length; i++) {
        if (results[i].percentage > 30) {
          results[i].level = 'secondary';
        }
      }
    }

    return results;
  }

  /**
   * 生成分析报告
   */
  private async generateAnalysis(
    results: Array<{
      constitutionType: string;
      score: number;
      percentage: number;
      level: 'primary' | 'secondary' | 'minimal';
    }>,
    userId: string,
  ): Promise<IConstitutionAssessment['analysis']> {
    try {
      // 获取体质类型详情
      const constitutionTypes = await Promise.all(
        results
          .filter(r => r.level !== 'minimal')
          .map(r => this.getConstitutionType(r.constitutionType)),
      );

      // 使用AI生成分析
      const prompt = this.buildAnalysisPrompt(constitutionTypes, results);

      const analysis = await this.openAIService.generateText(prompt);
      return this.parseAnalysis(analysis);
    } catch (error) {
      this.logger.error('生成分析报告失败', error);
      throw error;
    }
  }

  /**
   * 分析可能原因
   */
  private async analyzePossibleReasons(
    previousAssessment: IConstitutionAssessment,
    currentAssessment: IConstitutionAssessment,
  ): Promise<string[]> {
    try {
      const prompt = this.buildReasonAnalysisPrompt(previousAssessment, currentAssessment);

      const analysis = await this.openAIService.generateText(prompt);
      return this.parseReasons(analysis);
    } catch (error) {
      this.logger.error('分析可能原因失败', error);
      return [];
    }
  }

  /**
   * 生成趋势建议
   */
  private async generateTrendRecommendations(
    trend: Array<{
      timestamp: Date;
      primaryType: string;
      scores: Record<string, number>;
    }>,
    changes: Array<{
      from: string;
      to: string;
      timestamp: Date;
      possibleReasons: string[];
    }>,
  ): Promise<string[]> {
    try {
      const prompt = this.buildTrendRecommendationPrompt(trend, changes);

      const recommendations = await this.openAIService.generateText(prompt);
      return this.parseRecommendations(recommendations);
    } catch (error) {
      this.logger.error('生成趋势建议失败', error);
      return [];
    }
  }

  /**
   * 生成综合建议
   */
  private generateComprehensiveAdvice(
    types: IConstitutionType[],
    results: Array<{
      constitutionType: string;
      level: 'primary' | 'secondary' | 'minimal';
    }>,
  ): {
    lifestyle: string[];
    diet: string[];
    exercise: string[];
    acupoints: string[];
    herbs: string[];
    precautions: string[];
  } {
    const advice = {
      lifestyle: [] as string[],
      diet: [] as string[],
      exercise: [] as string[],
      acupoints: [] as string[],
      herbs: [] as string[],
      precautions: [] as string[],
    };

    types.forEach(type => {
      const result = results.find(r => r.constitutionType === type.id);
      const weight = result?.level === 'primary' ? 1 : 0.5;

      // 合并建议，避免重复
      this.mergeRecommendations(advice.lifestyle, type.recommendations.lifestyle, weight);
      this.mergeRecommendations(advice.diet, type.recommendations.food, weight);
      this.mergeRecommendations(advice.exercise, type.recommendations.exercises, weight);
      this.mergeRecommendations(advice.acupoints, type.recommendations.acupoints, weight);
      this.mergeRecommendations(advice.herbs, type.recommendations.herbs, weight);
      this.mergeRecommendations(advice.precautions, type.contraindications, weight);
    });

    return advice;
  }

  /**
   * 合并建议
   */
  private mergeRecommendations(target: string[], source: string[], weight: number): void {
    source.forEach(item => {
      if (!target.includes(item)) {
        if (weight === 1) {
          target.unshift(item); // 主要体质的建议放在前面
        } else {
          target.push(item);
        }
      }
    });
  }

  /**
   * 构建分析提示
   */
  private buildAnalysisPrompt(
    types: IConstitutionType[],
    results: Array<{
      constitutionType: string;
      percentage: number;
      level: 'primary' | 'secondary' | 'minimal';
    }>,
  ): string {
    return `基于以下体质评估结果生成分析报告：
体质组成：
${results
  .filter(r => r.level !== 'minimal')
  .map(r => `- ${r.constitutionType}: ${r.percentage.toFixed(1)}%`)
  .join('\n')}

体质特征：
${types
  .map(
    t => `${t.name}:
- 特点：${t.characteristics.join('、')}
- 健康风险：${t.healthRisks.join('、')}`,
  )
  .join('\n\n')}

请分析：
1. 主要优势
2. 潜在弱点
3. 健康风险
4. 改善建议（立即、短期、长期）`;
  }

  /**
   * 构建原因分析提示
   */
  private buildReasonAnalysisPrompt(
    previous: IConstitutionAssessment,
    current: IConstitutionAssessment,
  ): string {
    return `分析体质从${previous.primaryType}变为${current.primaryType}的可能原因：

前次评估结果：
${previous.results.map(r => `${r.constitutionType}: ${r.percentage.toFixed(1)}%`).join('\n')}

当前评估结果：
${current.results.map(r => `${r.constitutionType}: ${r.percentage.toFixed(1)}%`).join('\n')}

请分析导致这种变化的可能原因。`;
  }

  /**
   * 构建趋势建议提示
   */
  private buildTrendRecommendationPrompt(
    trend: Array<{
      timestamp: Date;
      primaryType: string;
      scores: Record<string, number>;
    }>,
    changes: Array<{
      from: string;
      to: string;
      timestamp: Date;
      possibleReasons: string[];
    }>,
  ): string {
    return `基于以下体质变化趋势生成调理建议：

体质变化历程：
${trend.map(t => `${t.timestamp.toISOString().split('T')[0]}: ${t.primaryType}`).join('\n')}

主要变化：
${changes
  .map(
    c => `${c.timestamp.toISOString().split('T')[0]}: ${c.from} -> ${c.to}
可能原因：${c.possibleReasons.join('、')}`,
  )
  .join('\n\n')}

请提供针对性的调理建议。`;
  }

  /**
   * 解析分析报告
   */
  private parseAnalysis(text: string): IConstitutionAssessment['analysis'] {
    // 实现解析逻辑
    return {
      strengths: [],
      weaknesses: [],
      healthRisks: [],
      recommendations: {
        immediate: [],
        shortTerm: [],
        longTerm: [],
      },
    };
  }

  /**
   * 解析原因
   */
  private parseReasons(text: string): string[] {
    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^-\s*/, ''));
  }

  /**
   * 解析建议
   */
  private parseRecommendations(text: string): string[] {
    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^-\s*/, ''));
  }
}
