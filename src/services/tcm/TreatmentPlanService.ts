import { CacheManager } from '../cache/CacheManager';
import { ConstitutionService, IAssessmentResult } from './ConstitutionService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface ITreatmentMethod {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** category 的描述 */
    category: acupuncture  massage  herbs  diet  exercise;
  description: string;
  indications: string;
  contraindications: string;
  instructions: string;
  precautions: string;
  evidence: {
    research: string;
    clinicalTrials: string;
  };
}

export interface ITreatmentPlan {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** createdAt 的描述 */
    createdAt: Date;
  /** updatedAt 的描述 */
    updatedAt: Date;
  /** constitutionAssessment 的描述 */
    constitutionAssessment: IAssessmentResult;
  /** mainSymptoms 的描述 */
    mainSymptoms: string;
  /** goals 的描述 */
    goals: string;
  /** duration 的描述 */
    duration: number;  
  /** methods 的描述 */
    methods: Array{
    method: TreatmentMethod;
    frequency: string;
    duration: string;
    notes: string;
  }>;
  dietaryAdvice: {
    recommendations: string[];
    restrictions: string[];
    recipes: string[];
  };
  lifestyleAdvice: {
    daily: string[];
    exercise: string[];
    rest: string[];
    environment: string[];
  };
  progress: Array<{
    date: Date;
    symptoms: Array<{
      name: string;
      severity: number;
    }>;
    notes: string;
  }>;
}

