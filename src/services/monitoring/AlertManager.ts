import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector, IMetricValue } from './MetricsCollector';
import { MonitoringEvents, EventSource, EventPriority } from '../communication/events';
import { injectable, inject } from 'inversify';

export interface IAlertRule {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** metric 的描述 */
    metric: string;
  /** condition 的描述 */
    condition: {
    type: threshold  change  absence;
    threshold: number;
    operator:           ;
    duration: number;
    changePercent: number;
  };
  labels?: Record<string, string>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  notifications: {
    channels: string[];
    template?: string;
  };
  silenced?: boolean;
  lastTriggered?: number;
  lastNotified?: number;
}

export interface IAlert {
  /** id 的描述 */
    id: string;
  /** ruleId 的描述 */
    ruleId: string;
  /** metric 的描述 */
    metric: string;
  /** value 的描述 */
    value: number;
  /** threshold 的描述 */
    threshold: number;
  /** labels 的描述 */
    labels: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** severity 的描述 */
    severity: string;
  /** message 的描述 */
    message: string;
  /** timestamp 的描述 */
    timestamp: number;
  /** status 的描述 */
    status: active  /** resolved 的描述 */
    /** resolved 的描述 */
    resolved;
  /** resolvedAt 的描述 */
    resolvedAt: number;
}

export interface INotificationChannel {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: email  slack  webhook  sms;
  config: Recordstring, any;
  enabled: boolean;
}

/**
 * 告警管理器
 */
