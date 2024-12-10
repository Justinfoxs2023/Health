import { Injectable } from '@nestjs/common';
import { Logger } from '../../infrastructure/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { Alert } from './monitoring.types';
import { RedisService } from '@nestjs/redis';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AlertService {
  private readonly alertsKey = 'monitoring:alerts';
  private readonly recoveryScripts: Map<string, () => Promise<boolean>>;

  constructor(
    private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly notification: NotificationService
  ) {
    this.recoveryScripts = new Map();
    this.initializeRecoveryScripts();
  }

  // 创建告警
  async createAlert(data: Partial<Alert>): Promise<Alert> {
    try {
      const alert: Alert = {
        id: this.generateAlertId(),
        type: data.type,
        severity: data.severity,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        content: data.content,
        impact: data.impact || { services: [] },
        ...data
      };

      // 保存告警
      await this.saveAlert(alert);

      // 发送通知
      await this.notifyAlert(alert);

      // 尝试自动恢复
      if (alert.autoRecovery?.enabled) {
        await this.attemptAutoRecovery(alert);
      }

      return alert;
    } catch (error) {
      this.logger.error('Failed to create alert:', error);
      throw error;
    }
  }

  // 更新告警状态
  async updateAlertStatus(
    alertId: string,
    status: Alert['status'],
    userId?: string
  ): Promise<void> {
    try {
      const alert = await this.getAlert(alertId);
      if (!alert) {
        throw new Error(`Alert not found: ${alertId}`);
      }

      const updatedAlert: Alert = {
        ...alert,
        status,
        updatedAt: new Date(),
        resolution: {
          ...alert.resolution,
          ...(status === 'acknowledged' && {
            acknowledgedBy: userId,
            acknowledgedAt: new Date()
          }),
          ...(status === 'resolved' && {
            resolvedBy: userId,
            resolvedAt: new Date()
          })
        }
      };

      await this.saveAlert(updatedAlert);
      await this.notifyAlertUpdate(updatedAlert);
    } catch (error) {
      this.logger.error('Failed to update alert status:', error);
      throw error;
    }
  }

  // 获取活跃告警
  async getActiveAlerts(): Promise<Alert[]> {
    try {
      const alerts = await this.getAllAlerts();
      return alerts.filter(alert => alert.status === 'active');
    } catch (error) {
      this.logger.error('Failed to get active alerts:', error);
      throw error;
    }
  }

  // 自动恢复尝试
  async attemptAutoRecovery(alert: Alert): Promise<boolean> {
    try {
      if (!alert.autoRecovery?.enabled) {
        return false;
      }

      const recoveryScript = this.recoveryScripts.get(alert.type);
      if (!recoveryScript) {
        this.logger.warn(`No recovery script found for alert type: ${alert.type}`);
        return false;
      }

      const attempts = alert.autoRecovery.attempts || 0;
      const maxAttempts = this.config.get('alerts.maxRecoveryAttempts', 3);

      if (attempts >= maxAttempts) {
        this.logger.warn(`Max recovery attempts reached for alert: ${alert.id}`);
        return false;
      }

      const success = await recoveryScript();
      const updatedAlert: Alert = {
        ...alert,
        autoRecovery: {
          ...alert.autoRecovery,
          attempts: attempts + 1,
          lastAttempt: new Date(),
          success
        }
      };

      if (success) {
        updatedAlert.status = 'resolved';
        updatedAlert.resolution = {
          resolvedBy: 'system',
          resolvedAt: new Date(),
          action: 'auto-recovery',
          notes: 'Automatically resolved by system recovery script'
        };
      }

      await this.saveAlert(updatedAlert);
      return success;
    } catch (error) {
      this.logger.error('Auto recovery failed:', error);
      return false;
    }
  }

  // 告警统计
  async getAlertStatistics(period: { start: Date; end: Date }): Promise<any> {
    try {
      const alerts = await this.getAllAlerts();
      const filteredAlerts = alerts.filter(
        alert => alert.createdAt >= period.start && alert.createdAt <= period.end
      );

      return {
        total: filteredAlerts.length,
        bySeverity: this.groupBy(filteredAlerts, 'severity'),
        byType: this.groupBy(filteredAlerts, 'type'),
        mttr: this.calculateMTTR(filteredAlerts),
        topIssues: this.getTopIssues(filteredAlerts)
      };
    } catch (error) {
      this.logger.error('Failed to get alert statistics:', error);
      throw error;
    }
  }

  // 私有辅助方法
  private initializeRecoveryScripts(): void {
    // 实现恢复脚本初始化逻辑
    this.recoveryScripts.set('resource', async () => {
      // 实现资源问题恢复逻辑
      return true;
    });

    this.recoveryScripts.set('performance', async () => {
      // 实现性能问题恢复逻辑
      return true;
    });
  }

  private async saveAlert(alert: Alert): Promise<void> {
    const key = `${this.alertsKey}:${alert.id}`;
    await this.redis.set(key, JSON.stringify(alert));
  }

  private async getAlert(alertId: string): Promise<Alert | null> {
    const key = `${this.alertsKey}:${alertId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  private async getAllAlerts(): Promise<Alert[]> {
    const keys = await this.redis.keys(`${this.alertsKey}:*`);
    const alerts = await Promise.all(
      keys.map(key => this.redis.get(key))
    );
    return alerts.map(data => JSON.parse(data));
  }

  private async notifyAlert(alert: Alert): Promise<void> {
    const template = this.getNotificationTemplate(alert);
    await this.notification.send({
      type: 'alert',
      severity: alert.severity,
      title: template.title,
      content: template.content,
      metadata: {
        alertId: alert.id,
        type: alert.type
      }
    });
  }

  private async notifyAlertUpdate(alert: Alert): Promise<void> {
    const template = this.getUpdateTemplate(alert);
    await this.notification.send({
      type: 'alert-update',
      severity: alert.severity,
      title: template.title,
      content: template.content,
      metadata: {
        alertId: alert.id,
        type: alert.type,
        status: alert.status
      }
    });
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private groupBy(alerts: Alert[], key: keyof Alert): Record<string, number> {
    return alerts.reduce((acc, alert) => {
      const value = String(alert[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateMTTR(alerts: Alert[]): number {
    const resolvedAlerts = alerts.filter(
      alert => alert.status === 'resolved' && alert.resolution
    );

    if (resolvedAlerts.length === 0) {
      return 0;
    }

    const totalResolutionTime = resolvedAlerts.reduce((sum, alert) => {
      const resolutionTime = alert.resolution.resolvedAt.getTime() - 
                           alert.createdAt.getTime();
      return sum + resolutionTime;
    }, 0);

    return totalResolutionTime / resolvedAlerts.length / (1000 * 60); // 转换为分钟
  }

  private getTopIssues(alerts: Alert[]): any[] {
    const issues = alerts.reduce((acc, alert) => {
      const key = `${alert.type}:${alert.content.title}`;
      if (!acc[key]) {
        acc[key] = {
          type: alert.type,
          title: alert.content.title,
          count: 0,
          impact: 0
        };
      }
      acc[key].count++;
      acc[key].impact += alert.impact.users || 0;
      return acc;
    }, {});

    return Object.values(issues)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);
  }

  private getNotificationTemplate(alert: Alert): { title: string; content: string } {
    // 实现告警通知模板生成逻辑
    return {
      title: `[${alert.severity.toUpperCase()}] ${alert.content.title}`,
      content: alert.content.message
    };
  }

  private getUpdateTemplate(alert: Alert): { title: string; content: string } {
    // 实现告警更新通知模板生成逻辑
    return {
      title: `Alert Status Update: ${alert.content.title}`,
      content: `Alert status changed to ${alert.status}`
    };
  }
} 