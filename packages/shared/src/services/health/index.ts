import { BehaviorSubject } from 'rxjs';

interface IHealthData {
  /** vitals 的描述 */
  vitals: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
  };
  /** bodyMetrics 的描述 */
  bodyMetrics: {
    height: number;
    weight: number;
    bmi: number;
    bodyFat: number;
    muscleMass: number;
  };
  /** nutrition 的描述 */
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  };
  /** activity 的描述 */
  activity: {
    steps: number;
    distance: number;
    activeMinutes: number;
    caloriesBurned: number;
  };
  /** sleep 的描述 */
  sleep: {
    duration: number;
    quality: number;
    deepSleep: number;
    remSleep: number;
    lightSleep: number;
    awakeTime: number;
  };
  /** stress 的描述 */
  stress: {
    level: number;
    variability: number;
    recoveryTime: number;
  };
}

interface IHealthRisk {
  /** type 的描述 */
  type: string;
  /** level 的描述 */
  level: 'low' | 'medium' | 'high';
  /** description 的描述 */
  description: string;
  /** recommendations 的描述 */
  recommendations: string[];
}

interface IHealthMonitor {
  /** threshold 的描述 */
  threshold: number;
  /** callback 的描述 */
  callback: (data: IHealthData) => void;
}

interface IHealthState {
  /** data 的描述 */
  data: IHealthData | null;
  /** risks 的描述 */
  risks: IHealthRisk[];
  /** analyzing 的描述 */
  analyzing: boolean;
  /** error 的描述 */
  error: Error | null;
  /** monitors 的描述 */
  monitors: Map<string, IHealthMonitor>;
  /** lastUpdate 的描述 */
  lastUpdate: Date | null;
}

export class HealthService {
  private state$ = new BehaviorSubject<IHealthState>({
    data: null,
    risks: [],
    analyzing: false,
    error: null,
    monitors: new Map(),
    lastUpdate: null,
  });

  // 添加健康监控器
  addMonitor(type: string, threshold: number, callback: (data: IHealthData) => void) {
    const monitors = this.state$.value.monitors;
    monitors.set(type, { threshold, callback });
    this.state$.next({
      ...this.state$.value,
      monitors,
    });
  }

  // 移除健康监控器
  removeMonitor(type: string) {
    const monitors = this.state$.value.monitors;
    monitors.delete(type);
    this.state$.next({
      ...this.state$.value,
      monitors,
    });
  }

  // 更新健康数据时检查监控器
  private checkMonitors(data: IHealthData) {
    this.state$.value.monitors.forEach((monitor, type) => {
      const value = this.getValueByType(data, type);
      if (value && Math.abs(value - monitor.threshold) > monitor.threshold * 0.1) {
        monitor.callback(data);
      }
    });
  }

  // 根据类型获取健康数据值
  private getValueByType(data: IHealthData, type: string): number | null {
    const paths = type.split('.');
    let value: any = data;
    for (const path of paths) {
      value = value[path];
      if (value === undefined) return null;
    }
    return typeof value === 'number' ? value : null;
  }

  // 获取服务状态
  getState() {
    return this.state$.asObservable();
  }

  // 更新健康数据
  async updateHealthData(data: Partial<IHealthData>) {
    try {
      const currentData = this.state$.value.data || {};
      const newData = {
        ...currentData,
        ...data,
      } as IHealthData;

      this.state$.next({
        ...this.state$.value,
        data: newData,
      });

      // 分析健康风险
      await this.analyzeHealthRisks(newData);
    } catch (error) {
      this.updateError(error as Error);
    }
  }

  // 优化健康风险分析
  private async analyzeHealthRisks(data: IHealthData) {
    this.state$.next({
      ...this.state$.value,
      analyzing: true,
      lastUpdate: new Date(),
    });

    try {
      const risks: IHealthRisk[] = [];
      const analysisPromises = [
        this.analyzeVitalsAsync(data.vitals, risks),
        this.analyzeBodyMetricsAsync(data.bodyMetrics, risks),
        this.analyzeNutritionAsync(data.nutrition, risks),
        this.analyzeActivityAsync(data.activity, risks),
        this.analyzeSleepAsync(data.sleep, risks),
        this.analyzeStressAsync(data.stress, risks),
      ];

      await Promise.all(analysisPromises);

      // 检查健康监控器
      this.checkMonitors(data);

      this.state$.next({
        ...this.state$.value,
        risks,
        analyzing: false,
      });
    } catch (error) {
      this.updateError(error as Error);
    }
  }

