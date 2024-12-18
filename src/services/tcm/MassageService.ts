import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MeridianService, IAcupoint } from './MeridianService';
import { injectable, inject } from 'inversify';

export interface IMassageTechnique {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: {
    chinese: string;
    pinyin: string;
    english: string;
  };
  /** description 的描述 */
    description: string;
  /** method 的描述 */
    method: string;
  /** force 的描述 */
    force: "light" | "medium" | "strong";
  /** rhythm 的描述 */
    rhythm: "medium" | "slow" | "fast";
  /** duration 的描述 */
    duration: string;
  /** indications 的描述 */
    indications: string[];
  /** contraindications 的描述 */
    contraindications: string[];
  /** precautions 的描述 */
    precautions: string[];
  /** videoUrl 的描述 */
    videoUrl?: undefined | string;
  /** imageUrls 的描述 */
    imageUrls?: undefined | string[];
}

export interface IMassagePoint {
  /** acupoint 的描述 */
    acupoint: IAcupoint;
  /** techniques 的描述 */
    techniques: Array{
    technique: MassageTechnique;
    duration: string;
    notes: string;
  }>;
  sequence: number;
}

export interface IMassageRoutine {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** target 的描述 */
    target: {
    conditions: string;
    symptoms: string;
    meridians: string;
  };
  /** duration 的描述 */
    duration: string;
  /** frequency 的描述 */
    frequency: string;
  /** points 的描述 */
    points: IMassagePoint[];
  /** precautions 的描述 */
    precautions: string[];
  /** benefits 的描述 */
    benefits: string[];
  /** contraindications 的描述 */
    contraindications: string[];
}

