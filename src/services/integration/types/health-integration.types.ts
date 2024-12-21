import { ExercisePlan } from '../../exercise/types/exercise.types';
import { IBaseHealthData } from '../../health/types/health-base.types';
import { IRehabPlan } from '../../rehabilitation/types/rehabilitation.types';
import { MedicationPlan } from '../../medication/types/medication.types';
import { NutritionPlan } from '../../nutrition/types/nutrition.types';

// 综合健康评估
export interface IHealthAssessment extends IBaseHealthData {
  /** data 的描述 */
    data: {
    exercise: any; // 运动数据
    nutrition: any; // 营养数据
    rehabilitation: any; // 康复数据
    medication: any; // 用药数据
    vitalSigns: any; // 生命体征
  };
  /** analysis 的描述 */
    analysis: {
    overall: number; // 总体健康评分
    risks: IHealthRisk[];
    improvements: string[];
    concerns: string[];
  };
  /** recommendations 的描述 */
    recommendations: IHealthRecommendation[];
}

// 健康风险
export interface IHealthRisk {
  /** type 的描述 */
    type: string;
  /** severity 的描述 */
    severity: low  moderate  high;
  description: string;
  factors: string;
  preventiveMeasures: string;
}

// 健康建议
export interface IHealthRecommendation {
  /** category 的描述 */
    category: exercise  nutrition  medication  lifestyle;
  priority: high  medium  low;
  content: string;
  reason: string;
  actions: string;
}

// 整合健康计划
export interface IntegratedHealthPlan extends IBaseHealthData {
  /** plans 的描述 */
    plans: {
    exercise: ExercisePlan;
    nutrition: NutritionPlan;
    rehabilitation: IRehabPlan;
    medication: MedicationPlan;
  };
  /** schedule 的描述 */
    schedule: ISchedule;
  /** monitoring 的描述 */
    monitoring: IMonitoringPlan;
}

// 计划冲突
export interface IPlanConflict {
  /** type 的描述 */
    type: timing  interaction  contradiction;
  severity: low  moderate  high;
  plans: string;
  description: string;
  resolutionOptions: string;
}

// 优化后的计划
export interface IOptimizedPlans {
  /** exercise 的描述 */
    exercise: ExercisePlan;
  /** nutrition 的描述 */
    nutrition: NutritionPlan;
  /** rehabilitation 的描述 */
    rehabilitation: IRehabPlan;
  /** medication 的描述 */
    medication: MedicationPlan;
  /** adjustments 的描述 */
    adjustments: IPlanAdjustment;
}

// 计划调整
export interface IPlanAdjustment {
  /** planType 的描述 */
    planType: string;
  /** original 的描述 */
    original: any;
  /** modified 的描述 */
    modified: any;
  /** reason 的描述 */
    reason: string;
  /** impact 的描述 */
    impact: string;
}

// 日程安排
export interface ISchedule {
  /** daily 的描述 */
    daily: IDailySchedule;
  /** weekly 的描述 */
    weekly: IWeeklySchedule;
  /** special 的描述 */
    special: ISpecialEvent;
}

// 每日日程
export interface IDailySchedule {
  /** date 的描述 */
    date: Date;
  /** activities 的描述 */
    activities: IScheduledActivity;
  /** reminders 的描述 */
    reminders: IReminder;
  /** flexibility 的描述 */
    flexibility: strict  moderate  flexible;
}

// 每周日程
export interface IWeeklySchedule {
  /** pattern 的描述 */
    pattern: Recordstring, /** ScheduledActivity 的描述 */
    /** ScheduledActivity 的描述 */
    ScheduledActivity;
  /** variations 的描述 */
    variations: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
}

// 特殊事件
export interface ISpecialEvent {
  /** date 的描述 */
    date: Date;
  /** type 的描述 */
    type: string;
  /** description 的描述 */
    description: string;
  /** requirements 的描述 */
    requirements: string;
  /** adjustments 的描述 */
    adjustments: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
}

// 监测计划
export interface IMonitoringPlan {
  /** metrics 的描述 */
    metrics: IMonitoringMetric;
  /** frequency 的描述 */
    frequency: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** thresholds 的描述 */
    thresholds: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number, /** number 的描述 */
    /** number 的描述 */
    number;
  /** alerts 的描述 */
    alerts: IAlertConfig;
}

// 监测指标
export interface IMonitoringMetric {
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: string;
  /** unit 的描述 */
    unit: string;
  /** method 的描述 */
    method: string;
  /** importance 的描述 */
    importance: critical  important  optional;
}

// 预警配置
export interface IAlertConfig {
  /** metric 的描述 */
    metric: string;
  /** conditions 的描述 */
    conditions: IAlertCondition;
  /** actions 的描述 */
    actions: IAlertAction;
}

// 预警条件
export interface IAlertCondition {
  /** type 的描述 */
    type: threshold  trend  pattern;
  parameters: Recordstring, any;
  duration: number;
}

// 预警动作
export interface IAlertAction {
  /** type 的描述 */
    type: string;
  /** priority 的描述 */
    priority: number;
  /** recipients 的描述 */
    recipients: string;
  /** message 的描述 */
    message: string;
}

// 远程医疗会话
export interface ITelemedicineSession extends IBaseHealthData {
  /** type 的描述 */
    type: string;
  /** status 的描述 */
    status: "scheduled" | "in-progress" | "completed";
  /** provider 的描述 */
    provider: {
    id: string;
    name: string;
    specialty: string;
  };
  /** healthData 的描述 */
    healthData: IHealthAssessment;
  /** notes 的描述 */
    notes: string[];
}

// 紧急情况
export interface IEmergencySituation {
  /** type 的描述 */
    type: string;
  /** severity 的描述 */
    severity: low  moderate  high  critical;
  symptoms: string;
  vitalSigns: Recordstring, number;
  location: {
    coordinates: number, number;
    address: string;
  };
}

// 紧急响应
export interface IEmergencyResponse {
  /** situation 的描述 */
    situation: IEmergencySituation;
  /** assessment 的描述 */
    assessment: {
    severity: EmergencySeverityType;
    risks: string;
    requirements: string;
  };
  /** actions 的描述 */
    actions: IEmergencyAction[];
  /** status 的描述 */
    status: "in-progress" | "initiated" | "resolved";
}

// 紧急程度
export type EmergencySeverityType = any;

// 紧急行动
export interface IEmergencyAction {
  /** type 的描述 */
    type: string;
  /** priority 的描述 */
    priority: number;
  /** description 的描述 */
    description: string;
  /** assignee 的描述 */
    assignee: string;
  /** status 的描述 */
    status: pending  inprogress  completed;
}

// 计划活动
export interface IScheduledActivity {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: string;
  /** startTime 的描述 */
    startTime: string;
  /** duration 的描述 */
    duration: number;
  /** description 的描述 */
    description: string;
  /** requirements 的描述 */
    requirements: string;
  /** status 的描述 */
    status: scheduled  completed  skipped;
}

// 提醒
export interface IReminder {
  /** id 的描述 */
    id: string;
  /** time 的描述 */
    time: string;
  /** type 的描述 */
    type: string;
  /** message 的描述 */
    message: string;
  /** priority 的描述 */
    priority: number;
  /** status 的描述 */
    status: pending  sent  acknowledged;
}
