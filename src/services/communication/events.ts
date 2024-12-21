/**
 * @fileoverview TS 文件 events.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 系统事件定义
 */

// 服务生命周期事件
export const ServiceEvents = {
  STARTED: 'service.started',
  STOPPED: 'service.stopped',
  FAILED: 'service.failed',
  CONFIG_CHANGED: 'service.config_changed',
  HEALTH_CHECK: 'service.health_check',
} as const;

// 数据事件
export const DataEvents = {
  CREATED: 'data.created',
  UPDATED: 'data.updated',
  DELETED: 'data.deleted',
  ARCHIVED: 'data.archived',
  RESTORED: 'data.restored',
  VALIDATED: 'data.validated',
  COMPRESSED: 'data.compressed',
  SYNCHRONIZED: 'data.synchronized',
} as const;

// 监控事件
export const MonitoringEvents = {
  METRIC_COLLECTED: 'monitoring.metric_collected',
  ALERT_TRIGGERED: 'monitoring.alert_triggered',
  ALERT_RESOLVED: 'monitoring.alert_resolved',
  THRESHOLD_EXCEEDED: 'monitoring.threshold_exceeded',
  PERFORMANCE_DEGRADED: 'monitoring.performance_degraded',
  RESOURCE_EXHAUSTED: 'monitoring.resource_exhausted',
} as const;

// 安全事件
export const SecurityEvents = {
  AUTH_SUCCESS: 'security.auth_success',
  AUTH_FAILED: 'security.auth_failed',
  ACCESS_DENIED: 'security.access_denied',
  AUDIT_LOG: 'security.audit_log',
  ENCRYPTION_FAILED: 'security.encryption_failed',
  SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
} as const;

// 分析事件
export const AnalysisEvents = {
  ANALYSIS_STARTED: 'analysis.started',
  ANALYSIS_COMPLETED: 'analysis.completed',
  ANALYSIS_FAILED: 'analysis.failed',
  INSIGHT_GENERATED: 'analysis.insight_generated',
  PREDICTION_UPDATED: 'analysis.prediction_updated',
  ANOMALY_DETECTED: 'analysis.anomaly_detected',
} as const;

// 仪表板事件
export const DashboardEvents = {
  WIDGET_ADDED: 'dashboard.widget_added',
  WIDGET_REMOVED: 'dashboard.widget_removed',
  WIDGET_UPDATED: 'dashboard.widget_updated',
  LAYOUT_CHANGED: 'dashboard.layout_changed',
  DATA_REFRESHED: 'dashboard.data_refreshed',
  FILTER_APPLIED: 'dashboard.filter_applied',
} as const;

// 用户交互事件
export const UserEvents = {
  LOGIN: 'user.login',
  LOGOUT: 'user.logout',
  PROFILE_UPDATED: 'user.profile_updated',
  PREFERENCE_CHANGED: 'user.preference_changed',
  NOTIFICATION_SENT: 'user.notification_sent',
  FEEDBACK_SUBMITTED: 'user.feedback_submitted',
} as const;

// 系统事件
export const SystemEvents = {
  STARTUP: 'system.startup',
  SHUTDOWN: 'system.shutdown',
  ERROR: 'system.error',
  WARNING: 'system.warning',
  MAINTENANCE_STARTED: 'system.maintenance_started',
  MAINTENANCE_COMPLETED: 'system.maintenance_completed',
} as const;

// 集成事件
export const IntegrationEvents = {
  CONNECTED: 'integration.connected',
  DISCONNECTED: 'integration.disconnected',
  SYNC_STARTED: 'integration.sync_started',
  SYNC_COMPLETED: 'integration.sync_completed',
  SYNC_FAILED: 'integration.sync_failed',
  DATA_RECEIVED: 'integration.data_received',
} as const;

// 报告事件
export const ReportEvents = {
  GENERATION_STARTED: 'report.generation_started',
  GENERATION_COMPLETED: 'report.generation_completed',
  GENERATION_FAILED: 'report.generation_failed',
  EXPORTED: 'report.exported',
  SHARED: 'report.shared',
  TEMPLATE_UPDATED: 'report.template_updated',
} as const;

// 事件优先级
export enum EventPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

// 事件源
export enum EventSource {
  SYSTEM = 'system',
  USER = 'user',
  SERVICE = 'service',
  INTEGRATION = 'integration',
  SCHEDULER = 'scheduler',
  MONITOR = 'monitor',
}

// 事件类型接口
export interface IEventTypes {
  /** service 的描述 */
  service: typeof ServiceEvents;
  /** data 的描述 */
  data: typeof DataEvents;
  /** monitoring 的描述 */
  monitoring: typeof MonitoringEvents;
  /** security 的描述 */
  security: typeof SecurityEvents;
  /** analysis 的描述 */
  analysis: typeof AnalysisEvents;
  /** dashboard 的描述 */
  dashboard: typeof DashboardEvents;
  /** user 的描述 */
  user: typeof UserEvents;
  /** system 的描述 */
  system: typeof SystemEvents;
  /** integration 的描述 */
  integration: typeof IntegrationEvents;
  /** report 的描述 */
  report: typeof ReportEvents;
}

// 导出所有事件类型
export const EventTypes: IEventTypes = {
  service: ServiceEvents,
  data: DataEvents,
  monitoring: MonitoringEvents,
  security: SecurityEvents,
  analysis: AnalysisEvents,
  dashboard: DashboardEvents,
  user: UserEvents,
  system: SystemEvents,
  integration: IntegrationEvents,
  report: ReportEvents,
};
