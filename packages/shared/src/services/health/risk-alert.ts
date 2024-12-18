import { BehaviorSubject, Observable } from 'rxjs';
import { IRiskAlert, IRiskRule, IHealthData } from './types';
import { v4 as uuidv4 } from 'uuid';

interface IRiskAlertState {
  /** alerts 的描述 */
  alerts: IRiskAlert[];
  /** rules 的描述 */
  rules: IRiskRule[];
  /** processing 的描述 */
  processing: boolean;
  /** error 的描述 */
  error: Error | null;
}

export class RiskAlertService {
  private state$ = new BehaviorSubject<IRiskAlertState>({
    alerts: [],
    rules: [],
    processing: false,
    error: null,
  });

  private cooldowns: Map<string, number> = new Map();
  private readonly DEFAULT_COOLDOWN = 300000; // 5分钟

  constructor() {
    // 初始化默认规则
    this.initDefaultRules();
  }

  private initDefaultRules() {
    const defaultRules: IRiskRule[] = [
      {
        id: 'high-heart-rate',
        type: 'vital',
        condition: (data: IHealthData) => data.vitals.heartRate > 100,
        level: 'high',
        message: '心率过高',
        threshold: 100,
        cooldown: 300000,
      },
      {
        id: 'low-heart-rate',
        type: 'vital',
        condition: (data: IHealthData) => data.vitals.heartRate < 60,
        level: 'high',
        message: '心率过低',
        threshold: 60,
        cooldown: 300000,
      },
      {
        id: 'high-blood-pressure',
        type: 'vital',
        condition: (data: IHealthData) =>
          data.vitals.bloodPressure.systolic > 140 || data.vitals.bloodPressure.diastolic > 90,
        level: 'high',
        message: '血压过高',
        cooldown: 300000,
      },
      {
        id: 'low-oxygen',
        type: 'vital',
        condition: (data: IHealthData) => data.vitals.oxygenSaturation < 95,
        level: 'high',
        message: '血氧饱和度过低',
        threshold: 95,
        cooldown: 300000,
      },
    ];

    this.state$.next({
      ...this.state$.value,
      rules: defaultRules,
    });
  }

  // 获取状态观察对象
  getState(): Observable<IRiskAlertState> {
    return this.state$.asObservable();
  }

  // 检查健康数据并生成警报
  async checkHealthData(data: IHealthData): Promise<void> {
    try {
      this.state$.next({
        ...this.state$.value,
        processing: true,
        error: null,
      });

      const currentTime = Date.now();
      const newAlerts: IRiskAlert[] = [];

      // 检查每个规则
      for (const rule of this.state$.value.rules) {
        const lastTrigger = this.cooldowns.get(rule.id);
        const cooldownPeriod = rule.cooldown || this.DEFAULT_COOLDOWN;

        // 检查冷却时间
        if (lastTrigger && currentTime - lastTrigger < cooldownPeriod) {
          continue;
        }

        // 检查条件
        if (rule.condition(data)) {
          const alert: IRiskAlert = {
            id: uuidv4(),
            type: rule.type,
            level: rule.level,
            message: rule.message,
            timestamp: currentTime,
            data: this.extractRelevantData(data, rule),
            handled: false,
          };

          newAlerts.push(alert);
          this.cooldowns.set(rule.id, currentTime);
        }
      }

      // 更新状态
      if (newAlerts.length > 0) {
        this.state$.next({
          ...this.state$.value,
          alerts: [...newAlerts, ...this.state$.value.alerts],
        });
      }
    } catch (error) {
      this.state$.next({
        ...this.state$.value,
        error: error as Error,
      });
      throw error;
    } finally {
      this.state$.next({
        ...this.state$.value,
        processing: false,
      });
    }
  }

  // 提取相关数据
  private extractRelevantData(data: IHealthData, rule: IRiskRule): Record<string, any> {
    const relevantData: Record<string, any> = {};

    switch (rule.type) {
      case 'vital':
        relevantData.heartRate = data.vitals.heartRate;
        relevantData.bloodPressure = data.vitals.bloodPressure;
        relevantData.oxygenSaturation = data.vitals.oxygenSaturation;
        break;
      case 'activity':
        relevantData.steps = data.activity.steps;
        relevantData.activeMinutes = data.activity.activeMinutes;
        break;
      case 'sleep':
        relevantData.duration = data.sleep.duration;
        relevantData.quality = data.sleep.quality;
        break;
      case 'nutrition':
        relevantData.calories = data.nutrition.calories;
        relevantData.water = data.nutrition.water;
        break;
      default:
        // 默认只包含阈值相关的数据
        if (rule.threshold) {
          const path = rule.type.split('.');
          let value = data;
          for (const key of path) {
            value = value[key];
          }
          relevantData.value = value;
          relevantData.threshold = rule.threshold;
        }
    }

    return relevantData;
  }

  // 标记警报为已处理
  async markAlertHandled(alertId: string): Promise<void> {
    const alerts = this.state$.value.alerts.map(alert =>
      alert.id === alertId ? { ...alert, handled: true } : alert,
    );

    this.state$.next({
      ...this.state$.value,
      alerts,
    });
  }

  // 清除已处理的警报
  async clearHandledAlerts(): Promise<void> {
    const alerts = this.state$.value.alerts.filter(alert => !alert.handled);

    this.state$.next({
      ...this.state$.value,
      alerts,
    });
  }

  // 获取特定类型的警报
  getAlertsByType(type: string): IRiskAlert[] {
    return this.state$.value.alerts.filter(alert => alert.type === type);
  }

  // 获取活跃警报
  getActiveAlerts(): IRiskAlert[] {
    return this.state$.value.alerts.filter(alert => !alert.handled);
  }

  // 添加自定义规则
  async addRule(rule: IRiskRule): Promise<void> {
    if (!rule.id) {
      rule.id = uuidv4();
    }

    this.state$.next({
      ...this.state$.value,
      rules: [...this.state$.value.rules, rule],
    });
  }

  // 移除规则
  async removeRule(ruleId: string): Promise<void> {
    const rules = this.state$.value.rules.filter(rule => rule.id !== ruleId);

    this.state$.next({
      ...this.state$.value,
      rules,
    });
  }

  // 更新规则
  async updateRule(ruleId: string, updates: Partial<IRiskRule>): Promise<void> {
    const rules = this.state$.value.rules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule,
    );

    this.state$.next({
      ...this.state$.value,
      rules,
    });
  }

  // 清除所有警报
  async clearAllAlerts(): Promise<void> {
    this.state$.next({
      ...this.state$.value,
      alerts: [],
    });
  }

  // 重置服务状态
  async reset(): Promise<void> {
    this.cooldowns.clear();
    this.state$.next({
      alerts: [],
      rules: [],
      processing: false,
      error: null,
    });
    this.initDefaultRules();
  }
}
