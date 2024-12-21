import { logger } from '../logger';

/** 运动类型 */
export enum ExerciseType {
  WALKING = 'walking', // 步行
  RUNNING = 'running', // 跑步
  CYCLING = 'cycling', // 骑行
  SWIMMING = 'swimming', // 游泳
  YOGA = 'yoga', // 瑜伽
  STRENGTH = 'strength', // 力量训练
  HIIT = 'hiit', // 高强度间歇训练
  STRETCHING = 'stretching', // 拉伸
  DANCE = 'dance', // 舞蹈
  OTHER = 'other', // 其他
}

/** 运动强度 */
export enum IntensityLevel {
  LOW = 'low', // 低强度
  MODERATE = 'moderate', // 中等强度
  HIGH = 'high', // 高强度
}

/** 运动数据 */
export interface IExerciseData {
  /** 运动类型 */
  type: ExerciseType;
  /** 开始时间 */
  startTime: Date;
  /** 结束时间 */
  endTime: Date;
  /** 运动时长(分钟) */
  duration: number;
  /** 运动强度 */
  intensity: IntensityLevel;
  /** 心率数据 */
  heartRate?: {
    /** 平均心率 */
    average: number;
    /** 最大心率 */
    max: number;
    /** 最小心率 */
    min: number;
    /** 心率区间分布(百分比) */
    zones: {
      easy: number; // 轻松区间
      fatBurn: number; // 燃脂区间
      cardio: number; // 有氧区间
      peak: number; // 峰值区间
    };
  };
  /** 卡路里消耗 */
  caloriesBurned: number;
  /** 步数(适用于步行/跑步) */
  steps?: number;
  /** 距离(米) */
  distance?: number;
  /** 速度数据(米/秒) */
  speed?: {
    /** 平均速度 */
    average: number;
    /** 最大速度 */
    max: number;
    /** 最小速度 */
    min: number;
  };
  /** 配速数据(分钟/公里) */
  pace?: {
    /** 平均配速 */
    average: number;
    /** 最快配速 */
    best: number;
  };
  /** 运动轨迹点 */
  trackPoints?: {
    /** 时间戳 */
    timestamp: Date;
    /** 纬度 */
    latitude: number;
    /** 经度 */
    longitude: number;
    /** 海拔(米) */
    altitude?: number;
    /** 瞬时速度 */
    speed?: number;
    /** 瞬时心率 */
    heartRate?: number;
  }[];
  /** 力量训练数据 */
  strengthData?: {
    /** 训练部位 */
    muscleGroup: string;
    /** 动作名称 */
    exercise: string;
    /** 组数 */
    sets: number;
    /** 每组重复次数 */
    reps: number;
    /** 重量(千克) */
    weight: number;
  }[];
}

/** 运动分析结果 */
export interface IExerciseAnalysis {
  /** 运动总时长(分钟) */
  totalDuration: number;
  /** 总卡路里消耗 */
  totalCaloriesBurned: number;
  /** 运动强度分布 */
  intensityDistribution: {
    low: number;
    moderate: number;
    high: number;
  };
  /** 心率区间分析 */
  heartRateAnalysis?: {
    averageHeartRate: number;
    timeInZones: {
      easy: number;
      fatBurn: number;
      cardio: number;
      peak: number;
    };
  };
  /** 运动表现评估 */
  performanceScore: number;
  /** 改进建议 */
  recommendations: string[];
}

/** 运动服务 */
export class ExerciseService {
  private static instance: ExerciseService;

  private constructor() {}

  /** 获取单例 */
  public static getInstance(): ExerciseService {
    if (!ExerciseService.instance) {
      ExerciseService.instance = new ExerciseService();
    }
    return ExerciseService.instance;
  }

  /** 采集运动数据 */
  public async collectExerciseData(type: ExerciseType, deviceData: any): Promise<IExerciseData> {
    try {
      // 处理设备数据
      const processedData = await this.processDeviceData(type, deviceData);

      // 计算运动指标
      const exerciseMetrics = this.calculateExerciseMetrics(processedData);

      // 构建运动数据
      const exerciseData: IExerciseData = {
        type,
        startTime: processedData.startTime,
        endTime: processedData.endTime,
        duration: this.calculateDuration(processedData.startTime, processedData.endTime),
        intensity: this.determineIntensity(exerciseMetrics),
        caloriesBurned: this.calculateCaloriesBurned(exerciseMetrics),
        ...exerciseMetrics,
      };

      return exerciseData;
    } catch (error) {
      logger.error('Failed to collect exercise data', { error });
      throw error;
    }
  }

