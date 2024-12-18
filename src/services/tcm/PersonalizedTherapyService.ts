import { ConstitutionAnalysisService } from './ConstitutionAnalysisService';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MeridianMapService } from './MeridianMapService';
import { OpenAIService } from '../ai/OpenAIService';
import { injectable, inject } from 'inversify';

export interface ITherapyPlan {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** constitution 的描述 */
    constitution: {
    primaryType: string;
    secondaryTypes: string;
    analysis: {
      strengths: string;
      weaknesses: string;
      healthRisks: string;
    };
  };
  /** goals 的描述 */
    goals: string[];
  /** duration 的描述 */
    duration: string;
  /** schedule 的描述 */
    schedule: Array<{
    period: string;
    focus: string[];
    activities: Array<{
      type: string;
      name: string;
      description: string;
      frequency: string;
      duration: string;
      precautions: string[];
    }>;
  }>;
  /** diet 的描述 */
    diet: {
    principles: string[];
    recommendations: Array<{
      category: string;
      items: string[];
      frequency: string;
      notes: string[];
    }>;
    restrictions: string[];
    recipes: Array<{
      name: string;
      ingredients: string[];
      preparation: string;
      benefits: string[];
    }>;
  };
  /** lifestyle 的描述 */
    lifestyle: {
    dailyRoutine: Array<{
      time: string;
      activity: string;
      duration: string;
      notes: string[];
    }>;
    environment: {
      living: string[];
      working: string[];
      sleeping: string[];
    };
    habits: {
      promote: string[];
      avoid: string[];
    };
  };
  /** exercises 的描述 */
    exercises: Array<{
    name: string;
    type: string;
    description: string;
    steps: string[];
    duration: string;
    frequency: string;
    benefits: string[];
    precautions: string[];
    variations: Array<{
      name: string;
      description: string;
      suitability: string[];
    }>;
  }>;
  /** acupoints 的描述 */
    acupoints: Array<{
    point: string;
    method: string;
    timing: string;
    duration: string;
    frequency: string;
    benefits: string[];
  }>;
  /** herbs 的描述 */
    herbs: Array<{
    name: string;
    form: string;
    dosage: string;
    timing: string;
    duration: string;
    benefits: string[];
    contraindications: string[];
  }>;
  /** progress 的描述 */
    progress: {
    checkpoints: Array<{
      timing: string;
      metrics: string[];
      expectations: string[];
    }>;
    adjustments: Array<{
      condition: string;
      modifications: string[];
    }>;
  };
}

export interface ITherapySession {
  /** id 的描述 */
    id: string;
  /** planId 的描述 */
    planId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: string;
  /** duration 的描述 */
    duration: number;
  /** activities 的描述 */
    activities: Array{
    name: string;
    duration: number;
    notes: string;
  }>;
  feedback: {
    effectiveness: number;
    comfort: number;
    difficulty: number;
    notes: string[];
  };
  measurements?: Record<string, number>;
  nextSteps: string[];
}

