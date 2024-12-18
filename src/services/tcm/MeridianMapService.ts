import { CacheManager } from '../cache/CacheManager';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IMeridian {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** chineseName 的描述 */
    chineseName: string;
  /** type 的描述 */
    type: regular  /** extraordinary 的描述 */
    /** extraordinary 的描述 */
    extraordinary;
  /** element 的描述 */
    element: string;
  /** organ 的描述 */
    organ: string;
  /** direction 的描述 */
    direction: ascending  /** descending 的描述 */
    /** descending 的描述 */
    descending;
  /** timeRange 的描述 */
    timeRange: {
    start: number;  023
    end: number;  023
  };
  /** description 的描述 */
    description: string;
  /** functions 的描述 */
    functions: string[];
  /** pathways 的描述 */
    pathways: Array<{
    segment: string;
    description: string;
    connections: string[];
  }>;
  /** acupoints 的描述 */
    acupoints: string[]; // 穴位ID列表
}

export interface IAcupoint {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** chineseName 的描述 */
    chineseName: string;
  /** meridianId 的描述 */
    meridianId: string;
  /** location 的描述 */
    location: {
    description: string;
    coordinates: {
      x: number;
      y: number;
      z: number;
    };
    landmarks: string[];
  };
  /** properties 的描述 */
    properties: {
    type: string[];
    depth: string;
    angle: string;
    stimulation: string[];
  };
  /** functions 的描述 */
    functions: string[];
  /** indications 的描述 */
    indications: string[];
  /** contraindications 的描述 */
    contraindications: string[];
  /** combinations 的描述 */
    combinations: Array<{
    points: string[];
    purpose: string;
  }>;
  /** techniques 的描述 */
    techniques: Array<{
    method: string;
    description: string;
    duration: string;
    precautions: string[];
  }>;
}

export interface IMeridianMap {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: front  back  side  3d;
  name: string;
  description: string;
  layers: Array{
    id: string;
    name: string;
    visible: boolean;
    elements: Array{
      type: meridian  acupoint  connection;
      id: string;
      coordinates: {
        start: {
          x: number;
          y: number;
          z: number;
        };
        end?: {
          x: number;
          y: number;
          z?: number;
        };
        points?: Array<{
          x: number;
          y: number;
          z?: number;
        }>;
      };
      style?: {
        color?: string;
        width?: number;
        opacity?: number;
      };
    }>;
  }>;
}

