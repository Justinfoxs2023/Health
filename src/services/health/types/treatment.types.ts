// 用药计划
export interface MedicationPlan extends BaseHealthData {
  medication: {
    name: string;
    genericName: string;
    category: string;
    form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'other';
    strength: string;
  };
  dosage: {
    amount: number;
    unit: string;
    frequency: string;
    timing: string[];
    duration: number; // 天数
    withFood: boolean;
  };
  purpose: string;
  precautions: string[];
  sideEffects: string[];
  interactions: {
    medications: string[];
    foods: string[];
    conditions: string[];
  };
  compliance: {
    adherenceRate: number;
    missedDoses: number;
    sideEffectsReported: string[];
  };
}

// 治疗方案
export interface TherapyPlan extends BaseHealthData {
  type: 'physical' | 'occupational' | 'speech' | 'psychological' | 'other';
  schedule: {
    frequency: number; // 每周次数
    duration: number; // 每次时长(分钟)
    totalSessions: number;
    preferredTime: string[];
  };
  protocol: {
    procedures: string[];
    equipment: string[];
    precautions: string[];
    progressionCriteria: string[];
  };
  goals: {
    shortTerm: string[];
    longTerm: string[];
    milestones: Array<{
      description: string;
      targetDate: Date;
      achieved: boolean;
    }>;
  };
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
export interface LifestyleGuide extends BaseHealthData {
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
  exercise: {
    type: string[];
    intensity: string;
    frequency: string;
    duration: string;
    restrictions: string[];
    recommendations: string[];
  };
  sleep: {
    recommendedHours: number;
    schedule: {
      bedtime: string;
      wakeTime: string;
    };
    habits: string[];
    restrictions: string[];
  };
  stressManagement: {
    techniques: string[];
    triggers: string[];
    copingStrategies: string[];
    resources: string[];
  };
  monitoring: {
    metrics: string[];
    frequency: string;
    methods: string[];
    thresholds: Record<string, [number, number]>;
  };
} 