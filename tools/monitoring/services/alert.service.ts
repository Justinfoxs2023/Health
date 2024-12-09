import { Alert, AlertRule } from '../models/alert.model';
import { NotificationService } from './notification.service';
import { MetricsService } from './metrics.service';
import { Redis } from '../utils/redis';
import { Logger } from '../utils/logger';

export class AlertService {
  private notificationService: NotificationService;
  private metricsService: MetricsService;
  private redis: Redis;
  private logger: Logger;

  constructor() {
    this.notificationService = new NotificationService();
    this.metricsService = new MetricsService();
    this.redis = new Redis();
    this.logger = new Logger('AlertService');
  }

  /**
   * 检查健康指标
   */
  async checkHealthMetrics(userId: string, metrics: any) {
    try {
      // 获取适用的告警规则
      const rules = await this.getActiveRules('health_metrics');

      for (const rule of rules) {
        // 检查冷却时间
        if (await this.isInCooldown(rule._id)) {
          continue;
        }

        // 评估规则条件
        const isTriggered = await this.evaluateConditions(rule.conditions, metrics);

        if (isTriggered) {
          // 创建告警
          await this.createAlert({
            type: 'health_metrics',
            level: rule.level,
            source: userId,
            message: `Health metrics alert: ${rule.name}`,
            details: {
              metrics,
              rule: rule.name,
              conditions: rule.conditions
            }
          });

          // 更新规则触发时间
          await this.updateRuleLastTriggered(rule._id);
        }
      }
    } catch (error) {
      this.logger.error('健康指标检查失败', error);
      throw error;
    }
  }

  /**
   * 创建告警
   */
  async createAlert(data: {
    type: string;
    level: string;
    source: string;
    message: string;
    details?: any;
  }) {
    try {
      const alert = new Alert(data);
      await alert.save();

      // 发送通知
      await this.sendAlertNotifications(alert);

      // 记录指标
      await this.metricsService.recordAlert(alert);

      return alert;
    } catch (error) {
      this.logger.error('创建告警失败', error);
      throw error;
    }
  }

  /**
   * 处理告警
   */
  async handleAlert(alertId: string, action: 'acknowledge' | 'resolve', userId: string) {
    try {
      const alert = await Alert.findById(alertId);
      if (!alert) {
        throw new Error('Alert not found');
      }

      if (action === 'acknowledge') {
        alert.status = 'acknowledged';
        alert.acknowledgedBy = userId;
      } else {
        alert.status = 'resolved';
        alert.resolvedBy = userId;
      }

      await alert.save();

      // 发送状态更新通知
      await this.notificationService.sendNotification({
        type: 'alert_status_update',
        data: {
          alertId: alert._id,
          status: alert.status,
          updatedBy: userId
        }
      });

      return alert;
    } catch (error) {
      this.logger.error('处理告警失败', error);
      throw error;
    }
  }

  /**
   * 管理告警规则
   */
  async manageAlertRule(data: {
    name: string;
    type: string;
    conditions: any[];
    level: string;
    notificationChannels: string[];
    enabled?: boolean;
    createdBy: string;
  }) {
    try {
      const rule = new AlertRule({
        ...data,
        updatedBy: data.createdBy
      });

      await rule.save();

      // 更新规则缓存
      await this.updateRulesCache();

      return rule;
    } catch (error) {
      this.logger.error('管理告警规则失败', error);
      throw error;
    }
  }

  /**
   * 发送告警通知
   */
  private async sendAlertNotifications(alert: any) {
    try {
      const rule = await AlertRule.findOne({ type: alert.type });
      if (!rule?.notificationChannels) return;

      for (const channel of rule.notificationChannels) {
        try {
          await this.notificationService.send(channel, {
            type: 'alert',
            level: alert.level,
            message: alert.message,
            details: alert.details
          });

          alert.notificationsSent.push({
            channel,
            timestamp: new Date(),
            status: 'success'
          });
        } catch (error) {
          alert.notificationsSent.push({
            channel,
            timestamp: new Date(),
            status: 'failed'
          });
          this.logger.error(`发送通知失败: ${channel}`, error);
        }
      }

      await alert.save();
    } catch (error) {
      this.logger.error('发送告警通知失败', error);
      throw error;
    }
  }

  /**
   * 评估规则条件
   */
  private async evaluateConditions(conditions: any[], metrics: any): Promise<boolean> {
    for (const condition of conditions) {
      const value = metrics[condition.metric];
      if (!value) continue;

      switch (condition.operator) {
        case 'gt':
          if (!(value > condition.value)) return false;
          break;
        case 'lt':
          if (!(value < condition.value)) return false;
          break;
        case 'eq':
          if (value !== condition.value) return false;
          break;
        case 'ne':
          if (value === condition.value) return false;
          break;
        case 'gte':
          if (!(value >= condition.value)) return false;
          break;
        case 'lte':
          if (!(value <= condition.value)) return false;
          break;
      }
    }

    return true;
  }

  /**
   * 检查冷却时间
   */
  private async isInCooldown(ruleId: string): Promise<boolean> {
    const rule = await AlertRule.findById(ruleId);
    if (!rule?.lastTriggered) return false;

    const cooldownEnd = new Date(rule.lastTriggered.getTime() + rule.cooldown * 1000);
    return new Date() < cooldownEnd;
  }

  /**
   * 更新规则触发时间
   */
  private async updateRuleLastTriggered(ruleId: string) {
    await AlertRule.findByIdAndUpdate(ruleId, {
      lastTriggered: new Date()
    });
  }

  /**
   * 更新规则缓存
   */
  private async updateRulesCache() {
    const rules = await AlertRule.find({ enabled: true });
    await this.redis.setex('alert:rules', 3600, JSON.stringify(rules));
  }

  /**
   * 获取活动规则
   */
  private async getActiveRules(type: string) {
    const cachedRules = await this.redis.get('alert:rules');
    if (cachedRules) {
      const rules = JSON.parse(cachedRules);
      return rules.filter((r: any) => r.type === type);
    }

    return AlertRule.find({ type, enabled: true });
  }
} 