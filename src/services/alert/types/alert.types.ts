import { BaseHealthData } from '../../health/types/health-base.types';

// 预警配置
export interface AlertConfig extends BaseHealthData {
  userId: string;
  type: AlertType;
  conditions: AlertCondition[];
  actions: AlertAction[];
  status: AlertStatus;
  priority: AlertPriority;
  notificationChannels: NotificationChannel[];
}

// 预警类型
export type AlertType =
  | 'vital_signs'      // 生命体征
  | 'medication'       // 用药提醒
  | 'exercise'         // 运动监测
  | 'nutrition'        // 营养监测
  | 'sleep'           // 睡眠监测
  | 'mental'          // 心理状态
  | 'environmental'   // 环境因素
  | 'social'          // 社交活动
  | 'rehabilitation'  // 康复进展
  | 'chronic_disease' // 慢性病管理
  | 'emergency';      // 紧急情况

// 预警状态
export type AlertStatus = 
  | 'active'    // 活跃
  | 'paused'    // 暂停
  | 'disabled'  // 禁用
  | 'triggered' // 已触发
  | 'resolved'; // 已解决

// 预警优先级
export type AlertPriority = 
  | 'low'      // 低优先级
  | 'medium'   // 中优先级
  | 'high'     // 高优先级
  | 'critical'; // 紧急

// 通知渠道
export type NotificationChannel = 
  | 'app'       // 应用内通知
  | 'sms'       // 短信
  | 'email'     // 邮件
  | 'phone'     // 电话
  | 'wearable'  // 可穿戴设备
  | 'emergency'; // 紧急联系人

// 预警历史
export interface AlertHistory extends BaseHealthData {
  alertId: string;
  type: AlertType;
  priority: AlertPriority;
  triggeredAt: Date;
  resolvedAt?: Date;
  metrics: Record<string, any>;
  actions: AlertActionHistory[];
  outcome?: string;
}

// 预警动作历史
export interface AlertActionHistory {
  type: string;
  executedAt: Date;
  success: boolean;
  error?: string;
  response?: any;
}

// 预警规则
export interface AlertRule {
  id: string;
  name: string;
  description: string;
  conditions: AlertCondition[];
  actions: AlertAction[];
  priority: AlertPriority;
  enabled: boolean;
}

// 预警条件
export interface AlertCondition {
  type: AlertConditionType;
  metric: string;
  operator: AlertOperator;
  value: number | [number, number];
  duration?: number;
  frequency?: number;
  context?: Record<string, any>;
}

// 条件类型
export type AlertConditionType =
  | 'threshold'    // 阈值
  | 'trend'        // 趋势
  | 'pattern'      // 模式
  | 'correlation'  // 相关性
  | 'anomaly'      // 异常
  | 'composite';   // 组合条件

// 操作符
export type AlertOperator =
  | 'gt'       // 大于
  | 'lt'       // 小于
  | 'eq'       // 等于
  | 'between'  // 区间内
  | 'outside'  // 区间外
  | 'change'   // 变化
  | 'pattern'; // 模式匹配

// 预警动作
export interface AlertAction {
  type: AlertActionType;
  priority: number;
  target: string[];
  content: string;
  delay?: number;
  repeat?: boolean;
  conditions?: AlertCondition[];
}

// 动作类型
export type AlertActionType =
  | 'notification'  // 通知
  | 'message'       // 消息
  | 'call'          // 电话
  | 'email'         // 邮件
  | 'webhook'       // 网络钩子
  | 'automation'    // 自动化
  | 'emergency';    // 紧急响应

// 预警分析
export interface AlertAnalysis {
  alertId: string;
  timestamp: Date;
  metrics: Record<string, any>;
  conditions: Array<{
    condition: AlertCondition;
    satisfied: boolean;
    value: any;
    threshold: any;
  }>;
  context: {
    historicalData: any[];
    relatedAlerts: string[];
    environmentalFactors: Record<string, any>;
  };
  risk: {
    level: AlertPriority;
    factors: string[];
    probability: number;
  };
  recommendations: string[];
}

// 预警响应
export interface AlertResponse {
  alertId: string;
  timestamp: Date;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  metrics: Record<string, any>;
  actions: AlertAction[];
  analysis: AlertAnalysis;
  escalation?: {
    level: number;
    reason: string;
    contacts: string[];
  };
} 