@injectable()
export class TreatmentPlanService {
  private methods: Map<string, ITreatmentMethod> = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private cacheManager: CacheManager,
    @inject() private constitutionService: ConstitutionService,
  ) {
    this.initializeData();
  }

  /**
   * 初始化数据
   */
  private async initializeData(): Promise<void> {
    try {
      const cachedMethods = await this.cacheManager.get('treatment:methods');
      if (cachedMethods) {
        this.methods = new Map(Object.entries(cachedMethods));
      } else {
        await this.loadMethodsFromDB();
      }

      this.logger.info('调理方案数据初始化成功');
    } catch (error) {
      this.logger.error('调理方案数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 创建调理方案
   */
  public async createPlan(
    userId: string,
    assessment: IAssessmentResult,
    symptoms: string[],
    goals: string[],
  ): Promise<ITreatmentPlan> {
    try {
      // 根据体质评估结果和症状选择适合的调理方法
      const selectedMethods = await this.selectTreatmentMethods(assessment, symptoms);

      // 生成调理方案
      const plan: ITreatmentPlan = {
        id: Date.now().toString(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        constitutionAssessment: assessment,
        mainSymptoms: symptoms,
        goals,
        duration: 90, // 默认3个月
        methods: selectedMethods.map(method => ({
          method,
          frequency: this.determineFrequency(method),
          duration: this.determineDuration(method),
          notes: '',
        })),
        dietaryAdvice: this.generateDietaryAdvice(assessment, symptoms),
        lifestyleAdvice: this.generateLifestyleAdvice(assessment, symptoms),
        progress: [],
      };

      // 保存方案
      await this.savePlan(plan);

      // 发布事件
      this.eventBus.publish('treatment.plan.created', {
        userId,
        planId: plan.id,
        timestamp: Date.now(),
      });

      return plan;
    } catch (error) {
      this.logger.error('创建调理方案失败', error);
      throw error;
    }
  }

  /**
   * 选择调理方法
   */
  private async selectTreatmentMethods(
    assessment: IAssessmentResult,
    symptoms: string[],
  ): Promise<ITreatmentMethod[]> {
    const selectedMethods: ITreatmentMethod[] = [];
    const constitutionType = this.constitutionService.getConstitutionType(assessment.mainType);

    if (!constitutionType) {
      throw new Error(`未知的体质类型: ${assessment.mainType}`);
    }

    // 根据体质特点选择方法
    for (const method of this.methods.values()) {
      const isIndicated = method.indications.some(
        indication =>
          constitutionType.characteristics.includes(indication) || symptoms.includes(indication),
      );

      const isContraindicated = method.contraindications.some(
        contraindication =>
          constitutionType.characteristics.includes(contraindication) ||
          symptoms.includes(contraindication),
      );

      if (isIndicated && !isContraindicated) {
        selectedMethods.push(method);
      }
    }

    return selectedMethods;
  }

  /**
   * 确定治疗频率
   */
  private determineFrequency(method: ITreatmentMethod): string {
    switch (method.category) {
      case 'acupuncture':
        return '每周2-3次';
      case 'massage':
        return '每周2-3次';
      case 'herbs':
        return '每日2次';
      case 'diet':
        return '持续';
      case 'exercise':
        return '每日1次';
      default:
        return '按需';
    }
  }

  /**
   * 确定治疗时长
   */
  private determineDuration(method: ITreatmentMethod): string {
    switch (method.category) {
      case 'acupuncture':
        return '每次30分钟';
      case 'massage':
        return '每次20-30分钟';
      case 'herbs':
        return '持续30天后评估';
      case 'diet':
        return '持续';
      case 'exercise':
        return '每次30-45分钟';
      default:
        return '按需';
    }
  }

  /**
   * 生成饮食建议
   */
  private generateDietaryAdvice(
    assessment: IAssessmentResult,
    symptoms: string[],
  ): ITreatmentPlan['dietaryAdvice'] {
    return {
      recommendations: [
        ...assessment.recommendations.diet,
        // 可以根据症状添加更多建议
      ],
      restrictions: [
        // 根据体质和症状生成饮食禁忌
      ],
      recipes: [
        // 推荐适合的食疗方
      ],
    };
  }

  /**
   * 生成生活方式建议
   */
  private generateLifestyleAdvice(
    assessment: IAssessmentResult,
    symptoms: string[],
  ): ITreatmentPlan['lifestyleAdvice'] {
    return {
      daily: [
        ...assessment.recommendations.lifestyle,
        // 可以根据症状添加更多建议
      ],
      exercise: [
        ...assessment.recommendations.exercise,
        // 可以根据症状添加更多建议
      ],
      rest: [
        // 休息建议
      ],
      environment: [
        // 环境调适建议
      ],
    };
  }

  /**
   * 更新进展记录
   */
  public async updateProgress(
    planId: string,
    progress: ITreatmentPlan['progress'][0],
  ): Promise<void> {
    try {
      const plan = await this.getPlan(planId);
      if (!plan) {
        throw new Error(`调理方案不存在: ${planId}`);
      }

      plan.progress.push(progress);
      plan.updatedAt = new Date();

      await this.savePlan(plan);

      this.eventBus.publish('treatment.progress.updated', {
        planId,
        progress,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error('更新进展记录失败', error);
      throw error;
    }
  }

  /**
   * 获取调理方案
   */
  public async getPlan(planId: string): Promise<ITreatmentPlan | null> {
    try {
      // 从数据库获取方案
      return null;
    } catch (error) {
      this.logger.error('获取调理方案失败', error);
      throw error;
    }
  }

  /**
   * 获取用户的所有调理方案
   */
  public async getUserPlans(userId: string): Promise<ITreatmentPlan[]> {
    try {
      // 从数据库获取用户的所有��案
      return [];
    } catch (error) {
      this.logger.error('获取用户调理方案失败', error);
      throw error;
    }
  }

  /**
   * 保存调理方案
   */
  private async savePlan(plan: ITreatmentPlan): Promise<void> {
    try {
      // 保存到数据库
      this.logger.info(`保存调理方案: ${plan.id}`);
    } catch (error) {
      this.logger.error('保存调理方案失败', error);
      throw error;
    }
  }

  /**
   * 从数据库加载调理方法
   */
  private async loadMethodsFromDB(): Promise<void> {
    // 实现从数据库加载调理方法的逻辑
  }

  /**
   * 评估方案效果
   */
  public async evaluatePlanEffectiveness(planId: string): Promise<{
    effectiveness: number;
    improvements: string[];
    recommendations: string[];
  }> {
    try {
      const plan = await this.getPlan(planId);
      if (!plan) {
        throw new Error(`调理方案不存在: ${planId}`);
      }

      // 分析进展记录
      const progressAnalysis = this.analyzeProgress(plan.progress);

      // 生成改进建议
      const recommendations = this.generateRecommendations(plan, progressAnalysis);

      return {
        effectiveness: progressAnalysis.effectiveness,
        improvements: progressAnalysis.improvements,
        recommendations,
      };
    } catch (error) {
      this.logger.error('评估方案效果失败', error);
      throw error;
    }
  }

  /**
   * 分析进展记录
   */
  private analyzeProgress(progress: ITreatmentPlan['progress']): {
    effectiveness: number;
    improvements: string[];
  } {
    if (progress.length < 2) {
      return {
        effectiveness: 0,
        improvements: [],
      };
    }

    // 计算症状改善程度
    const firstRecord = progress[0];
    const lastRecord = progress[progress.length - 1];

    const improvements: string[] = [];
    let totalImprovement = 0;

    for (const firstSymptom of firstRecord.symptoms) {
      const lastSymptom = lastRecord.symptoms.find(s => s.name === firstSymptom.name);

      if (lastSymptom) {
        const improvement = firstSymptom.severity - lastSymptom.severity;
        if (improvement > 0) {
          improvements.push(`${firstSymptom.name}改善了${improvement}级`);
        }
        totalImprovement += improvement;
      }
    }

    const effectiveness = totalImprovement / firstRecord.symptoms.length;

    return {
      effectiveness,
      improvements,
    };
  }

  /**
   * 生成改进建议
   */
  private generateRecommendations(
    plan: ITreatmentPlan,
    analysis: {
      effectiveness: number;
      improvements: string[];
    },
  ): string[] {
    const recommendations: string[] = [];

    if (analysis.effectiveness < 0.3) {
      recommendations.push('建议调整治疗方案');
      recommendations.push('增加随访频率');
    } else if (analysis.effectiveness < 0.6) {
      recommendations.push('继续当前方案，适当加强部分治疗');
    } else {
      recommendations.push('保持当前方案，可以适当调整频率');
    }

    return recommendations;
  }
}