  // 异步分析生命体征
  private async analyzeVitalsAsync(vitals: IHealthData['vitals'], risks: IHealthRisk[]) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.analyzeVitals(vitals, risks);
        resolve();
      }, 0);
    });
  }

  // 异步分析身体指标
  private async analyzeBodyMetricsAsync(metrics: IHealthData['bodyMetrics'], risks: IHealthRisk[]) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.analyzeBodyMetrics(metrics, risks);
        resolve();
      }, 0);
    });
  }

  // 异步分析营养状况
  private async analyzeNutritionAsync(nutrition: IHealthData['nutrition'], risks: IHealthRisk[]) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.analyzeNutrition(nutrition, risks);
        resolve();
      }, 0);
    });
  }

  // 异步分析活动水平
  private async analyzeActivityAsync(activity: IHealthData['activity'], risks: IHealthRisk[]) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.analyzeActivity(activity, risks);
        resolve();
      }, 0);
    });
  }

  // 异步分析睡眠质量
  private async analyzeSleepAsync(sleep: IHealthData['sleep'], risks: IHealthRisk[]) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.analyzeSleep(sleep, risks);
        resolve();
      }, 0);
    });
  }

  // 异步分析压力水平
  private async analyzeStressAsync(stress: IHealthData['stress'], risks: IHealthRisk[]) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.analyzeStress(stress, risks);
        resolve();
      }, 0);
    });
  }

  // 分析生命体征
  private analyzeVitals(vitals: IHealthData['vitals'], risks: IHealthRisk[]) {
    // 心率分析
    if (vitals.heartRate < 60 || vitals.heartRate > 100) {
      risks.push({
        type: 'heartRate',
        level: vitals.heartRate < 50 || vitals.heartRate > 120 ? 'high' : 'medium',
        description: '心率异常',
        recommendations: ['保持规律运动', '避免剧烈运动', '注意休息', '必要时就医'],
      });
    }

    // 血压分析
    if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90) {
      risks.push({
        type: 'bloodPressure',
        level: 'high',
        description: '血压偏高',
        recommendations: ['限制盐分摄入', '规律运动', '保持健康饮食', '定期监测血压'],
      });
    }

    // 体温分析
    if (vitals.temperature > 37.5) {
      risks.push({
        type: 'temperature',
        level: vitals.temperature > 38.5 ? 'high' : 'medium',
        description: '体温偏高',
        recommendations: ['多休息', '保持水分摄入', '必要时就医'],
      });
    }

    // 血氧饱和度分析
    if (vitals.oxygenSaturation < 95) {
      risks.push({
        type: 'oxygenSaturation',
        level: vitals.oxygenSaturation < 90 ? 'high' : 'medium',
        description: '血氧饱和度偏低',
        recommendations: ['保持呼吸顺畅', '避免剧烈运动', '必要时就医'],
      });
    }
  }

  // 分析身体指标
  private analyzeBodyMetrics(metrics: IHealthData['bodyMetrics'], risks: IHealthRisk[]) {
    // BMI分析
    if (metrics.bmi < 18.5 || metrics.bmi > 25) {
      risks.push({
        type: 'bmi',
        level: metrics.bmi < 16 || metrics.bmi > 30 ? 'high' : 'medium',
        description: metrics.bmi < 18.5 ? 'BMI偏低' : 'BMI偏高',
        recommendations: ['调整饮食结构', '规律运动', '咨询营养师'],
      });
    }

    // 体脂率分析
    if (metrics.bodyFat > 25) {
      risks.push({
        type: 'bodyFat',
        level: metrics.bodyFat > 30 ? 'high' : 'medium',
        description: '体脂率偏高',
        recommendations: ['增加有氧运动', '控制热量摄入', '增加蛋白质摄入'],
      });
    }
  }

  // 分析营养状况
  private analyzeNutrition(nutrition: IHealthData['nutrition'], risks: IHealthRisk[]) {
    // 卡路���摄入分析
    const recommendedCalories = 2000; // 这里应该根据用户情况动态计算
    if (Math.abs(nutrition.calories - recommendedCalories) > 500) {
      risks.push({
        type: 'calories',
        level: 'medium',
        description: nutrition.calories < recommendedCalories ? '热量摄入不足' : '热量摄入过多',
        recommendations: ['均衡饮食', '控制食量', '选择健康食物'],
      });
    }

    // 蛋白质摄入分析
    if (nutrition.protein < 50) {
      risks.push({
        type: 'protein',
        level: 'medium',
        description: '蛋白质摄入不足',
        recommendations: ['增加优质蛋白摄入', '食用瘦肉、鱼类、蛋类', '考虑补充蛋白粉'],
      });
    }

    // 水分摄入分析
    if (nutrition.water < 2000) {
      risks.push({
        type: 'water',
        level: 'medium',
        description: '水分摄入不足',
        recommendations: ['增加饮水量', '定时饮水', '监控尿液颜色'],
      });
    }
  }

  // 分析活动水平
  private analyzeActivity(activity: IHealthData['activity'], risks: IHealthRisk[]) {
    // 步数分析
    if (activity.steps < 8000) {
      risks.push({
        type: 'steps',
        level: activity.steps < 5000 ? 'high' : 'medium',
        description: '日常活动量不足',
        recommendations: ['增加步行时间', '使用楼梯代替电梯', '工作时定时起身活动'],
      });
    }

    // 活动时间分析
    if (activity.activeMinutes < 30) {
      risks.push({
        type: 'activeMinutes',
        level: 'medium',
        description: '运动时间不足',
        recommendations: ['每天保持30分钟中等强度运动', '参加运动课程', '找到喜欢的运动方式'],
      });
    }
  }

  // 分析睡眠质量
  private analyzeSleep(sleep: IHealthData['sleep'], risks: IHealthRisk[]) {
    // 睡眠时长分析
    if (sleep.duration < 7 || sleep.duration > 9) {
      risks.push({
        type: 'sleepDuration',
        level: sleep.duration < 6 || sleep.duration > 10 ? 'high' : 'medium',
        description: sleep.duration < 7 ? '睡眠时间不足' : '睡眠时间过长',
        recommendations: ['保持规律作息', '创造良好睡眠环境', '避免睡前使用电子设备'],
      });
    }

    // 睡眠质量分析
    if (sleep.quality < 80) {
      risks.push({
        type: 'sleepQuality',
        level: sleep.quality < 60 ? 'high' : 'medium',
        description: '睡眠质量欠佳',
        recommendations: ['保持规律作息', '睡前放松', '避免咖啡因摄入'],
      });
    }
  }

  // 分析压力水平
  private analyzeStress(stress: IHealthData['stress'], risks: IHealthRisk[]) {
    if (stress.level > 7) {
      risks.push({
        type: 'stress',
        level: stress.level > 8 ? 'high' : 'medium',
        description: '压力水平较高',
        recommendations: ['进行放松训练', '保持规律运动', '寻求心理咨询'],
      });
    }

    if (stress.recoveryTime > 48) {
      risks.push({
        type: 'recovery',
        level: 'high',
        description: '恢复能力下降',
        recommendations: ['增加休息时间', '改善睡眠质量', '适当运动'],
      });
    }
  }

  // 获取健康建议
  async getHealthRecommendations() {
    const { risks } = this.state$.value;
    return risks.map(risk => ({
      type: risk.type,
      level: risk.level,
      recommendations: risk.recommendations,
    }));
  }

  // 获取健康报告
  async generateHealthReport() {
    const { data, risks } = this.state$.value;
    if (!data) return null;

    return {
      summary: {
        overallHealth: this.calculateOverallHealth(risks),
        mainRisks: risks.filter(r => r.level === 'high'),
        improvements: risks.filter(r => r.level === 'medium'),
      },
      details: {
        vitals: data.vitals,
        bodyMetrics: data.bodyMetrics,
        nutrition: data.nutrition,
        activity: data.activity,
        sleep: data.sleep,
        stress: data.stress,
      },
      recommendations: risks.reduce((acc, risk) => {
        acc[risk.type] = risk.recommendations;
        return acc;
      }, {} as Record<string, string[]>),
    };
  }

  // 计算整体健康状况
  private calculateOverallHealth(risks: IHealthRisk[]) {
    const highRisks = risks.filter(r => r.level === 'high').length;
    const mediumRisks = risks.filter(r => r.level === 'medium').length;

    if (highRisks > 2) return 'poor';
    if (highRisks > 0 || mediumRisks > 3) return 'fair';
    if (mediumRisks > 0) return 'good';
    return 'excellent';
  }

  // 更新错误状态
  private updateError(error: Error) {
    this.state$.next({
      ...this.state$.value,
      analyzing: false,
      error,
    });
  }

  // 获取健康趋势分析
  async getHealthTrends(days = 7) {
    // 实现健康趋势分析逻辑
    return {
      vitals: this.calculateTrends(days, 'vitals'),
      bodyMetrics: this.calculateTrends(days, 'bodyMetrics'),
      nutrition: this.calculateTrends(days, 'nutrition'),
      activity: this.calculateTrends(days, 'activity'),
      sleep: this.calculateTrends(days, 'sleep'),
      stress: this.calculateTrends(days, 'stress'),
    };
  }

  // 计算健康指标趋势
  private calculateTrends(days: number, type: string) {
    // 实现趋势计算逻辑
    return {
      trend: 'stable',
      change: 0,
      data: [],
    };
  }
}

export const healthService = new HealthService();