@injectable()
export class AlertManager {
  private rules: Map<string, IAlertRule> = new Map();
  private alerts: Map<string, IAlert> = new Map();
  private channels: Map<string, INotificationChannel> = new Map();
  private checkInterval?: NodeJS.Timeout;

  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private metrics: MetricsCollector,
  ) {
    this.setupEventListeners();
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.eventBus.subscribe(
      {
        type: MonitoringEvents.METRIC_COLLECTED,
        source: EventSource.MONITOR,
      },
      async event => {
        await this.checkRules(event.data.name, event.data.value, event.data.labels || {});
      },
    );
  }

  /**
   * 启动告警管理器
   */
  public start(): void {
    if (!this.checkInterval) {
      this.checkInterval = setInterval(() => {
        this.checkAllRules();
      }, 60000); // 每分钟检查一次
    }
  }

  /**
   * 停止告警管理器
   */
  public stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
  }

  /**
   * 添加告警规则
   */
  public addRule(rule: IAlertRule): void {
    if (this.rules.has(rule.id)) {
      throw new Error(`告警规则 ${rule.id} 已存在`);
    }
    this.rules.set(rule.id, rule);
    this.logger.info(`添加告警规则: ${rule.name}`);
  }

  /**
   * 更新告警规则
   */
  public updateRule(rule: IAlertRule): void {
    if (!this.rules.has(rule.id)) {
      throw new Error(`告警规则 ${rule.id} 不存在`);
    }
    this.rules.set(rule.id, rule);
    this.logger.info(`更新告警规则: ${rule.name}`);
  }

  /**
   * 删除告警规则
   */
  public deleteRule(ruleId: string): void {
    if (!this.rules.has(ruleId)) {
      throw new Error(`告警规则 ${ruleId} 不存在`);
    }
    this.rules.delete(ruleId);
    this.logger.info(`删除告警规则: ${ruleId}`);
  }

  /**
   * 添加通知渠道
   */
  public addChannel(channel: INotificationChannel): void {
    if (this.channels.has(channel.id)) {
      throw new Error(`通知渠道 ${channel.id} 已存在`);
    }
    this.channels.set(channel.id, channel);
    this.logger.info(`添加通知渠道: ${channel.name}`);
  }

  /**
   * 检查所有规则
   */
  private async checkAllRules(): Promise<void> {
    for (const rule of this.rules.values()) {
      if (rule.silenced) continue;

      const values = this.metrics.getMetricValues(rule.metric, rule.labels);
      if (values.length > 0) {
        const latestValue = values[values.length - 1];
        await this.checkRules(rule.metric, latestValue.value, latestValue.labels || {});
      }
    }
  }

  /**
   * 检查规则
   */
  private async checkRules(
    metric: string,
    value: number,
    labels: Record<string, string>,
  ): Promise<void> {
    for (const rule of this.rules.values()) {
      if (rule.silenced || rule.metric !== metric) continue;

      if (this.matchLabels(labels, rule.labels || {})) {
        const isTriggered = await this.evaluateRule(rule, value);
        if (isTriggered) {
          await this.triggerAlert(rule, value);
        } else {
          await this.resolveAlert(rule);
        }
      }
    }
  }

  /**
   * 评估规则
   */
  private async evaluateRule(rule: IAlertRule, value: number): Promise<boolean> {
    const { condition } = rule;

    switch (condition.type) {
      case 'threshold':
        return this.evaluateThreshold(value, condition.operator!, condition.threshold!);

      case 'change':
        return this.evaluateChange(rule.metric, value, condition.changePercent!);

      case 'absence':
        return this.evaluateAbsence(rule.metric, condition.duration!);

      default:
        return false;
    }
  }

  /**
   * 评估阈值条件
   */
  private evaluateThreshold(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      case '==':
        return value === threshold;
      case '!=':
        return value !== threshold;
      default:
        return false;
    }
  }

  /**
   * 评估变化条件
   */
  private evaluateChange(metric: string, currentValue: number, changePercent: number): boolean {
    const values = this.metrics.getMetricValues(metric);
    if (values.length < 2) return false;

    const previousValue = values[values.length - 2].value;
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return Math.abs(change) >= changePercent;
  }

  /**
   * 评估缺失条件
   */
  private evaluateAbsence(metric: string, duration: number): boolean {
    const values = this.metrics.getMetricValues(metric);
    if (values.length === 0) return true;

    const lastValue = values[values.length - 1];
    return Date.now() - lastValue.timestamp >= duration;
  }

  /**
   * 触发告警
   */
  private async triggerAlert(rule: IAlertRule, value: number): Promise<void> {
    const alertId = `${rule.id}:${Date.now()}`;

    if (this.shouldNotify(rule)) {
      const alert: IAlert = {
        id: alertId,
        ruleId: rule.id,
        metric: rule.metric,
        value,
        threshold: rule.condition.threshold || 0,
        labels: rule.labels || {},
        severity: rule.severity,
        message: this.formatAlertMessage(rule, value),
        timestamp: Date.now(),
        status: 'active',
      };

      this.alerts.set(alertId, alert);
      await this.notify(rule, alert);

      this.eventBus.publish(
        MonitoringEvents.ALERT_TRIGGERED,
        {
          alert,
          rule,
        },
        {
          source: EventSource.MONITOR,
          priority: EventPriority.HIGH,
        },
      );

      rule.lastTriggered = Date.now();
      rule.lastNotified = Date.now();
    }
  }

  /**
   * 解决告警
   */
  private async resolveAlert(rule: IAlertRule): Promise<void> {
    const activeAlerts = Array.from(this.alerts.values()).filter(
      alert => alert.ruleId === rule.id && alert.status === 'active',
    );

    for (const alert of activeAlerts) {
      alert.status = 'resolved';
      alert.resolvedAt = Date.now();

      this.eventBus.publish(
        MonitoringEvents.ALERT_RESOLVED,
        {
          alert,
          rule,
        },
        {
          source: EventSource.MONITOR,
          priority: EventPriority.NORMAL,
        },
      );
    }
  }

  /**
   * 判断是否应该发送通知
   */
  private shouldNotify(rule: IAlertRule): boolean {
    if (!rule.lastNotified) return true;

    // 默认冷却时间为5分钟
    const cooldown = 5 * 60 * 1000;
    return Date.now() - rule.lastNotified >= cooldown;
  }

  /**
   * 发送通知
   */
  private async notify(rule: IAlertRule, alert: IAlert): Promise<void> {
    for (const channelId of rule.notifications.channels) {
      const channel = this.channels.get(channelId);
      if (!channel || !channel.enabled) continue;

      try {
        await this.sendNotification(channel, rule, alert);
      } catch (error) {
        this.logger.error(`发送通知失败: ${channel.name}`, error);
      }
    }
  }

  /**
   * 发送通知到指定渠道
   */
  private async sendNotification(
    channel: INotificationChannel,
    rule: IAlertRule,
    alert: IAlert,
  ): Promise<void> {
    const message = rule.notifications.template
      ? this.formatTemplate(rule.notifications.template, alert)
      : this.formatAlertMessage(rule, alert.value);

    switch (channel.type) {
      case 'email':
        // 实现邮件发送
        break;
      case 'slack':
        // 实现Slack通知
        break;
      case 'webhook':
        // 实现Webhook调用
        break;
      case 'sms':
        // 实现短信发送
        break;
    }
  }

  /**
   * 格式化告警消息
   */
  private formatAlertMessage(rule: IAlertRule, value: number): string {
    return (
      `[${rule.severity.toUpperCase()}] ${rule.name}\n` +
      `指标: ${rule.metric}\n` +
      `当前值: ${value}\n` +
      `阈值: ${rule.condition.threshold}\n` +
      `描述: ${rule.description}`
    );
  }

  /**
   * 格式化模板
   */
  private formatTemplate(template: string, alert: IAlert): string {
    return template.replace(/\${(\w+)}/g, (match, key) => {
      return String((alert as any)[key] || match);
    });
  }

  /**
   * 匹配标签
   */
  private matchLabels(labels: Record<string, string>, ruleLabels: Record<string, string>): boolean {
    return Object.entries(ruleLabels).every(([key, value]) => labels[key] === value);
  }

  /**
   * 获取活跃告警
   */
  public getActiveAlerts(): IAlert[] {
    return Array.from(this.alerts.values()).filter(alert => alert.status === 'active');
  }

  /**
   * 获取告警历史
   */
  public getAlertHistory(
    options: {
      ruleId?: string;
      severity?: string;
      status?: string;
      startTime?: number;
      endTime?: number;
    } = {},
  ): IAlert[] {
    return Array.from(this.alerts.values())
      .filter(alert => {
        if (options.ruleId && alert.ruleId !== options.ruleId) return false;
        if (options.severity && alert.severity !== options.severity) return false;
        if (options.status && alert.status !== options.status) return false;
        if (options.startTime && alert.timestamp < options.startTime) return false;
        if (options.endTime && alert.timestamp > options.endTime) return false;
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 获取规则状态
   */
  public getRuleStatus(ruleId: string): {
    rule: IAlertRule;
    activeAlerts: number;
    lastTriggered?: number;
    lastNotified?: number;
  } {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`告警规则 ${ruleId} 不存在`);
    }

    const activeAlerts = this.getActiveAlerts().filter(alert => alert.ruleId === ruleId).length;

    return {
      rule,
      activeAlerts,
      lastTriggered: rule.lastTriggered,
      lastNotified: rule.lastNotified,
    };
  }
}
