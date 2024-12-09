import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { ServiceRegistry } from './service-registry.service';

interface MetricConfig {
  name: string;
  type: 'counter' | 'gauge' | 'histogram';
  labels?: string[];
  description?: string;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: number;
  duration: number;
  severity: 'critical' | 'warning' | 'info';
  actions: AlertAction[];
}

interface AlertAction {
  type: 'email' | 'webhook' | 'notification';
  config: Record<string, any>;
}

export class MonitoringService extends EventEmitter {
  private metrics: Map<string, any>;
  private alertRules: Map<string, AlertRule>;
  private activeAlerts: Map<string, any>;
  private logger: Logger;
  private registry: ServiceRegistry;

  constructor(registry: ServiceRegistry) {
    super();
    this.metrics = new Map();
    this.alertRules = new Map();
    this.activeAlerts = new Map();
    this.logger = new Logger('MonitoringService');
    this.registry = registry;

    this.initializeMetrics();
    this.startMonitoring();
  }

  // 初始化指标
  private initializeMetrics(): void {
    // 系统指标
    this.registerMetric({
      name: 'system_cpu_usage',
      type: 'gauge',
      description: 'CPU使用率'
    });

    this.registerMetric({
      name: 'system_memory_usage',
      type: 'gauge',
      description: '内存使用率'
    });

    // 服务指标
    this.registerMetric({
      name: 'service_health_score',
      type: 'gauge',
      labels: ['service_id', 'service_name'],
      description: '服务健康分数'
    });

    // API指标
    this.registerMetric({
      name: 'api_request_total',
      type: 'counter',
      labels: ['method', 'path', 'status'],
      description: 'API请求总数'
    });
  }

  // 注册指标
  registerMetric(config: MetricConfig): void {
    this.metrics.set(config.name, {
      ...config,
      value: config.type === 'counter' ? 0 : null,
      history: []
    });
  }

  // 更新指标值
  updateMetric(name: string, value: number, labels?: Record<string, string>): void {
    const metric = this.metrics.get(name);
    if (!metric) return;

    if (metric.type === 'counter') {
      metric.value += value;
    } else {
      metric.value = value;
    }

    metric.history.push({
      value,
      labels,
      timestamp: new Date()
    });

    this.checkAlertRules(name, value, labels);
  }

  // 添加告警规则
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
    this.logger.info(`添加告警规则: ${rule.name}`);
  }

  // 检查告警规则
  private checkAlertRules(metricName: string, value: number, labels?: Record<string, string>): void {
    this.alertRules.forEach(rule => {
      if (rule.metric === metricName) {
        const isTriggered = this.evaluateAlertCondition(rule, value);
        
        if (isTriggered && !this.activeAlerts.has(rule.id)) {
          this.triggerAlert(rule, value, labels);
        } else if (!isTriggered && this.activeAlerts.has(rule.id)) {
          this.resolveAlert(rule.id);
        }
      }
    });
  }

  // 触发告警
  private triggerAlert(rule: AlertRule, value: number, labels?: Record<string, string>): void {
    const alert = {
      ruleId: rule.id,
      ruleName: rule.name,
      value,
      labels,
      triggeredAt: new Date(),
      status: 'active'
    };

    this.activeAlerts.set(rule.id, alert);
    this.executeAlertActions(rule, alert);
    this.emit('alert:triggered', alert);
    this.logger.warn(`触发告警: ${rule.name}`);
  }

  // 解除告警
  private resolveAlert(ruleId: string): void {
    const alert = this.activeAlerts.get(ruleId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
      this.activeAlerts.delete(ruleId);
      this.emit('alert:resolved', alert);
      this.logger.info(`解除告警: ${alert.ruleName}`);
    }
  }

  // 执行告警动作
  private executeAlertActions(rule: AlertRule, alert: any): void {
    rule.actions.forEach(action => {
      try {
        switch (action.type) {
          case 'email':
            // 实现邮件通知
            break;
          case 'webhook':
            // 实现webhook调用
            break;
          case 'notification':
            // 实现系统通知
            break;
        }
      } catch (error) {
        this.logger.error(`执行告警动作失败: ${error}`);
      }
    });
  }

  // 评估告警条件
  private evaluateAlertCondition(rule: AlertRule, value: number): boolean {
    try {
      const condition = rule.condition.replace('value', value.toString());
      return eval(condition);
    } catch (error) {
      this.logger.error(`评估告警条件失败: ${error}`);
      return false;
    }
  }

  // 获取指标数据
  getMetrics(): any {
    const result: Record<string, any> = {};
    this.metrics.forEach((metric, name) => {
      result[name] = {
        value: metric.value,
        type: metric.type,
        description: metric.description
      };
    });
    return result;
  }

  // 获取活动告警
  getActiveAlerts(): any[] {
    return Array.from(this.activeAlerts.values());
  }

  // 开始监控
  private startMonitoring(): void {
    // 监控服务健康状态
    setInterval(() => {
      const services = this.registry.getAllServices();
      services.forEach(service => {
        const healthScore = this.calculateServiceHealth(service);
        this.updateMetric('service_health_score', healthScore, {
          service_id: service.id,
          service_name: service.name
        });
      });
    }, 60000);

    // 监控系统资源
    setInterval(() => {
      this.updateSystemMetrics();
    }, 30000);
  }

  // 计算服务健康分数
  private calculateServiceHealth(service: any): number {
    // 实现健康分数计算逻辑
    return 100;
  }

  // 更新系统指标
  private updateSystemMetrics(): void {
    // 实现系统指标更新逻辑
  }

  // 停止监控
  stop(): void {
    // 清理定时器等资源
  }
} 