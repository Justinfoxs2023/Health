import { BaseHealthData } from '../../health/types/health-base.types';

// 健康状况
export interface HealthCondition {
  id: string;
  name: string;
  type: 'injury' | 'chronic' | 'postoperative' | 'developmental';
  severity: 'mild' | 'moderate' | 'severe';
  affectedAreas: string[];
  symptoms: string[];
  diagnosis: {
    date: Date;
    doctor: string;
    facility: string;
    notes: string;
  };
}

// 康复计划
export interface RehabPlan extends BaseHealthData {
  condition: HealthCondition;
  status: 'active' | 'completed' | 'suspended';
  
  // 康复目标
  goals: {
    functional: string[];
    physical: string[];
    lifestyle: string[];
    timeline: {
      start: Date;
      estimatedEnd: Date;
      milestones: Array<{
        date: Date;
        description: string;
        achieved: boolean;
      }>;
    };
  };

  // 治疗方案
  treatments: Array<{
    type: 'exercise' | 'therapy' | 'medication' | 'device';
    name: string;
    frequency: string;
    duration: number;
    intensity?: string;
    instructions: string[];
    contraindications?: string[];
  }>;

  // 进度追踪
  progress: {
    painLevel: number[];
    mobility: number[];
    strength: number[];
    function: number[];
    measurements: Record<string, number[]>;
    notes: Array<{
      date: Date;
      content: string;
      author: string;
    }>;
  };
}

// 进度评估
export interface ProgressEvaluation {
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    overall: number;
    pain: number;
    mobility: number;
    strength: number;
    function: number;
  };
  achievements: Array<{
    goal: string;
    progress: number;
    status: 'ahead' | 'onTrack' | 'behind';
  }>;
  analysis: {
    improvements: string[];
    challenges: string[];
    recommendations: string[];
  };
  nextSteps: {
    adjustments: string[];
    focus: string[];
    timeline: string[];
  };
}

// 康复会话
export interface RehabSession extends BaseHealthData {
  planId: string;
  type: 'exercise' | 'therapy' | 'assessment';
  duration: number;
  
  activities: Array<{
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    intensity?: string;
    completion: number;
    notes?: string;
  }>;

  measurements: {
    painBefore: number;
    painAfter: number;
    fatigue: number;
    performance: number;
    metrics: Record<string, number>;
  };

  feedback: {
    difficulty: number;
    comfort: number;
    satisfaction: number;
    comments: string;
  };

  therapistNotes?: {
    observations: string[];
    adjustments: string[];
    recommendations: string[];
  };
} 