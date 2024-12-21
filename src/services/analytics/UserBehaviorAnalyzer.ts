import { CacheManager } from '../cache/CacheManager';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { SecurityAuditor } from '../security/SecurityAuditor';
import { injectable, inject } from 'inversify';

export interface IUserAction {
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: string;
  /** timestamp 的描述 */
    timestamp: number;
  /** metadata 的描述 */
    metadata: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** deviceInfo 的描述 */
    deviceInfo: {
    type: string;
    os: string;
    browser: string;
    ip: string;
  };
  /** location 的描述 */
    location?: undefined | { latitude: number; longitude: number; city?: string | undefined; country?: string | undefined; };
}

export interface IUserBehaviorPattern {
  /** userId 的描述 */
    userId: string;
  /** patterns 的描述 */
    patterns: {
    timePreferences: {
      activeHours: number;
      activeDays: number;
    };
    locationPatterns: {
      frequentLocations: Array<{
        latitude: number;
        longitude: number;
        frequency: number;
      }>;
      unusualLocations: Array<{
        latitude: number;
        longitude: number;
        timestamp: number;
      }>;
    };
    devicePatterns: {
      primaryDevices: Array<{
        type: string;
        os: string;
        browser: string;
        frequency: number;
      }>;
      unusualDevices: Array<{
        type: string;
        os: string;
        browser: string;
        timestamp: number;
      }>;
    };
    actionPatterns: {
      frequentActions: Array<{
        type: string;
        frequency: number;
        averageDuration?: number;
      }>;
      unusualActions: Array<{
        type: string;
        timestamp: number;
        metadata: Record<string, any>;
      }>;
    };
  };
  /** lastUpdated 的描述 */
    lastUpdated: number;
}

export interface IBehaviorAnalysisResult {
  /** riskLevel 的描述 */
    riskLevel: low  medium  high;
  anomalies: Array{
    type: string;
    description: string;
    confidence: number;
    timestamp: number;
  }>;
  recommendations: string[];
}