  /** 分析运动数据 */
  public analyzeExerciseData(data: IExerciseData[]): IExerciseAnalysis {
    try {
      // 计算总时长和卡路里
      const totalDuration = data.reduce((sum, d) => sum + d.duration, 0);
      const totalCaloriesBurned = data.reduce((sum, d) => sum + d.caloriesBurned, 0);

      // 计算强度分布
      const intensityDistribution = this.calculateIntensityDistribution(data);

      // 分析心率数据
      const heartRateAnalysis = this.analyzeHeartRate(data);

      // 评估运动表现
      const performanceScore = this.calculatePerformanceScore(data);

      // 生成改进建议
      const recommendations = this.generateRecommendations(data);

      return {
        totalDuration,
        totalCaloriesBurned,
        intensityDistribution,
        heartRateAnalysis,
        performanceScore,
        recommendations,
      };
    } catch (error) {
      logger.error('Failed to analyze exercise data', { error });
      throw error;
    }
  }

  /** 处理设备数据 */
  private async processDeviceData(type: ExerciseType, deviceData: any): Promise<any> {
    // 根据设备类型和运动类型处理原始数据
    // 这里需要根据实际设备API进行适配
    return deviceData;
  }

  /** 计算运动指标 */
  private calculateExerciseMetrics(processedData: any): Partial<IExerciseData> {
    const metrics: Partial<IExerciseData> = {};

    // 计算心率数据
    if (processedData.heartRate) {
      metrics.heartRate = {
        average: this.calculateAverage(processedData.heartRate),
        max: Math.max(...processedData.heartRate),
        min: Math.min(...processedData.heartRate),
        zones: this.calculateHeartRateZones(processedData.heartRate),
      };
    }

    // 计算速度数据
    if (processedData.speed) {
      metrics.speed = {
        average: this.calculateAverage(processedData.speed),
        max: Math.max(...processedData.speed),
        min: Math.min(...processedData.speed),
      };
    }

    // 计算配速
    if (processedData.distance && processedData.duration) {
      metrics.pace = {
        average: this.calculatePace(processedData.distance, processedData.duration),
        best: this.calculateBestPace(processedData.speed || []),
      };
    }

    // 添加其他指标
    metrics.steps = processedData.steps;
    metrics.distance = processedData.distance;
    metrics.trackPoints = processedData.trackPoints;
    metrics.strengthData = processedData.strengthData;

    return metrics;
  }

  /** 计算运动时长 */
  private calculateDuration(startTime: Date, endTime: Date): number {
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  }

  /** 确定运动强度 */
  private determineIntensity(metrics: Partial<IExerciseData>): IntensityLevel {
    if (!metrics.heartRate) {
      return IntensityLevel.MODERATE;
    }

    const maxHeartRate = 220 - 30; // 假设年龄30岁
    const heartRatePercentage = (metrics.heartRate.average / maxHeartRate) * 100;

    if (heartRatePercentage < 65) {
      return IntensityLevel.LOW;
    } else if (heartRatePercentage < 85) {
      return IntensityLevel.MODERATE;
    } else {
      return IntensityLevel.HIGH;
    }
  }

  /** 计算卡路里消耗 */
  private calculateCaloriesBurned(metrics: Partial<IExerciseData>): number {
    // 这里需要根据不同运动类型和个人信息使用专业公式计算
    // 当前使用简化计算方式
    const MET = {
      [ExerciseType.WALKING]: 3.5,
      [ExerciseType.RUNNING]: 8,
      [ExerciseType.CYCLING]: 7,
      [ExerciseType.SWIMMING]: 6,
      [ExerciseType.YOGA]: 3,
      [ExerciseType.STRENGTH]: 5,
      [ExerciseType.HIIT]: 8,
      [ExerciseType.STRETCHING]: 2.5,
      [ExerciseType.DANCE]: 4.5,
      [ExerciseType.OTHER]: 4,
    };

    const weight = 70; // 假设体重70kg
    const duration = metrics.duration || 0;
    const type = metrics.type || ExerciseType.OTHER;

    return Math.round((MET[type] * weight * duration) / 60);
  }

  /** 计算平均值 */
  private calculateAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /** 计算心率区间 */
  private calculateHeartRateZones(heartRates: number[]): IExerciseData['heartRate']['zones'] {
    const maxHeartRate = 220 - 30; // 假设年龄30岁
    const total = heartRates.length;

    const zones = {
      easy: 0,
      fatBurn: 0,
      cardio: 0,
      peak: 0,
    };

    heartRates.forEach(hr => {
      const percentage = (hr / maxHeartRate) * 100;
      if (percentage < 65) {
        zones.easy++;
      } else if (percentage < 75) {
        zones.fatBurn++;
      } else if (percentage < 85) {
        zones.cardio++;
      } else {
        zones.peak++;
      }
    });

    // 转换为百分比
    return {
      easy: (zones.easy / total) * 100,
      fatBurn: (zones.fatBurn / total) * 100,
      cardio: (zones.cardio / total) * 100,
      peak: (zones.peak / total) * 100,
    };
  }