@injectable()
export class MeridianMapService {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private cacheManager: CacheManager,
    @inject() private eventBus: EventBus,
  ) {}

  /**
   * 获取经络信息
   */
  public async getMeridian(id: string): Promise<IMeridian> {
    try {
      // 尝试从缓存获取
      const cacheKey = `meridian:${id}`;
      const cached = await this.cacheManager.get<IMeridian>(cacheKey);
      if (cached) {
        return cached;
      }

      // 从数据库获取
      const meridian = await this.databaseService.findOne('meridians', { id });

      if (!meridian) {
        throw new Error('经络不存在');
      }

      // 缓存结果
      await this.cacheManager.set(cacheKey, meridian, this.CACHE_TTL);

      return meridian;
    } catch (error) {
      this.logger.error('获取经络信息失败', error);
      throw error;
    }
  }

  /**
   * 获取穴位信息
   */
  public async getAcupoint(id: string): Promise<IAcupoint> {
    try {
      const cacheKey = `acupoint:${id}`;
      const cached = await this.cacheManager.get<IAcupoint>(cacheKey);
      if (cached) {
        return cached;
      }

      const acupoint = await this.databaseService.findOne('acupoints', { id });

      if (!acupoint) {
        throw new Error('穴位不存在');
      }

      await this.cacheManager.set(cacheKey, acupoint, this.CACHE_TTL);

      return acupoint;
    } catch (error) {
      this.logger.error('获取穴位信息失败', error);
      throw error;
    }
  }

  /**
   * 获取经络图谱
   */
  public async getMeridianMap(id: string): Promise<IMeridianMap> {
    try {
      const cacheKey = `meridian_map:${id}`;
      const cached = await this.cacheManager.get<IMeridianMap>(cacheKey);
      if (cached) {
        return cached;
      }

      const map = await this.databaseService.findOne('meridian_maps', { id });

      if (!map) {
        throw new Error('经络图谱不存在');
      }

      await this.cacheManager.set(cacheKey, map, this.CACHE_TTL);

      return map;
    } catch (error) {
      this.logger.error('获取经络图谱失败', error);
      throw error;
    }
  }

  /**
   * 搜索穴位
   */
  public async searchAcupoints(
    query: {
      name?: string;
      meridianId?: string;
      functions?: string[];
      indications?: string[];
      type?: string[];
    },
    options: {
      sort?: {
        field: string;
        order: 'asc' | 'desc';
      };
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    items: IAcupoint[];
    total: number;
  }> {
    try {
      const filter: any = {};

      if (query.name) {
        filter.$or = [
          { name: { $regex: query.name, $options: 'i' } },
          { chineseName: { $regex: query.name, $options: 'i' } },
        ];
      }
      if (query.meridianId) {
        filter.meridianId = query.meridianId;
      }
      if (query.functions?.length) {
        filter.functions = { $all: query.functions };
      }
      if (query.indications?.length) {
        filter.indications = { $all: query.indications };
      }
      if (query.type?.length) {
        filter['properties.type'] = { $in: query.type };
      }

      const [items, total] = await Promise.all([
        this.databaseService.find('acupoints', filter, {
          sort: options.sort && {
            [options.sort.field]: options.sort.order === 'asc' ? 1 : -1,
          },
          limit: options.limit,
          skip: options.offset,
        }),
        this.databaseService.count('acupoints', filter),
      ]);

      return { items, total };
    } catch (error) {
      this.logger.error('搜索穴位失败', error);
      throw error;
    }
  }

  /**
   * 获取穴位组合
   */
  public async getAcupointCombinations(purpose: string): Promise<
    Array<{
      points: IAcupoint[];
      purpose: string;
      description: string;
      effectiveness: number;
    }>
  > {
    try {
      // 搜索相关穴位组合
      const combinations = await this.databaseService.find('acupoint_combinations', {
        purpose: { $regex: purpose, $options: 'i' },
      });

      // 获取组合中的穴位详情
      const result = await Promise.all(
        combinations.map(async combination => ({
          points: await Promise.all(combination.pointIds.map(id => this.getAcupoint(id))),
          purpose: combination.purpose,
          description: combination.description,
          effectiveness: combination.effectiveness,
        })),
      );

      return result;
    } catch (error) {
      this.logger.error('获取穴位组合失败', error);
      throw error;
    }
  }

  /**
   * 获取经络循行时间表
   */
  public async getMeridianTimeTable(): Promise<
    Array<{
      meridian: IMeridian;
      timeRange: {
        start: number;
        end: number;
      };
      peakTime: number;
      recommendations: {
        treatment: string[];
        lifestyle: string[];
        precautions: string[];
      };
    }>
  > {
    try {
      const cacheKey = 'meridian:timetable';
      const cached = await this.cacheManager.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      // 获取所有经络
      const meridians = await this.databaseService.find('meridians', { type: 'regular' });

      // 获取时间建议
      const timeRecommendations = await this.databaseService.find(
        'meridian_time_recommendations',
        {},
      );

      // 组合信息
      const timetable = meridians.map(meridian => {
        const recommendations = timeRecommendations.find(r => r.meridianId === meridian.id);

        return {
          meridian,
          timeRange: meridian.timeRange,
          peakTime: meridian.timeRange.start + 1,
          recommendations: recommendations?.recommendations || {
            treatment: [],
            lifestyle: [],
            precautions: [],
          },
        };
      });

      // 按时间排序
      timetable.sort((a, b) => a.timeRange.start - b.timeRange.start);

      await this.cacheManager.set(cacheKey, timetable, this.CACHE_TTL);

      return timetable;
    } catch (error) {
      this.logger.error('获取经络循行时间表失败', error);
      throw error;
    }
  }

  /**
   * 获取穴位治疗方案
   */
  public async getTreatmentPlan(condition: string): Promise<{
    mainPoints: IAcupoint[];
    supportingPoints: IAcupoint[];
    alternatives: IAcupoint[];
    techniques: Array<{
      point: IAcupoint;
      method: string;
      duration: string;
      sequence: number;
    }>;
    frequency: string;
    course: string;
    precautions: string[];
  }> {
    try {
      // 获取治疗方案
      const plan = await this.databaseService.findOne('treatment_plans', {
        condition: { $regex: condition, $options: 'i' },
      });

      if (!plan) {
        throw new Error('未找到相关治疗方案');
      }

      // 获取穴位详情
      const [mainPoints, supportingPoints, alternatives] = await Promise.all([
        Promise.all(plan.mainPointIds.map(id => this.getAcupoint(id))),
        Promise.all(plan.supportingPointIds.map(id => this.getAcupoint(id))),
        Promise.all(plan.alternativePointIds.map(id => this.getAcupoint(id))),
      ]);

      // 获取技术细节
      const techniques = await Promise.all(
        plan.techniques.map(async technique => ({
          point: await this.getAcupoint(technique.pointId),
          method: technique.method,
          duration: technique.duration,
          sequence: technique.sequence,
        })),
      );

      return {
        mainPoints,
        supportingPoints,
        alternatives,
        techniques: techniques.sort((a, b) => a.sequence - b.sequence),
        frequency: plan.frequency,
        course: plan.course,
        precautions: plan.precautions,
      };
    } catch (error) {
      this.logger.error('获取穴位治疗方案失败', error);
      throw error;
    }
  }

  /**
   * 获取经络连接关系
   */
  public async getMeridianConnections(meridianId: string): Promise<
    Array<{
      from: IMeridian;
      to: IMeridian;
      type: string;
      description: string;
      connectionPoints: IAcupoint[];
    }>
  > {
    try {
      // 获取连接关系
      const connections = await this.databaseService.find('meridian_connections', {
        $or: [{ fromMeridianId: meridianId }, { toMeridianId: meridianId }],
      });

      // 获取详细信息
      const result = await Promise.all(
        connections.map(async connection => ({
          from: await this.getMeridian(connection.fromMeridianId),
          to: await this.getMeridian(connection.toMeridianId),
          type: connection.type,
          description: connection.description,
          connectionPoints: await Promise.all(
            connection.connectionPointIds.map(id => this.getAcupoint(id)),
          ),
        })),
      );

      return result;
    } catch (error) {
      this.logger.error('获取经络连接关系失败', error);
      throw error;
    }
  }

  /**
   * 获取穴位定位指南
   */
  public async getAcupointLocationGuide(acupointId: string): Promise<{
    acupoint: IAcupoint;
    landmarks: Array<{
      name: string;
      description: string;
      distance?: string;
      direction?: string;
    }>;
    measurements: Array<{
      reference: string;
      unit: string;
      value: number;
    }>;
    images: Array<{
      url: string;
      type: string;
      description: string;
    }>;
    tips: string[];
  }> {
    try {
      // 获取穴位信息
      const acupoint = await this.getAcupoint(acupointId);

      // 获取定位指南
      const guide = await this.databaseService.findOne('acupoint_location_guides', { acupointId });

      if (!guide) {
        throw new Error('未找到定位指南');
      }

      return {
        acupoint,
        landmarks: guide.landmarks,
        measurements: guide.measurements,
        images: guide.images,
        tips: guide.tips,
      };
    } catch (error) {
      this.logger.error('获取穴位定位指南失败', error);
      throw error;
    }
  }
}
