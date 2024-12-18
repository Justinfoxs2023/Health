import { IBaseHealthData } from '../../health/types/health-base.types';

// 预警配置
export interface IAlertConfig extends IBaseHealthData {
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: "vital_signs" | "medication" | "exercise" | "nutrition" | "sleep" | "mental" | "environmental" | "social" | "rehabilitation" | "chronic_disease" | "emergency";
  /** conditions 的描述 */
    conditions: IAlertCondition[];
  /** actions 的描述 */
    actions: IAlertAction[];
  /** status 的描述 */
    status: "active" | "paused" | "disabled" | "triggered" | "resolved";
  /** priority 的描述 */
    priority: "low" | "medium" | "high" | "critical";
  /** notificationChannels 的描述 */
    notificationChannels: NotificationChannelType[];
}

// 预警类型
export type AlertType =
  any; // 紧急情况

// 预警状态
export type AlertStatusType =
  any; // 已解决

// 预警优先级
export type AlertPriorityType =
  any; // 紧急

// 通知渠道
export type NotificationChannelType =
  any; // 紧急联系人

// 预警历史
export interface IAlertHistory extends IBaseHealthData {
  /** alertId 的描述 */
    alertId: string;
  /** type 的描述 */
    type: "vital_signs" | "medication" | "exercise" | "nutrition" | "sleep" | "mental" | "environmental" | "social" | "rehabilitation" | "chronic_disease" | "emergency";
  /** priority 的描述 */
    priority: "low" | "medium" | "high" | "critical";
  /** triggeredAt 的描述 */
    triggeredAt: Date;
  /** resolvedAt 的描述 */
    resolvedAt?: undefined | Date;
  /** metrics 的描述 */
    metrics: Record<string, any>;
  /** actions 的描述 */
    actions: IAlertActionHistory[];
  /** outcome 的描述 */
    outcome?: undefined | string;
}

// 预警动作历史
export interface IAlertActionHistory {
  /** type 的描述 */
    type: string;
  /** executedAt 的描述 */
    executedAt: Date;
  /** success 的描述 */
    success: false | true;
  /** error 的描述 */
    error: string;
  /** response 的描述 */
    response: any;
}

// 预警规则
export interface IAlertRule {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** conditions 的描述 */
    conditions: IAlertCondition;
  /** actions 的描述 */
    actions: IAlertAction;
  /** priority 的描述 */
    priority: "low" | "medium" | "high" | "critical";
  /** enabled 的描述 */
    enabled: false | true;
}

// 预警条件
export interface IAlertCondition {
  /** type 的描述 */
    type: "threshold" | "trend" | "pattern" | "correlation" | "anomaly" | "composite";
  /** metric 的描述 */
    metric: string;
  /** operator 的描述 */
    operator: "pattern" | "gt" | "lt" | "eq" | "between" | "outside" | "change";
  /** value 的描述 */
    value: number  /** number 的描述 */
    /** number 的描述 */
    number, /** number 的描述 */
    /** number 的描述 */
    number;
  /** duration 的描述 */
    duration: number;
  /** frequency 的描述 */
    frequency: number;
  /** context 的描述 */
    context: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
}

// 条件类型
export type AlertConditionType =
  any; // 组合条件

// 操作符
export type AlertOperatorType =
  any; // 模式匹配

// 预警动作
export interface IAlertAction {
  /** type 的描述 */
    type: "notification" | "message" | "call" | "email" | "webhook" | "automation" | "emergency";
  /** priority 的描述 */
    priority: number;
  /** target 的描述 */
    target: string;
  /** content 的描述 */
    content: string;
  /** delay 的描述 */
    delay: number;
  /** repeat 的描述 */
    repeat: false | true;
  /** conditions 的描述 */
    conditions: IAlertCondition;
}

// 动作类型
export type AlertActionType =
  any; // 紧急响应

// 预警分析
export interface IAlertAnalysis {
  /** alertId 的描述 */
    alertId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** metrics 的描述 */
    metrics: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** conditions 的描述 */
    conditions: Array{
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
export interface IAlertResponse {
  /** alertId 的描述 */
    alertId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: "emergency" | "vital_signs" | "medication" | "exercise" | "nutrition" | "sleep" | "mental" | "environmental" | "social" | "rehabilitation" | "chronic_disease";
  /** priority 的描述 */
    priority: "low" | "medium" | "high" | "critical";
  /** status 的描述 */
    status: "active" | "paused" | "disabled" | "triggered" | "resolved";
  /** metrics 的描述 */
    metrics: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** actions 的描述 */
    actions: IAlertAction;
  /** analysis 的描述 */
    analysis: IAlertAnalysis;
  /** escalation 的描述 */
    escalation: {
    level: number;
    reason: string;
    contacts: string;
  };
}