  /** 计算配速 */
  private calculatePace(distance: number, duration: number): number {
    // 转换为分钟/公里
    return duration / (distance / 1000);
  }

  /** 计算最佳配速 */
  private calculateBestPace(speeds: number[]): number {
    if (speeds.length === 0) return 0;
    const maxSpeed = Math.max(...speeds);
    // 转换最大速度(米/秒)为配速(分钟/公里)
    return 1000 / (maxSpeed * 60);
  }

  /** 计算强度分布 */
  private calculateIntensityDistribution(
    data: IExerciseData[],
  ): IExerciseAnalysis['intensityDistribution'] {
    const total = data.length;
    const distribution = {
      low: 0,
      moderate: 0,
      high: 0,
    };

    data.forEach(d => {
      distribution[d.intensity]++;
    });

    return {
      low: (distribution.low / total) * 100,
      moderate: (distribution.moderate / total) * 100,
      high: (distribution.high / total) * 100,
    };
  }

  /** 分析心率数据 */
  private analyzeHeartRate(data: IExerciseData[]): IExerciseAnalysis['heartRateAnalysis'] {
    const heartRateData = data.filter(d => d.heartRate);
    if (heartRateData.length === 0) return undefined;

    const averageHeartRate = this.calculateAverage(heartRateData.map(d => d.heartRate!.average));

    const timeInZones = {
      easy: 0,
      fatBurn: 0,
      cardio: 0,
      peak: 0,
    };

    heartRateData.forEach(d => {
      const zones = d.heartRate!.zones;
      timeInZones.easy += (zones.easy * d.duration) / 100;
      timeInZones.fatBurn += (zones.fatBurn * d.duration) / 100;
      timeInZones.cardio += (zones.cardio * d.duration) / 100;
      timeInZones.peak += (zones.peak * d.duration) / 100;
    });

    return {
      averageHeartRate,
      timeInZones,
    };
  }

  /** 计算运动表现评分 */
  private calculatePerformanceScore(data: IExerciseData[]): number {
    let score = 100;

    // 评估运动频率
    const daysWithExercise = new Set(data.map(d => d.startTime.toDateString())).size;
    score += Math.min(daysWithExercise * 5, 20); // 最多加20分

    // 评估运动时长
    const totalDuration = data.reduce((sum, d) => sum + d.duration, 0);
    const averageDuration = totalDuration / data.length;
    if (averageDuration < 30) {
      score -= 10;
    } else if (averageDuration > 60) {
      score += 10;
    }

    // 评估运动强度
    const intensityDistribution = this.calculateIntensityDistribution(data);
    if (intensityDistribution.moderate < 40) {
      score -= 10;
    }
    if (intensityDistribution.high < 20) {
      score -= 5;
    }

    // 评估心率控制
    const heartRateAnalysis = this.analyzeHeartRate(data);
    if (heartRateAnalysis) {
      const cardioTime = heartRateAnalysis.timeInZones.cardio;
      if (cardioTime < totalDuration * 0.3) {
        score -= 10;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /** 生成改进建议 */
  private generateRecommendations(data: IExerciseData[]): string[] {
    const recommendations: string[] = [];

    // 分析运动频率
    const daysWithExercise = new Set(data.map(d => d.startTime.toDateString())).size;
    if (daysWithExercise < 3) {
      recommendations.push('建议增加运动频率，每周至少运动3-4次');
    }

    // 分析运动时长
    const totalDuration = data.reduce((sum, d) => sum + d.duration, 0);
    const averageDuration = totalDuration / data.length;
    if (averageDuration < 30) {
      recommendations.push('建议每次运动时长保持在30-60分钟');
    }

    // 分析运动强度
    const intensityDistribution = this.calculateIntensityDistribution(data);
    if (intensityDistribution.moderate < 40) {
      recommendations.push('建议增加中等强度运动的比例');
    }
    if (intensityDistribution.high < 20) {
      recommendations.push('可以适当增加高强度运动，提高运动效果');
    }

    // 分析心率控制
    const heartRateAnalysis = this.analyzeHeartRate(data);
    if (heartRateAnalysis) {
      const cardioTime = heartRateAnalysis.timeInZones.cardio;
      if (cardioTime < totalDuration * 0.3) {
        recommendations.push('建议增加有氧心率区间的运动时间');
      }
    }

    // 分析运动类型
    const exerciseTypes = new Set(data.map(d => d.type));
    if (exerciseTypes.size < 3) {
      recommendations.push('建议尝试更多样化的运动类型，以全面锻炼身体');
    }

    return recommendations;
  }
}

export const exerciseService = ExerciseService.getInstance();
