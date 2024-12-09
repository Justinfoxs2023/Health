import { BaseHealthData } from '../../health/types/health-base.types';
import { ExercisePlan } from '../../exercise/types/exercise.types';
import { NutritionPlan } from '../../nutrition/types/nutrition.types';
import { RehabPlan } from '../../rehabilitation/types/rehabilitation.types';
import { MedicationPlan } from '../../medication/types/medication.types';

// 综合健康评估
export interface HealthAssessment extends BaseHealthData {
  data: {
    exercise: any; // 运动数据
    nutrition: any; // 营养数据
    rehabilitation: any; // 康复数据
    medication: any; // 用药数据
    vitalSigns: any; // 生命体征
  };
  analysis: {
    overall: number; // 总体健康评分
    risks: HealthRisk[];
    improvements: string[];
    concerns: string[];
  };
  recommendations: HealthRecommendation[];
}

// 健康风险
export interface HealthRisk {
  type: string;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  factors: string[];
  preventiveMeasures: string[];
}

// 健康建议
export interface HealthRecommendation {
  category: 'exercise' | 'nutrition' | 'medication' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  content: string;
  reason: string;
  actions: string[];
}

// 整合健康计划
export interface IntegratedHealthPlan extends BaseHealthData {
  plans: {
    exercise: ExercisePlan;
    nutrition: NutritionPlan;
    rehabilitation: RehabPlan;
    medication: MedicationPlan;
  };
  schedule: Schedule;
  monitoring: MonitoringPlan;
}

// 计划冲突
export interface PlanConflict {
  type: 'timing' | 'interaction' | 'contradiction';
  severity: 'low' | 'moderate' | 'high';
  plans: string[];
  description: string;
  resolutionOptions: string[];
}

// 优化后的计划
export interface OptimizedPlans {
  exercise: ExercisePlan;
  nutrition: NutritionPlan;
  rehabilitation: RehabPlan;
  medication: MedicationPlan;
  adjustments: PlanAdjustment[];
}

// 计划调整
export interface PlanAdjustment {
  planType: string;
  original: any;
  modified: any;
  reason: string;
  impact: string[];
}

// 日程安排
export interface Schedule {
  daily: DailySchedule[];
  weekly: WeeklySchedule;
  special: SpecialEvent[];
}

// 每日日程
export interface DailySchedule {
  date: Date;
  activities: ScheduledActivity[];
  reminders: Reminder[];
  flexibility: 'strict' | 'moderate' | 'flexible';
}

// 每周日程
export interface WeeklySchedule {
  pattern: Record<string, ScheduledActivity[]>;
  variations: Record<string, string[]>;
}

// 特殊事件
export interface SpecialEvent {
  date: Date;
  type: string;
  description: string;
  requirements: string[];
  adjustments: Record<string, any>;
}

// 监测计划
export interface MonitoringPlan {
  metrics: MonitoringMetric[];
  frequency: Record<string, string>;
  thresholds: Record<string, [number, number]>;
  alerts: AlertConfig[];
}

// 监测指标
export interface MonitoringMetric {
  name: string;
  type: string;
  unit: string;
  method: string;
  importance: 'critical' | 'important' | 'optional';
}

// 预警配置
export interface AlertConfig {
  metric: string;
  conditions: AlertCondition[];
  actions: AlertAction[];
}

// 预警条件
export interface AlertCondition {
  type: 'threshold' | 'trend' | 'pattern';
  parameters: Record<string, any>;
  duration: number;
}

// 预警动作
export interface AlertAction {
  type: string;
  priority: number;
  recipients: string[];
  message: string;
}

// 远程医疗会话
export interface TelemedicineSession extends BaseHealthData {
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  provider: {
    id: string;
    name: string;
    specialty: string;
  };
  healthData: HealthAssessment;
  notes: string[];
}

// 紧急情况
export interface EmergencySituation {
  type: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  symptoms: string[];
  vitalSigns: Record<string, number>;
  location: {
    coordinates: [number, number];
    address: string;
  };
}

// 紧急响应
export interface EmergencyResponse {
  situation: EmergencySituation;
  assessment: {
    severity: EmergencySeverity;
    risks: string[];
    requirements: string[];
  };
  actions: EmergencyAction[];
  status: 'initiated' | 'in-progress' | 'resolved';
}

// 紧急程度
export type EmergencySeverity = 'low' | 'moderate' | 'high' | 'critical';

// 紧急行动
export interface EmergencyAction {
  type: string;
  priority: number;
  description: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// 计划活动
export interface ScheduledActivity {
  id: string;
  type: string;
  startTime: string;
  duration: number;
  description: string;
  requirements: string[];
  status: 'scheduled' | 'completed' | 'skipped';
}

// 提醒
export interface Reminder {
  id: string;
  time: string;
  type: string;
  message: string;
  priority: number;
  status: 'pending' | 'sent' | 'acknowledged';
} 