@injectable()
export class UserBehaviorAnalyzer {
  private readonly patternUpdateInterval = 3600000; // 1小时
  private readonly locationThreshold = 1000; // 1公里
  private readonly unusualActivityThreshold = 0.95; // 95%置信度

  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private cacheManager: CacheManager,
    @inject() private eventBus: EventBus,
    @inject() private securityAuditor: SecurityAuditor,
  ) {
    this.initialize();
  }

  /**
   * 初始化服务
   */
  private async initialize(): Promise<void> {
    try {
      // 订阅用户行为事件
      this.subscribeToEvents();

      // 启动定期分析任务
      this.startAnalysisTasks();

      this.logger.info('用户行为分析服务初始化成功');
    } catch (error) {
      this.logger.error('用户行为分析服务初始化失败', error);
      throw error;
    }
  }

  /**
   * 记录用户行为
   */
  public async recordAction(action: IUserAction): Promise<void> {
    try {
      // 保存行为记录
      await this.databaseService.insert('user_actions', action);

      // 更新用户行为模式
      await this.updateBehaviorPattern(action);

      // 实时异常检测
      const anomalies = await this.detectAnomalies(action);
      if (anomalies.length > 0) {
        await this.handleAnomalies(action.userId, anomalies);
      }

      // 发布事件
      this.eventBus.publish('user.action.recorded', {
        userId: action.userId,
        type: action.type,
        timestamp: action.timestamp,
      });
    } catch (error) {
      this.logger.error('记录用户行为失败', error);
      throw error;
    }
  }

  /**
   * 分析用户行为
   */
  public async analyzeBehavior(
    userId: string,
    timeRange?: { start: number; end: number },
  ): Promise<IBehaviorAnalysisResult> {
    try {
      const pattern = await this.getBehaviorPattern(userId);
      if (!pattern) {
        throw new Error('未找到用户行为模式');
      }

      const actions = await this.getUserActions(userId, timeRange);
      const anomalies = await this.analyzeActions(userId, actions, pattern);
      const riskLevel = this.calculateRiskLevel(anomalies);
      const recommendations = this.generateRecommendations(anomalies);

      // 记录分析结果
      await this.databaseService.insert('behavior_analysis', {
        userId,
        timestamp: Date.now(),
        result: {
          riskLevel,
          anomalies,
          recommendations,
        },
      });

      return {
        riskLevel,
        anomalies,
        recommendations,
      };
    } catch (error) {
      this.logger.error('分析用户行为失败', error);
      throw error;
    }
  }

  /**
   * 获取用户行为模式
   */
  public async getBehaviorPattern(userId: string): Promise<IUserBehaviorPattern | null> {
    try {
      // 尝试从缓存获取
      const cacheKey = `behavior:pattern:${userId}`;
      let pattern = await this.cacheManager.get<IUserBehaviorPattern>(cacheKey);

      if (!pattern) {
        // 从数据库获取
        pattern = await this.databaseService.findOne('behavior_patterns', { userId });

        if (pattern) {
          // 更新缓存
          await this.cacheManager.set(cacheKey, pattern, this.patternUpdateInterval);
        }
      }

      return pattern;
    } catch (error) {
      this.logger.error('获取用户行为模式失败', error);
      throw error;
    }
  }

  /**
   * 更新用户行为模式
   */
  private async updateBehaviorPattern(action: IUserAction): Promise<void> {
    try {
      let pattern = await this.getBehaviorPattern(action.userId);
      if (!pattern) {
        pattern = this.createInitialPattern(action.userId);
      }

      // 更新时间偏好
      this.updateTimePreferences(pattern, action);

      // 更新位置模式
      if (action.location) {
        this.updateLocationPatterns(pattern, action);
      }

      // 更新设备模式
      if (action.deviceInfo) {
        this.updateDevicePatterns(pattern, action);
      }

      // 更新行为模式
      this.updateActionPatterns(pattern, action);

      pattern.lastUpdated = Date.now();

      // 保存更新后的模式
      await this.databaseService.upsert('behavior_patterns', { userId: action.userId }, pattern);

      // 更新缓存
      await this.cacheManager.set(
        `behavior:pattern:${action.userId}`,
        pattern,
        this.patternUpdateInterval,
      );
    } catch (error) {
      this.logger.error('更新用户行为模式失败', error);
      throw error;
    }
  }

  /**
   * 检测异常行为
   */
  private async detectAnomalies(action: IUserAction): Promise<
    Array<{
      type: string;
      description: string;
      confidence: number;
    }>
  > {
    const anomalies: Array<{
      type: string;
      description: string;
      confidence: number;
    }> = [];

    const pattern = await this.getBehaviorPattern(action.userId);
    if (!pattern) return anomalies;

    // 检查时间异常
    const hourOfDay = new Date(action.timestamp).getHours();
    if (!pattern.patterns.timePreferences.activeHours.includes(hourOfDay)) {
      anomalies.push({
        type: 'unusual_time',
        description: '非常规活动时间',
        confidence: 0.8,
      });
    }

    // 检查位置异常
    if (action.location) {
      const isUnusualLocation = this.isUnusualLocation(
        action.location,
        pattern.patterns.locationPatterns.frequentLocations,
      );
      if (isUnusualLocation) {
        anomalies.push({
          type: 'unusual_location',
          description: '非常规活动地点',
          confidence: 0.9,
        });
      }
    }

    // 检查设备异常
    if (action.deviceInfo) {
      const isUnusualDevice = this.isUnusualDevice(
        action.deviceInfo,
        pattern.patterns.devicePatterns.primaryDevices,
      );
      if (isUnusualDevice) {
        anomalies.push({
          type: 'unusual_device',
          description: '非常规设备访问',
          confidence: 0.85,
        });
      }
    }

    // 检查行为异常
    const isUnusualAction = this.isUnusualAction(
      action,
      pattern.patterns.actionPatterns.frequentActions,
    );
    if (isUnusualAction) {
      anomalies.push({
        type: 'unusual_action',
        description: '非常规操作行为',
        confidence: 0.75,
      });
    }

    return anomalies;
  }

  /**
   * 处理异常行为
   */
  private async handleAnomalies(
    userId: string,
    anomalies: Array<{
      type: string;
      description: string;
      confidence: number;
    }>,
  ): Promise<void> {
    try {
      // 记录安全审计
      await this.securityAuditor.logEvent({
        type: 'behavior.anomaly.detected',
        userId,
        details: {
          anomalies,
          timestamp: Date.now(),
        },
      });

      // 发布异常事件
      this.eventBus.publish('user.behavior.anomaly', {
        userId,
        anomalies,
        timestamp: Date.now(),
      });

      // 根据异常类型和置信度采取相应措施
      const highRiskAnomalies = anomalies.filter(
        a => a.confidence >= this.unusualActivityThreshold,
      );
      if (highRiskAnomalies.length > 0) {
        // 触发安全警报
        await this.triggerSecurityAlert(userId, highRiskAnomalies);
      }
    } catch (error) {
      this.logger.error('处理异常行为失败', error);
      throw error;
    }
  }

  /**
   * 触发安全警报
   */
  private async triggerSecurityAlert(
    userId: string,
    anomalies: Array<{
      type: string;
      description: string;
      confidence: number;
    }>,
  ): Promise<void> {
    try {
      // 记录警报
      await this.databaseService.insert('security_alerts', {
        userId,
        anomalies,
        timestamp: Date.now(),
        status: 'pending',
      });

      // 发布警报事件
      this.eventBus.publish('security.alert.created', {
        userId,
        anomalies,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error('触发安全警报失败', error);
      throw error;
    }
  }

  /**
   * 获取用户行为记录
   */
  private async getUserActions(
    userId: string,
    timeRange?: { start: number; end: number },
  ): Promise<IUserAction[]> {
    try {
      const query: any = { userId };
      if (timeRange) {
        query.timestamp = {
          $gte: timeRange.start,
          $lte: timeRange.end,
        };
      }

      return await this.databaseService.find('user_actions', query);
    } catch (error) {
      this.logger.error('获取用户行为记录失败', error);
      throw error;
    }
  }

  /**
   * 分析用户行为记录
   */
  private async analyzeActions(
    userId: string,
    actions: IUserAction[],
    pattern: IUserBehaviorPattern,
  ): Promise<
    Array<{
      type: string;
      description: string;
      confidence: number;
      timestamp: number;
    }>
  > {
    const anomalies: Array<{
      type: string;
      description: string;
      confidence: number;
      timestamp: number;
    }> = [];

    for (const action of actions) {
      const actionAnomalies = await this.detectAnomalies(action);
      anomalies.push(
        ...actionAnomalies.map(a => ({
          ...a,
          timestamp: action.timestamp,
        })),
      );
    }

    return anomalies;
  }

  /**
   * 计算风险等级
   */
  private calculateRiskLevel(
    anomalies: Array<{
      type: string;
      description: string;
      confidence: number;
      timestamp: number;
    }>,
  ): 'low' | 'medium' | 'high' {
    const highConfidenceAnomalies = anomalies.filter(
      a => a.confidence >= this.unusualActivityThreshold,
    );

    if (highConfidenceAnomalies.length >= 3) {
      return 'high';
    } else if (highConfidenceAnomalies.length > 0) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * 生成安全建议
   */
  private generateRecommendations(
    anomalies: Array<{
      type: string;
      description: string;
      confidence: number;
      timestamp: number;
    }>,
  ): string[] {
    const recommendations: string[] = [];

    // 根据异常类型生成建议
    const anomalyTypes = new Set(anomalies.map(a => a.type));

    if (anomalyTypes.has('unusual_time')) {
      recommendations.push('建议在常规时间段内进行操作，避免在异常时间登录系统。');
    }

    if (anomalyTypes.has('unusual_location')) {
      recommendations.push('检测到异地登录，建议开启登录地点验证，使用可信设备进行操作。');
    }

    if (anomalyTypes.has('unusual_device')) {
      recommendations.push('建议使用常用设备访问系统，新设备首次使用时进行身份验证。');
    }

    if (anomalyTypes.has('unusual_action')) {
      recommendations.push('发现异常操作行为，建议检查账号安全设置，必要时更新密码。');
    }

    // 添加通用安全建议
    recommendations.push(
      '建议定期更新密码，开启多因素认证，保护账号安全。',
      '重要操作时使用可信设备，避免在公共场所进行敏感操作。',
    );

    return recommendations;
  }

  /**
   * 创建初始行为模式
   */
  private createInitialPattern(userId: string): IUserBehaviorPattern {
    return {
      userId,
      patterns: {
        timePreferences: {
          activeHours: [],
          activeDays: [],
        },
        locationPatterns: {
          frequentLocations: [],
          unusualLocations: [],
        },
        devicePatterns: {
          primaryDevices: [],
          unusualDevices: [],
        },
        actionPatterns: {
          frequentActions: [],
          unusualActions: [],
        },
      },
      lastUpdated: Date.now(),
    };
  }

  /**
   * 更新时间偏好
   */
  private updateTimePreferences(pattern: IUserBehaviorPattern, action: IUserAction): void {
    const date = new Date(action.timestamp);
    const hour = date.getHours();
    const day = date.getDay();

    if (!pattern.patterns.timePreferences.activeHours.includes(hour)) {
      pattern.patterns.timePreferences.activeHours.push(hour);
    }

    if (!pattern.patterns.timePreferences.activeDays.includes(day)) {
      pattern.patterns.timePreferences.activeDays.push(day);
    }
  }

  /**
   * 更新位置模式
   */
  private updateLocationPatterns(pattern: IUserBehaviorPattern, action: IUserAction): void {
    if (!action.location) return;

    const { latitude, longitude } = action.location;
    let found = false;

    // 更新频繁位置
    for (const location of pattern.patterns.locationPatterns.frequentLocations) {
      if (
        this.calculateDistance(
          { lat: latitude, lng: longitude },
          { lat: location.latitude, lng: location.longitude },
        ) < this.locationThreshold
      ) {
        location.frequency++;
        found = true;
        break;
      }
    }

    if (!found) {
      pattern.patterns.locationPatterns.frequentLocations.push({
        latitude,
        longitude,
        frequency: 1,
      });

      // 检查是否为异常位置
      if (pattern.patterns.locationPatterns.frequentLocations.length > 1) {
        pattern.patterns.locationPatterns.unusualLocations.push({
          latitude,
          longitude,
          timestamp: action.timestamp,
        });
      }
    }
  }

  /**
   * 更新设备模式
   */
  private updateDevicePatterns(pattern: IUserBehaviorPattern, action: IUserAction): void {
    if (!action.deviceInfo) return;

    const { type, os, browser } = action.deviceInfo;
    let found = false;

    // 更新主要设备
    for (const device of pattern.patterns.devicePatterns.primaryDevices) {
      if (device.type === type && device.os === os && device.browser === browser) {
        device.frequency++;
        found = true;
        break;
      }
    }

    if (!found) {
      pattern.patterns.devicePatterns.primaryDevices.push({
        type,
        os,
        browser,
        frequency: 1,
      });

      // 检查是否为异常设备
      if (pattern.patterns.devicePatterns.primaryDevices.length > 1) {
        pattern.patterns.devicePatterns.unusualDevices.push({
          type,
          os,
          browser,
          timestamp: action.timestamp,
        });
      }
    }
  }

  /**
   * 更新行为模式
   */
  private updateActionPatterns(pattern: IUserBehaviorPattern, action: IUserAction): void {
    let found = false;

    // 更新频繁行为
    for (const act of pattern.patterns.actionPatterns.frequentActions) {
      if (act.type === action.type) {
        act.frequency++;
        found = true;
        break;
      }
    }

    if (!found) {
      pattern.patterns.actionPatterns.frequentActions.push({
        type: action.type,
        frequency: 1,
      });

      // 检查是否为异常行为
      if (pattern.patterns.actionPatterns.frequentActions.length > 1) {
        pattern.patterns.actionPatterns.unusualActions.push({
          type: action.type,
          timestamp: action.timestamp,
          metadata: action.metadata,
        });
      }
    }
  }

  /**
   * 计算两点之间的距离（米）
   */
  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
  ): number {
    const R = 6371e3; // 地球半径（米）
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 检查是否为异常位置
   */
  private isUnusualLocation(
    location: { latitude: number; longitude: number },
    frequentLocations: Array<{
      latitude: number;
      longitude: number;
      frequency: number;
    }>,
  ): boolean {
    if (frequentLocations.length === 0) return false;

    // 检查是否在任何常用位置附近
    return !frequentLocations.some(
      fl =>
        this.calculateDistance(
          { lat: location.latitude, lng: location.longitude },
          { lat: fl.latitude, lng: fl.longitude },
        ) < this.locationThreshold,
    );
  }

  /**
   * 检查是否为异常设备
   */
  private isUnusualDevice(
    deviceInfo: {
      type: string;
      os: string;
      browser: string;
    },
    primaryDevices: Array<{
      type: string;
      os: string;
      browser: string;
      frequency: number;
    }>,
  ): boolean {
    if (primaryDevices.length === 0) return false;

    // 检查是否是主要使用的设备
    return !primaryDevices.some(
      pd =>
        pd.type === deviceInfo.type && pd.os === deviceInfo.os && pd.browser === deviceInfo.browser,
    );
  }

  /**
   * 检查是否为异常行为
   */
  private isUnusualAction(
    action: IUserAction,
    frequentActions: Array<{
      type: string;
      frequency: number;
    }>,
  ): boolean {
    if (frequentActions.length === 0) return false;

    // 检查是否是常见行为
    const actionType = frequentActions.find(fa => fa.type === action.type);
    if (!actionType) return true;

    // 检查行为频率是否异常
    const totalFrequency = frequentActions.reduce((sum, fa) => sum + fa.frequency, 0);
    const actionFrequency = actionType.frequency / totalFrequency;

    return actionFrequency < 0.1; // 如果行为频率低于10%，认为是异常
  }

  /**
   * 订阅事件
   */
  private subscribeToEvents(): void {
    this.eventBus.subscribe('user.action', async (data: IUserAction) => {
      await this.recordAction(data);
    });

    this.eventBus.subscribe('security.alert.created', async (data: any) => {
      // 处理安全警报
      this.logger.info('收到安全警报', data);
    });
  }

  /**
   * 启动分析任务
   */
  private startAnalysisTasks(): void {
    // 定期更新用户行为模式
    setInterval(async () => {
      try {
        const users = await this.databaseService.find('users', {});
        for (const user of users) {
          await this.analyzeBehavior(user._id);
        }
      } catch (error) {
        this.logger.error('定期行为分析失败', error);
      }
    }, this.patternUpdateInterval);
  }
}
