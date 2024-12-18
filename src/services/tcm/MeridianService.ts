import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IMeridian {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: {
    chinese: string;
    pinyin: string;
    english: string;
  };
  /** category 的描述 */
  category: "regular" | "extraordinary";
  /** element 的描述 */
  element: "wood" | "fire" | "earth" | "metal" | "water";
  /** organ 的描述 */
  organ: string;
  /** direction 的描述 */
  direction: string;
  /** timeRange 的描述 */
  timeRange: {
    start: number; // 0-23
    end: number; // 0-23
  };
  /** description 的描述 */
  description: string;
  /** pathways 的描述 */
  pathways: Array<{
    start: string;
    end: string;
    points: string[];
  }>;
  /** functions 的描述 */
  functions: string[];
  /** indications 的描述 */
  indications: string[];
}

export interface IAcupoint {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: {
    chinese: string;
    pinyin: string;
    english: string;
  };
  /** meridianId 的描述 */
  meridianId: string;
  /** number 的描述 */
  number: number;
  /** location 的描述 */
  location: {
    description: string;
    anatomicalLandmarks: string[];
    measurements: string[];
    coordinates: {
      x: number;
      y: number;
      z: number;
    };
  };
  /** properties 的描述 */
  properties: {
    type: string[];
    actions: string[];
    indications: string[];
    contraindications: string[];
  };
  /** needling 的描述 */
  needling: {
    depth: string;
    angle: string;
    technique: string;
    sensation: string[];
    precautions: string[];
  };
  /** combinations 的描述 */
  combinations: Array<{
    points: string[];
    purpose: string;
  }>;
  /** research 的描述 */
  research: Array<{
    title: string;
    findings: string;
    reference: string;
  }>;
}

@injectable()
export class MeridianService {
  private meridians: Map<string, IMeridian> = new Map();
  private acupoints: Map<string, IAcupoint> = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private cacheManager: CacheManager,
  ) {
    this.initializeData();
  }

  /**
   * 初始化数据
   */
  private async initializeData(): Promise<void> {
    try {
      const [cachedMeridians, cachedAcupoints] = await Promise.all([
        this.cacheManager.get('meridian:meridians'),
        this.cacheManager.get('meridian:acupoints'),
      ]);

      if (cachedMeridians && cachedAcupoints) {
        this.meridians = new Map(Object.entries(cachedMeridians));
        this.acupoints = new Map(Object.entries(cachedAcupoints));
      } else {
        await Promise.all([this.loadMeridiansFromDB(), this.loadAcupointsFromDB()]);
      }

      this.logger.info('��络图谱数据初始化成功');
    } catch (error) {
      this.logger.error('经络图谱数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 获取经络信息
   */
  public getMeridian(meridianId: string): IMeridian | undefined {
    return this.meridians.get(meridianId);
  }

  /**
   * 获取所有经络
   */
  public getAllMeridians(): IMeridian[] {
    return Array.from(this.meridians.values());
  }

  /**
   * 获取穴位信息
   */
  public getAcupoint(acupointId: string): IAcupoint | undefined {
    return this.acupoints.get(acupointId);
  }

  /**
   * 获取经络穴位
   */
  public getMeridianAcupoints(meridianId: string): IAcupoint[] {
    return Array.from(this.acupoints.values())
      .filter(point => point.meridianId === meridianId)
      .sort((a, b) => a.number - b.number);
  }

  /**
   * 搜索穴位
   */
  public searchAcupoints(query: {
    name?: string;
    properties?: string[];
    indications?: string[];
  }): IAcupoint[] {
    return Array.from(this.acupoints.values()).filter(point => {
      if (query.name) {
        const searchName = query.name.toLowerCase();
        return (
          point.name.chinese.includes(query.name) ||
          point.name.pinyin.toLowerCase().includes(searchName) ||
          point.name.english.toLowerCase().includes(searchName)
        );
      }

      if (query.properties) {
        return query.properties.every(prop => point.properties.type.includes(prop));
      }

      if (query.indications) {
        return query.indications.some(indication =>
          point.properties.indications.includes(indication),
        );
      }

      return true;
    });
  }

  /**
   * 获取穴位组合
   */
  public getAcupointCombinations(indication: string): Array<{
    points: IAcupoint[];
    purpose: string;
  }> {
    const combinations: Array<{
      points: IAcupoint[];
      purpose: string;
    }> = [];

    for (const point of this.acupoints.values()) {
      for (const combo of point.combinations) {
        if (combo.purpose.includes(indication)) {
          const points = combo.points
            .map(id => this.acupoints.get(id))
            .filter((p): p is IAcupoint => p !== undefined);

          if (points.length === combo.points.length) {
            combinations.push({
              points,
              purpose: combo.purpose,
            });
          }
        }
      }
    }

    return combinations;
  }

  /**
   * 获取经络循行时间
   */
  public getMeridianTimeTable(): Array<{
    meridian: IMeridian;
    timeRange: string;
  }> {
    return Array.from(this.meridians.values())
      .sort((a, b) => a.timeRange.start - b.timeRange.start)
      .map(meridian => ({
        meridian,
        timeRange: `${meridian.timeRange.start
          .toString()
          .padStart(2, '0')}:00-${meridian.timeRange.end.toString().padStart(2, '0')}:00`,
      }));
  }

  /**
   * 获取当前活跃经络
   */
  public getCurrentActiveMeridian(): IMeridian | undefined {
    const now = new Date();
    const hour = now.getHours();

    return Array.from(this.meridians.values()).find(
      meridian => hour >= meridian.timeRange.start && hour < meridian.timeRange.end,
    );
  }

  /**
   * 获取穴位研究数据
   */
  public getAcupointResearch(acupointId: string): IAcupoint['research'] {
    const point = this.acupoints.get(acupointId);
    return point?.research || [];
  }

  /**
   * 获取相关穴位
   */
  public getRelatedAcupoints(acupointId: string): IAcupoint[] {
    const point = this.acupoints.get(acupointId);
    if (!point) return [];

    const relatedPoints = new Set<string>();

    // 添加同经穴位
    for (const p of this.acupoints.values()) {
      if (p.meridianId === point.meridianId && p.id !== point.id) {
        relatedPoints.add(p.id);
      }
    }

    // 添加配穴组合中的穴位
    for (const combo of point.combinations) {
      for (const id of combo.points) {
        if (id !== point.id) {
          relatedPoints.add(id);
        }
      }
    }

    return Array.from(relatedPoints)
      .map(id => this.acupoints.get(id))
      .filter((p): p is IAcupoint => p !== undefined);
  }

  /**
   * 从数据库加载经络数据
   */
  private async loadMeridiansFromDB(): Promise<void> {
    // 实现从数据库加载经络数据的逻辑
  }

  /**
   * 从数据库加载穴位数据
   */
  private async loadAcupointsFromDB(): Promise<void> {
    // 实现从数据库加载穴位数据的逻辑
  }
}