@injectable()
export class PersonalizedTherapyService {
  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private openAIService: OpenAIService,
    @inject() private eventBus: EventBus,
    @inject()
    private constitutionService: ConstitutionAnalysisService,
    @inject()
    private meridianService: MeridianMapService,
  ) {}

  /**
   * 创建调养方案
   */
  public async createTherapyPlan(
    userId: string,
    options: {
      goals: string[];
      duration: string;
      preferences?: {
        dietaryRestrictions?: string[];
        exercisePreferences?: string[];
        timeAvailability?: string[];
      };
      healthConditions?: string[];
    },
  ): Promise<ITherapyPlan> {
    try {
      // 获取体质分析
      const constitution = await this.getLatestConstitutionAnalysis(userId);

      // 生成调养方案
      const plan = await this.generateTherapyPlan(constitution, options);

      // 保存方案
      await this.databaseService.insert('therapy_plans', plan);

      // 发布事件
      this.eventBus.publish('therapy.plan.created', {
        userId,
        planId: plan.id,
      });

      return plan;
    } catch (error) {
      this.logger.error('创建调养方案失败', error);
      throw error;
    }
  }

  /**
   * 更新调养方案
   */
  public async updateTherapyPlan(
    planId: string,
    updates: {
      goals?: string[];
      activities?: Array<{
        type: string;
        name: string;
        changes: any;
      }>;
      progress?: {
        achievements: string[];
        challenges: string[];
      };
    },
  ): Promise<ITherapyPlan> {
    try {
      const plan = await this.databaseService.findOne('therapy_plans', { id: planId });

      if (!plan) {
        throw new Error('调养方案不存在');
      }

      // 更新目标
      if (updates.goals) {
        plan.goals = updates.goals;
      }

      // 更新活动
      if (updates.activities) {
        for (const activity of updates.activities) {
          this.updatePlanActivity(plan, activity);
        }
      }

      // 调整进度计划
      if (updates.progress) {
        this.adjustProgress(plan, updates.progress);
      }

      // 保存更新
      await this.databaseService.update('therapy_plans', { id: planId }, plan);

      // 发布事件
      this.eventBus.publish('therapy.plan.updated', {
        planId,
        updates,
      });

      return plan;
    } catch (error) {
      this.logger.error('更新调养方案失败', error);
      throw error;
    }
  }

  /**
   * 记录调养会话
   */
  public async recordTherapySession(
    planId: string,
    session: Omit<ITherapySession, 'id' | 'planId' | 'timestamp'>,
  ): Promise<ITherapySession> {
    try {
      const plan = await this.databaseService.findOne('therapy_plans', { id: planId });

      if (!plan) {
        throw new Error('调养方案不存在');
      }

      // 创建会话记录
      const therapySession: ITherapySession = {
        id: crypto.randomUUID(),
        planId,
        timestamp: new Date(),
        ...session,
      };

      // 保存会话
      await this.databaseService.insert('therapy_sessions', therapySession);

      // 分析反馈并调整方案
      await this.analyzeFeedbackAndAdjustPlan(plan, therapySession);

      // 发布事件
      this.eventBus.publish('therapy.session.recorded', {
        planId,
        sessionId: therapySession.id,
      });

      return therapySession;
    } catch (error) {
      this.logger.error('记录调养会话失败', error);
      throw error;
    }
  }

  /**
   * 获取调养进度
   */
  public async getTherapyProgress(planId: string): Promise<{
    plan: ITherapyPlan;
    sessions: ITherapySession[];
    progress: {
      overall: number;
      byGoal: Record<string, number>;
      metrics: Record<
        string,
        {
          current: number;
          target: number;
          trend: 'improving' | 'stable' | 'declining';
        }
      >;
    };
    analysis: {
      achievements: string[];
      challenges: string[];
      recommendations: string[];
    };
  }> {
    try {
      // 获取方案
      const plan = await this.databaseService.findOne('therapy_plans', { id: planId });

      if (!plan) {
        throw new Error('调养方案不存在');
      }

      // 获取会话记录
      const sessions = await this.databaseService.find(
        'therapy_sessions',
        { planId },
        { sort: { timestamp: 1 } },
      );

      // 计算进度
      const progress = await this.calculateProgress(plan, sessions);

      // 生成分析
      const analysis = await this.generateProgressAnalysis(plan, sessions, progress);

      return {
        plan,
        sessions,
        progress,
        analysis,
      };
    } catch (error) {
      this.logger.error('获取调养进度失败', error);
      throw error;
    }
  }

  /**
   * 获取调养建议
   */
  public async getTherapyRecommendations(
    planId: string,
    context?: {
      season?: string;
      weather?: string;
      recentSymptoms?: string[];
    },
  ): Promise<{
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    adjustments: Array<{
      activity: string;
      changes: string[];
      reason: string;
    }>;
  }> {
    try {
      const plan = await this.databaseService.findOne('therapy_plans', { id: planId });

      if (!plan) {
        throw new Error('调养方案不存在');
      }

      // 获取最近的会话记录
      const recentSessions = await this.databaseService.find(
        'therapy_sessions',
        { planId },
        {
          sort: { timestamp: -1 },
          limit: 5,
        },
      );

      // 生成建议
      const recommendations = await this.generateRecommendations(plan, recentSessions, context);

      return recommendations;
    } catch (error) {
      this.logger.error('获取调养建议失败', error);
      throw error;
    }
  }

  /**
   * 获取最新体质分析
   */
  private async getLatestConstitutionAnalysis(
    userId: string,
  ): Promise<ITherapyPlan['constitution']> {
    try {
      const assessments = await this.constitutionService.getAssessmentHistory(userId);

      if (!assessments.length) {
        throw new Error('未找到体质评估记录');
      }

      const latest = assessments[0];
      return {
        primaryType: latest.primaryType,
        secondaryTypes: latest.results
          .filter(r => r.level === 'secondary')
          .map(r => r.constitutionType),
        analysis: {
          strengths: latest.analysis.strengths,
          weaknesses: latest.analysis.weaknesses,
          healthRisks: latest.analysis.healthRisks,
        },
      };
    } catch (error) {
      this.logger.error('获取最新体质分析失败', error);
      throw error;
    }
  }

  /**
   * 生成调养方案
   */
  private async generateTherapyPlan(
    constitution: ITherapyPlan['constitution'],
    options: {
      goals: string[];
      duration: string;
      preferences?: {
        dietaryRestrictions?: string[];
        exercisePreferences?: string[];
        timeAvailability?: string[];
      };
      healthConditions?: string[];
    },
  ): Promise<ITherapyPlan> {
    try {
      // 使用AI生成初始方案
      const prompt = this.buildTherapyPlanPrompt(constitution, options);

      const planTemplate = await this.openAIService.generateText(prompt);
      const plan = this.parsePlanTemplate(planTemplate);

      // 补充穴位信息
      plan.acupoints = await this.enrichAcupointDetails(plan.acupoints);

      return plan;
    } catch (error) {
      this.logger.error('生成调养方案失败', error);
      throw error;
    }
  }

  /**
   * 更新方案活动
   */
  private updatePlanActivity(
    plan: ITherapyPlan,
    activity: {
      type: string;
      name: string;
      changes: any;
    },
  ): void {
    switch (activity.type) {
      case 'exercise':
        this.updateExercise(plan, activity);
        break;
      case 'diet':
        this.updateDiet(plan, activity);
        break;
      case 'lifestyle':
        this.updateLifestyle(plan, activity);
        break;
      case 'acupoint':
        this.updateAcupoint(plan, activity);
        break;
      case 'herb':
        this.updateHerb(plan, activity);
        break;
    }
  }

  /**
   * 更新运动
   */
  private updateExercise(
    plan: ITherapyPlan,
    activity: {
      name: string;
      changes: any;
    },
  ): void {
    const exercise = plan.exercises.find(e => e.name === activity.name);
    if (exercise) {
      Object.assign(exercise, activity.changes);
    }
  }

  /**
   * 更新饮食
   */
  private updateDiet(
    plan: ITherapyPlan,
    activity: {
      name: string;
      changes: any;
    },
  ): void {
    const recommendation = plan.diet.recommendations.find(r => r.category === activity.name);
    if (recommendation) {
      Object.assign(recommendation, activity.changes);
    }
  }

  /**
   * 更新生活方式
   */
  private updateLifestyle(
    plan: ITherapyPlan,
    activity: {
      name: string;
      changes: any;
    },
  ): void {
    const routine = plan.lifestyle.dailyRoutine.find(r => r.activity === activity.name);
    if (routine) {
      Object.assign(routine, activity.changes);
    }
  }

  /**
   * 更新穴位
   */
  private updateAcupoint(
    plan: ITherapyPlan,
    activity: {
      name: string;
      changes: any;
    },
  ): void {
    const acupoint = plan.acupoints.find(a => a.point === activity.name);
    if (acupoint) {
      Object.assign(acupoint, activity.changes);
    }
  }

  /**
   * 更新药草
   */
  private updateHerb(
    plan: ITherapyPlan,
    activity: {
      name: string;
      changes: any;
    },
  ): void {
    const herb = plan.herbs.find(h => h.name === activity.name);
    if (herb) {
      Object.assign(herb, activity.changes);
    }
  }

  /**
   * 调整进度
   */
  private adjustProgress(
    plan: ITherapyPlan,
    progress: {
      achievements: string[];
      challenges: string[];
    },
  ): void {
    // 根据进展调整检查点
    plan.progress.checkpoints = plan.progress.checkpoints.map(checkpoint => {
      const relatedAchievements = progress.achievements.filter(a =>
        checkpoint.metrics.some(m => a.includes(m)),
      );

      const relatedChallenges = progress.challenges.filter(c =>
        checkpoint.metrics.some(m => c.includes(m)),
      );

      if (relatedAchievements.length || relatedChallenges.length) {
        checkpoint.expectations = this.adjustExpectations(
          checkpoint.expectations,
          relatedAchievements,
          relatedChallenges,
        );
      }

      return checkpoint;
    });

    // 添加新的调整规则
    progress.challenges.forEach(challenge => {
      const adjustment = {
        condition: challenge,
        modifications: this.generateModifications(challenge),
      };

      if (!plan.progress.adjustments.some(a => a.condition === adjustment.condition)) {
        plan.progress.adjustments.push(adjustment);
      }
    });
  }

  /**
   * 调整期望
   */
  private adjustExpectations(
    expectations: string[],
    achievements: string[],
    challenges: string[],
  ): string[] {
    // 实现期望调整逻辑
    return expectations;
  }

  /**
   * 生成修改建议
   */
  private generateModifications(challenge: string): string[] {
    // 实现修改建议生成逻辑
    return [];
  }

  /**
   * 分析反馈并��整方案
   */
  private async analyzeFeedbackAndAdjustPlan(
    plan: ITherapyPlan,
    session: ITherapySession,
  ): Promise<void> {
    try {
      // 分析反馈
      const analysis = await this.analyzeSessionFeedback(session);

      // 根据分析结果调整方案
      if (analysis.requiresAdjustment) {
        await this.adjustPlanBasedOnFeedback(plan, session, analysis);
      }
    } catch (error) {
      this.logger.error('分析反馈并调整方案失败', error);
      throw error;
    }
  }

  /**
   * 分析会话反馈
   */
  private async analyzeSessionFeedback(session: ITherapySession): Promise<{
    requiresAdjustment: boolean;
    adjustments?: Array<{
      activity: string;
      type: string;
      reason: string;
      suggestion: string;
    }>;
  }> {
    // 实现反馈分析逻辑
    return {
      requiresAdjustment: false,
    };
  }

  /**
   * 根据反馈调整方案
   */
  private async adjustPlanBasedOnFeedback(
    plan: ITherapyPlan,
    session: ITherapySession,
    analysis: {
      adjustments?: Array<{
        activity: string;
        type: string;
        reason: string;
        suggestion: string;
      }>;
    },
  ): Promise<void> {
    if (!analysis.adjustments?.length) return;

    for (const adjustment of analysis.adjustments) {
      const activity = {
        type: adjustment.type,
        name: adjustment.activity,
        changes: this.parseAdjustmentSuggestion(adjustment.suggestion),
      };

      this.updatePlanActivity(plan, activity);
    }
  }

  /**
   * 解析调整建议
   */
  private parseAdjustmentSuggestion(suggestion: string): any {
    // 实现建议解析逻辑
    return {};
  }

  /**
   * 计算进度
   */
  private async calculateProgress(
    plan: ITherapyPlan,
    sessions: ITherapySession[],
  ): Promise<{
    overall: number;
    byGoal: Record<string, number>;
    metrics: Record<
      string,
      {
        current: number;
        target: number;
        trend: 'improving' | 'stable' | 'declining';
      }
    >;
  }> {
    // 实现进度计算逻辑
    return {
      overall: 0,
      byGoal: {},
      metrics: {},
    };
  }

  /**
   * 生成进度分析
   */
  private async generateProgressAnalysis(
    plan: ITherapyPlan,
    sessions: ITherapySession[],
    progress: {
      overall: number;
      byGoal: Record<string, number>;
      metrics: Record<
        string,
        {
          current: number;
          target: number;
          trend: 'improving' | 'stable' | 'declining';
        }
      >;
    },
  ): Promise<{
    achievements: string[];
    challenges: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = this.buildProgressAnalysisPrompt(plan, sessions, progress);

      const analysis = await this.openAIService.generateText(prompt);
      return this.parseProgressAnalysis(analysis);
    } catch (error) {
      this.logger.error('生成进度分析失败', error);
      throw error;
    }
  }

  /**
   * 生成建议
   */
  private async generateRecommendations(
    plan: ITherapyPlan,
    recentSessions: ITherapySession[],
    context?: {
      season?: string;
      weather?: string;
      recentSymptoms?: string[];
    },
  ): Promise<{
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    adjustments: Array<{
      activity: string;
      changes: string[];
      reason: string;
    }>;
  }> {
    try {
      const prompt = this.buildRecommendationsPrompt(plan, recentSessions, context);

      const recommendations = await this.openAIService.generateText(prompt);
      return this.parseRecommendations(recommendations);
    } catch (error) {
      this.logger.error('生成建议失败', error);
      throw error;
    }
  }

  /**
   * 补充穴位详情
   */
  private async enrichAcupointDetails(
    acupoints: ITherapyPlan['acupoints'],
  ): Promise<ITherapyPlan['acupoints']> {
    try {
      return await Promise.all(
        acupoints.map(async acupoint => {
          const details = await this.meridianService.getAcupoint(acupoint.point);

          return {
            ...acupoint,
            benefits: details.functions,
          };
        }),
      );
    } catch (error) {
      this.logger.error('补充穴位详情失败', error);
      return acupoints;
    }
  }

  /**
   * 构建方案生成提示
   */
  private buildTherapyPlanPrompt(
    constitution: ITherapyPlan['constitution'],
    options: {
      goals: string[];
      duration: string;
      preferences?: {
        dietaryRestrictions?: string[];
        exercisePreferences?: string[];
        timeAvailability?: string[];
      };
      healthConditions?: string[];
    },
  ): string {
    return `基于以下信息生成个性化调养方案：

体质特征：
- 主要体质：${constitution.primaryType}
- 次要体质：${constitution.secondaryTypes.join('、')}
- 优势：${constitution.analysis.strengths.join('、')}
- 弱点：${constitution.analysis.weaknesses.join('、')}
- 健康风险：${constitution.analysis.healthRisks.join('、')}

调养目标：
${options.goals.map(g => `- ${g}`).join('\n')}

期望周期：${options.duration}

${
  options.preferences
    ? `个人偏好：
${
  options.preferences.dietaryRestrictions
    ? `- 饮食限制：${options.preferences.dietaryRestrictions.join('、')}`
    : ''
}
${
  options.preferences.exercisePreferences
    ? `- 运动偏好：${options.preferences.exercisePreferences.join('、')}`
    : ''
}
${
  options.preferences.timeAvailability
    ? `- 时间安排：${options.preferences.timeAvailability.join('、')}`
    : ''
}`
    : ''
}

${
  options.healthConditions
    ? `健康状况：
${options.healthConditions.map(c => `- ${c}`).join('\n')}`
    : ''
}

请生成包含以下内容的详细调养方案：
1. 阶段性目标和重点
2. 饮食建议和食谱
3. 生活作息安排
4. 运动锻炼计划
5. 穴位保健方案
6. 中药调理建议
7. 进度跟踪计划`;
  }

  /**
   * 构建进度分析提示
   */
  private buildProgressAnalysisPrompt(
    plan: ITherapyPlan,
    sessions: ITherapySession[],
    progress: {
      overall: number;
      byGoal: Record<string, number>;
      metrics: Record<
        string,
        {
          current: number;
          target: number;
          trend: 'improving' | 'stable' | 'declining';
        }
      >;
    },
  ): string {
    return `分析以下调养进度：

总体进度：${progress.overall}%

目标达成情况：
${Object.entries(progress.byGoal)
  .map(([goal, value]) => `- ${goal}: ${value}%`)
  .join('\n')}

指标趋势：
${Object.entries(progress.metrics)
  .map(([metric, data]) => `- ${metric}: ${data.current}/${data.target} (${data.trend})`)
  .join('\n')}

最近5次反馈：
${sessions
  .slice(0, 5)
  .map(
    s =>
      `- ${s.timestamp.toISOString().split('T')[0]}
  效果：${s.feedback.effectiveness}/10
  舒适度：${s.feedback.comfort}/10
  难度：${s.feedback.difficulty}/10
  备注：${s.feedback.notes.join('、')}`,
  )
  .join('\n')}

请分析：
1. 主要成就
2. 面临挑战
3. 改进建议`;
  }

  /**
   * 构建建议生成提示
   */
  private buildRecommendationsPrompt(
    plan: ITherapyPlan,
    recentSessions: ITherapySession[],
    context?: {
      season?: string;
      weather?: string;
      recentSymptoms?: string[];
    },
  ): string {
    return `基于以下情况生成调养建议：

最近反馈：
${recentSessions
  .map(
    s =>
      `- ${s.timestamp.toISOString().split('T')[0]}
  活动：${s.activities.map(a => a.name).join('、')}
  效果：${s.feedback.effectiveness}/10
  备注：${s.feedback.notes.join('、')}`,
  )
  .join('\n')}

${
  context
    ? `当前情况：
${context.season ? `- 季节：${context.season}` : ''}
${context.weather ? `- 天气：${context.weather}` : ''}
${context.recentSymptoms ? `- 近期症状：${context.recentSymptoms.join('、')}` : ''}`
    : ''
}

请提供：
1. 即时建议
2. 短��调整
3. 长期规划
4. 具体活动调整建议`;
  }

  /**
   * 解析方案模板
   */
  private parsePlanTemplate(template: string): ITherapyPlan {
    // 实现方案解析逻辑
    return {} as ITherapyPlan;
  }

  /**
   * 解析进度分析
   */
  private parseProgressAnalysis(analysis: string): {
    achievements: string[];
    challenges: string[];
    recommendations: string[];
  } {
    // 实现分析解析逻辑
    return {
      achievements: [],
      challenges: [],
      recommendations: [],
    };
  }

  /**
   * 解析建议
   */
  private parseRecommendations(recommendations: string): {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    adjustments: Array<{
      activity: string;
      changes: string[];
      reason: string;
    }>;
  } {
    // 实现建议解析逻辑
    return {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      adjustments: [],
    };
  }
}
