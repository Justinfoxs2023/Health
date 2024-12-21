/**
 * @fileoverview TS 文件 treatment.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用药计划
export interface IMedicationPlan extends BaseHealthData {
  /** medication 的描述 */
  medication: {
    name: string;
    genericName: string;
    category: string;
    form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'other';
    strength: string;
  };
  /** dosage 的描述 */
  dosage: {
    amount: number;
    unit: string;
    frequency: string;
    timing: string[];
    duration: number; // 天数
    withFood: boolean;
  };
  /** purpose 的描述 */
  purpose: string;
  /** precautions 的描述 */
  precautions: string[];
  /** sideEffects 的描述 */
  sideEffects: string[];
  /** interactions 的描述 */
  interactions: {
    medications: string[];
    foods: string[];
    conditions: string[];
  };
  /** compliance 的描述 */
  compliance: {
    adherenceRate: number;
    missedDoses: number;
    sideEffectsReported: string[];
  };
}

// 治疗方案
export interface ITherapyPlan extends BaseHealthData {
  /** type 的描述 */
  type: "physical" | "other" | "occupational" | "speech" | "psychological";
  /** schedule 的描述 */
  schedule: {
    frequency: number; // 每周次数
    duration: number; // 每次时长(分钟)
    totalSessions: number;
    preferredTime: string[];
  };
  /** protocol 的描述 */
  protocol: {
    procedures: string[];
    equipment: string[];
    precautions: string[];
    progressionCriteria: string[];
  };
  /** goals 的描述 */
  goals: {
    shortTerm: string[];
    longTerm: string[];
    milestones: Array<{
      description: string;
      targetDate: Date;
      achieved: boolean;
    }>;
  };
  /** progress 的描述 */
  progress: {
    sessionsCompleted: number;
    adherenceRate: number;
    outcomes: Array<{
      metric: string;
      initial: number;
      current: number;
      target: number;
    }>;
  };
}

// 生活方式指导
export interface ILifestyleGuide extends BaseHealthData {
  /** diet 的描述 */
  diet: {
    type: string;
    restrictions: string[];
    recommendations: string[];
    mealPlanning: {
      schedule: string[];
      portions: Record<string, string>;
      suggestions: string[];
    };
  };
  /** exercise 的描述 */
  exercise: {
    type: string[];
    intensity: string;
    frequency: string;
    duration: string;
    restrictions: string[];
    recommendations: string[];
  };
  /** sleep 的描述 */
  sleep: {
    recommendedHours: number;
    schedule: {
      bedtime: string;
      wakeTime: string;
    };
    habits: string[];
    restrictions: string[];
  };
  /** stressManagement 的描述 */
  stressManagement: {
    techniques: string[];
    triggers: string[];
    copingStrategies: string[];
    resources: string[];
  };
  /** monitoring 的描述 */
  monitoring: {
    metrics: string[];
    frequency: string;
    methods: string[];
    thresholds: Record<string, [number, number]>;
  };
}