@injectable()
export class MassageService {
  private techniques: Map<string, IMassageTechnique> = new Map();
  private routines: Map<string, IMassageRoutine> = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private cacheManager: CacheManager,
    @inject() private meridianService: MeridianService,
  ) {
    this.initializeData();
  }

  /**
   * 初始化数据
   */
  private async initializeData(): Promise<void> {
    try {
      const [cachedTechniques, cachedRoutines] = await Promise.all([
        this.cacheManager.get('massage:techniques'),
        this.cacheManager.get('massage:routines'),
      ]);

      if (cachedTechniques && cachedRoutines) {
        this.techniques = new Map(Object.entries(cachedTechniques));
        this.routines = new Map(Object.entries(cachedRoutines));
      } else {
        await Promise.all([this.loadTechniquesFromDB(), this.loadRoutinesFromDB()]);
      }

      this.logger.info('按摩指导数据初始化成功');
    } catch (error) {
      this.logger.error('按摩指导数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 获取按摩手法
   */
  public getTechnique(techniqueId: string): IMassageTechnique | undefined {
    return this.techniques.get(techniqueId);
  }

  /**
   * 获取所有按摩手法
   */
  public getAllTechniques(): IMassageTechnique[] {
    return Array.from(this.techniques.values());
  }

  /**
   * 获取按摩方案
   */
  public getRoutine(routineId: string): IMassageRoutine | undefined {
    return this.routines.get(routineId);
  }

  /**
   * 搜索按摩方案
   */
  public searchRoutines(query: {
    conditions?: string[];
    symptoms?: string[];
    meridians?: string[];
  }): IMassageRoutine[] {
    return Array.from(this.routines.values()).filter(routine => {
      if (query.conditions) {
        return query.conditions.some(condition => routine.target.conditions.includes(condition));
      }

      if (query.symptoms) {
        return query.symptoms.some(symptom => routine.target.symptoms.includes(symptom));
      }

      if (query.meridians) {
        return query.meridians.some(meridian => routine.target.meridians.includes(meridian));
      }

      return true;
    });
  }

  /**
   * 创建个性化按摩方案
   */
  public async createPersonalizedRoutine(
    conditions: string[],
    symptoms: string[],
    preferences: {
      duration?: string;
      force?: IMassageTechnique['force'];
      excludedTechniques?: string[];
    } = {},
  ): Promise<IMassageRoutine> {
    try {
      // 选择相关穴位
      const relevantPoints = await this.selectRelevantPoints(conditions, symptoms);

      // 选择适合的按摩手法
      const selectedTechniques = this.selectTechniques(relevantPoints, preferences);

      // 生成按摩序列
      const massagePoints = this.createMassageSequence(relevantPoints, selectedTechniques);

      // 创建方案
      const routine: IMassageRoutine = {
        id: Date.now().toString(),
        name: `个性化按摩方案-${new Date().toISOString().split('T')[0]}`,
        description: `针对${conditions.join('、')}的个性化按摩方案`,
        target: {
          conditions,
          symptoms,
          meridians: Array.from(new Set(relevantPoints.map(p => p.meridianId))),
        },
        duration: preferences.duration || '20-30分钟',
        frequency: '每日1-2次',
        points: massagePoints,
        precautions: this.generatePrecautions(massagePoints),
        benefits: this.generateBenefits(conditions, symptoms),
        contraindications: this.generateContraindications(massagePoints),
      };

      // 保存方案
      await this.saveRoutine(routine);

      return routine;
    } catch (error) {
      this.logger.error('创建个性化按摩方案失败', error);
      throw error;
    }
  }

  /**
   * 选择相关穴位
   */
  private async selectRelevantPoints(
    conditions: string[],
    symptoms: string[],
  ): Promise<IAcupoint[]> {
    const points = new Set<IAcupoint>();

    // 根据症状查找相关穴位
    const symptomPoints = await this.meridianService.searchAcupoints({
      indications: symptoms,
    });
    symptomPoints.forEach(point => points.add(point));

    // 根据病症查找相关穴位
    const conditionPoints = await this.meridianService.searchAcupoints({
      indications: conditions,
    });
    conditionPoints.forEach(point => points.add(point));

    return Array.from(points);
  }

  /**
   * 选择按摩手法
   */
  private selectTechniques(
    points: IAcupoint[],
    preferences: {
      force?: IMassageTechnique['force'];
      excludedTechniques?: string[];
    },
  ): IMassageTechnique[] {
    return Array.from(this.techniques.values()).filter(technique => {
      // 检查力度偏好
      if (preferences.force && technique.force !== preferences.force) {
        return false;
      }

      // 检查排除的手法
      if (preferences.excludedTechniques?.includes(technique.id)) {
        return false;
      }

      // 检查是否适用于选中的穴位
      return points.some(point =>
        technique.indications.some(indication => point.properties.indications.includes(indication)),
      );
    });
  }

  /**
   * 创建按摩序列
   */
  private createMassageSequence(
    points: IAcupoint[],
    techniques: IMassageTechnique[],
  ): IMassagePoint[] {
    return points.map((point, index) => ({
      acupoint: point,
      techniques: techniques
        .filter(technique =>
          technique.indications.some(indication =>
            point.properties.indications.includes(indication),
          ),
        )
        .map(technique => ({
          technique,
          duration: '1-2分钟',
          notes: '',
        })),
      sequence: index + 1,
    }));
  }

  /**
   * 生成注意事项
   */
  private generatePrecautions(points: IMassagePoint[]): string[] {
    const precautions = new Set<string>();

    // 收集所有穴位和手法的注意事项
    for (const point of points) {
      point.acupoint.needling.precautions.forEach(p => precautions.add(p));
      point.techniques.forEach(t => t.technique.precautions.forEach(p => precautions.add(p)));
    }

    return Array.from(precautions);
  }

  /**
   * 生成预期效果
   */
  private generateBenefits(conditions: string[], symptoms: string[]): string[] {
    // 根据病症和症状生成预期效果
    return ['改善症状', '促进气血运行', '调节身体机能', '提高免疫力'];
  }

  /**
   * 生成禁忌症
   */
  private generateContraindications(points: IMassagePoint[]): string[] {
    const contraindications = new Set<string>();

    // 收集所有穴位和手法的禁忌症
    for (const point of points) {
      point.acupoint.properties.contraindications.forEach(c => contraindications.add(c));
      point.techniques.forEach(t =>
        t.technique.contraindications.forEach(c => contraindications.add(c)),
      );
    }

    return Array.from(contraindications);
  }

  /**
   * 从数据库加载按摩手法
   */
  private async loadTechniquesFromDB(): Promise<void> {
    // 实现从数据库加载按摩手法的逻辑
  }

  /**
   * 从数据库加载按摩方案
   */
  private async loadRoutinesFromDB(): Promise<void> {
    // 实现从数据库加载按摩方案的逻辑
  }

  /**
   * 保存按摩方案
   */
  private async saveRoutine(routine: IMassageRoutine): Promise<void> {
    try {
      // 保存到数据库
      this.logger.info(`保存按摩方案: ${routine.id}`);
    } catch (error) {
      this.logger.error('保存按摩方案失败', error);
      throw error;
    }
  }
}
