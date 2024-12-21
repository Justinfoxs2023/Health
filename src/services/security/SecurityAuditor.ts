import { CacheManager } from '../cache/cache-manager.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from '../events/event-emitter.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';

interface IAuditLog {
  /** id 的描述 */
    id: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: access  modification  security  system;
  level: info  warning  error  critical;
  actor: {
    id: string;
    type: user  system  service;
    ip: string;
  };
  action: {
    type: string;
    target: string;
    details: any;
  };
  result: 'success' | 'failure';
  metadata?: any;
}

interface ISecurityPolicy {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: access  encryption  audit;
  rules: Array{
    condition: any;
    action: any;
  }>;
  enabled: boolean;
}

interface IAccessControl {
  /** resource 的描述 */
    resource: string;
  /** permissions 的描述 */
    permissions: Array{
    role: string;
    actions: string;
    conditions: any;
  }>;
}

@Injectable()
export class SecurityAuditor {
  private auditLogs: IAuditLog[] = [];
  private securityPolicies = new Map<string, ISecurityPolicy>();
  private accessControls = new Map<string, IAccessControl>();
  private readonly logRetention = 90 * 24 * 60 * 60 * 1000; // 90天

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter,
    private readonly cache: CacheManager,
  ) {
    this.initialize();
  }

  private async initialize() {
    try {
      await this.loadSecurityPolicies();
      await this.setupAuditLogging();
      await this.startSecurityMonitoring();
      this.logger.info('安全审计服务初始化完成');
    } catch (error) {
      this.logger.error('安全审计服务初始化失败', error);
      throw error;
    }
  }

  // 记录审计日志
  async logAudit(log: Omit<IAuditLog, 'id' | 'timestamp'>): Promise<void> {
    const timer = this.metrics.startTimer('log_audit');
    try {
      const auditLog: IAuditLog = {
        id: this.generateLogId(),
        timestamp: new Date(),
        ...log,
      };

      // 保存日志
      await this.saveAuditLog(auditLog);

      // 检查安全策略
      await this.checkSecurityPolicies(auditLog);

      // 发送事件
      this.eventEmitter.emit('audit:logged', {
        logId: auditLog.id,
        type: auditLog.type,
        level: auditLog.level,
      });

      this.metrics.increment('audit_log_created');
      timer.end();
    } catch (error) {
      this.metrics.increment('audit_log_error');
      timer.end();
      throw error;
    }
  }

  // 检查访问权限
  async checkAccess(actorId: string, resource: string, action: string): Promise<boolean> {
    const timer = this.metrics.startTimer('check_access');
    try {
      // 获取访问控制配置
      const control = this.accessControls.get(resource);
      if (!control) {
        this.metrics.increment('access_control_missing');
        return false;
      }

      // 获取用户角色
      const roles = await this.getUserRoles(actorId);

      // 检查权限
      const hasPermission = roles.some(role => {
        const permission = control.permissions.find(p => p.role === role);
        return permission && permission.actions.includes(action);
      });

      // 记录审计
      await this.logAudit({
        type: 'access',
        level: hasPermission ? 'info' : 'warning',
        actor: {
          id: actorId,
          type: 'user',
        },
        action: {
          type: action,
          target: resource,
          details: { roles },
        },
        result: hasPermission ? 'success' : 'failure',
      });

      this.metrics.increment(hasPermission ? 'access_granted' : 'access_denied');
      timer.end();
      return hasPermission;
    } catch (error) {
      this.metrics.increment('access_check_error');
      timer.end();
      throw error;
    }
  }

  // 加密数据
  async encryptData(
    data: any,
    options: {
      algorithm?: string;
      keySize?: number;
      metadata?: any;
    } = {},
  ): Promise<{ encrypted: any; metadata: any }> {
    const timer = this.metrics.startTimer('encrypt_data');
    try {
      // 选择加密算法
      const algorithm = options.algorithm || 'AES-256-GCM';

      // 生成加密密钥
      const key = await this.generateEncryptionKey(options.keySize);

      // 加密数据
      const encrypted = await this.performEncryption(data, key, algorithm);

      // 记录审计
      await this.logAudit({
        type: 'security',
        level: 'info',
        actor: {
          id: 'system',
          type: 'system',
        },
        action: {
          type: 'encrypt',
          target: 'data',
          details: {
            algorithm,
            keySize: options.keySize,
            metadata: options.metadata,
          },
        },
        result: 'success',
      });

      this.metrics.increment('data_encryption_success');
      timer.end();

      return {
        encrypted,
        metadata: {
          algorithm,
          keyId: key.id,
          timestamp: new Date(),
          ...options.metadata,
        },
      };
    } catch (error) {
      this.metrics.increment('data_encryption_error');
      timer.end();
      throw error;
    }
  }

  // 解密数据
  async decryptData(encrypted: any, metadata: any): Promise<any> {
    const timer = this.metrics.startTimer('decrypt_data');
    try {
      // 获取解密密钥
      const key = await this.getDecryptionKey(metadata.keyId);

      // 解密数据
      const decrypted = await this.performDecryption(encrypted, key, metadata.algorithm);

      // 记录审计
      await this.logAudit({
        type: 'security',
        level: 'info',
        actor: {
          id: 'system',
          type: 'system',
        },
        action: {
          type: 'decrypt',
          target: 'data',
          details: {
            algorithm: metadata.algorithm,
            keyId: metadata.keyId,
            metadata: metadata,
          },
        },
        result: 'success',
      });

      this.metrics.increment('data_decryption_success');
      timer.end();
      return decrypted;
    } catch (error) {
      this.metrics.increment('data_decryption_error');
      timer.end();
      throw error;
    }
  }

  // 获取审计日志
  async getAuditLogs(query: {
    startTime?: Date;
    endTime?: Date;
    type?: string;
    level?: string;
    actorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: IAuditLog[];
    total: number;
  }> {
    const timer = this.metrics.startTimer('get_audit_logs');
    try {
      let logs = this.auditLogs;

      // 应用过滤条件
      if (query.startTime) {
        logs = logs.filter(log => log.timestamp >= query.startTime);
      }
      if (query.endTime) {
        logs = logs.filter(log => log.timestamp <= query.endTime);
      }
      if (query.type) {
        logs = logs.filter(log => log.type === query.type);
      }
      if (query.level) {
        logs = logs.filter(log => log.level === query.level);
      }
      if (query.actorId) {
        logs = logs.filter(log => log.actor.id === query.actorId);
      }

      // 计算总数
      const total = logs.length;

      // 应用分页
      const offset = query.offset || 0;
      const limit = query.limit || 50;
      logs = logs.slice(offset, offset + limit);

      this.metrics.increment('audit_logs_retrieved');
      timer.end();

      return { logs, total };
    } catch (error) {
      this.metrics.increment('get_audit_logs_error');
      timer.end();
      throw error;
    }
  }

  // 添加安全策略
  async addSecurityPolicy(policy: ISecurityPolicy): Promise<void> {
    const timer = this.metrics.startTimer('add_security_policy');
    try {
      // 验证策略
      await this.validateSecurityPolicy(policy);

      // 保存策略
      this.securityPolicies.set(policy.id, policy);

      // 记录审计
      await this.logAudit({
        type: 'security',
        level: 'info',
        actor: {
          id: 'system',
          type: 'system',
        },
        action: {
          type: 'add_policy',
          target: policy.id,
          details: policy,
        },
        result: 'success',
      });

      this.metrics.increment('security_policy_added');
      timer.end();
    } catch (error) {
      this.metrics.increment('add_security_policy_error');
      timer.end();
      throw error;
    }
  }

  // 更新访问控制
  async updateAccessControl(control: IAccessControl): Promise<void> {
    const timer = this.metrics.startTimer('update_access_control');
    try {
      // 验证访问控制配置
      await this.validateAccessControl(control);

      // 更新配置
      this.accessControls.set(control.resource, control);

      // 记录审计
      await this.logAudit({
        type: 'security',
        level: 'info',
        actor: {
          id: 'system',
          type: 'system',
        },
        action: {
          type: 'update_access_control',
          target: control.resource,
          details: control,
        },
        result: 'success',
      });

      this.metrics.increment('access_control_updated');
      timer.end();
    } catch (error) {
      this.metrics.increment('update_access_control_error');
      timer.end();
      throw error;
    }
  }

  // 生成安全报告
  async generateSecurityReport(): Promise<any> {
    const timer = this.metrics.startTimer('generate_security_report');
    try {
      const now = new Date();
      const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // 获取最近的审计日志
      const recentLogs = this.auditLogs.filter(log => log.timestamp >= lastDay);

      // 分析安全事件
      const securityEvents = this.analyzeSecurityEvents(recentLogs);

      // 分析访问模式
      const accessPatterns = this.analyzeAccessPatterns(recentLogs);

      // 生成建议
      const recommendations = await this.generateSecurityRecommendations(
        securityEvents,
        accessPatterns,
      );

      this.metrics.increment('security_report_generated');
      timer.end();

      return {
        timestamp: now,
        period: {
          start: lastDay,
          end: now,
        },
        summary: {
          totalEvents: recentLogs.length,
          securityEvents,
          accessPatterns,
        },
        recommendations,
      };
    } catch (error) {
      this.metrics.increment('generate_security_report_error');
      timer.end();
      throw error;
    }
  }

  // 分析安全事件
  private analyzeSecurityEvents(logs: IAuditLog[]): any {
    const events = {
      accessDenied: 0,
      authenticationFailures: 0,
      suspiciousActivities: 0,
      policyViolations: 0,
    };

    logs.forEach(log => {
      if (log.result === 'failure') {
        switch (log.type) {
          case 'access':
            events.accessDenied++;
            break;
          case 'security':
            if (log.action.type === 'authenticate') {
              events.authenticationFailures++;
            } else {
              events.suspiciousActivities++;
            }
            break;
          default:
            events.policyViolations++;
        }
      }
    });

    return events;
  }

  // 分析访问模式
  private analyzeAccessPatterns(logs: IAuditLog[]): any {
    const patterns = {
      resourceAccess: new Map<string, number>(),
      userActivity: new Map<string, number>(),
      timeDistribution: new Array(24).fill(0),
    };

    logs.forEach(log => {
      if (log.type === 'access') {
        // 资源访问统计
        const resource = log.action.target;
        patterns.resourceAccess.set(resource, (patterns.resourceAccess.get(resource) || 0) + 1);

        // 用户活动统计
        const userId = log.actor.id;
        patterns.userActivity.set(userId, (patterns.userActivity.get(userId) || 0) + 1);

        // 时间分布统计
        const hour = log.timestamp.getHours();
        patterns.timeDistribution[hour]++;
      }
    });

    return {
      topResources: Array.from(patterns.resourceAccess.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      topUsers: Array.from(patterns.userActivity.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      timeDistribution: patterns.timeDistribution,
    };
  }

  // 生成安全建议
  private async generateSecurityRecommendations(events: any, patterns: any): Promise<any[]> {
    const recommendations = [];

    // 检查访问拒绝率
    if (events.accessDenied > 100) {
      recommendations.push({
        type: 'access_control',
        severity: 'high',
        description: '访问拒绝率过高，建议审查访问控制策略',
        details: {
          current: events.accessDenied,
          threshold: 100,
        },
      });
    }

    // 检查认证失败
    if (events.authenticationFailures > 50) {
      recommendations.push({
        type: 'authentication',
        severity: 'critical',
        description: '认证失败次数过多，建议加强身份验证机制',
        details: {
          current: events.authenticationFailures,
          threshold: 50,
        },
      });
    }

    // 检查可疑活动
    if (events.suspiciousActivities > 20) {
      recommendations.push({
        type: 'security',
        severity: 'high',
        description: '检测到异常活动，建议开启额外的安全监控',
        details: {
          current: events.suspiciousActivities,
          threshold: 20,
        },
      });
    }

    return recommendations;
  }

  // 生成日志ID
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 保存审计日志
  private async saveAuditLog(log: IAuditLog): Promise<void> {
    this.auditLogs.push(log);

    // 清理过期日志
    const cutoff = Date.now() - this.logRetention;
    this.auditLogs = this.auditLogs.filter(l => l.timestamp.getTime() > cutoff);
  }
}
