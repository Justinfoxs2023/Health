import { IBaseHealthData } from '../../health/types/health-base.types';

// 健康状况
export interface IHealthCondition {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: injury  chronic  postoperative  developmental;
  severity: mild  moderate  severe;
  affectedAreas: string;
  symptoms: string;
  diagnosis: {
    date: Date;
    doctor: string;
    facility: string;
    notes: string;
  };
}

// 康复计划
export interface IRehabPlan extends IBaseHealthData {
  /** condition 的描述 */
    condition: IHealthCondition;
  /** status 的描述 */
    status: "active" | "completed" | "suspended";

  // 康复目标
  /** goals 的描述 */
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
  /** treatments 的描述 */
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
  /** progress 的描述 */
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
export interface IProgressEvaluation {
  /** period 的描述 */
    period: {
    start: Date;
    end: Date;
  };
  /** metrics 的描述 */
    metrics: {
    overall: number;
    pain: number;
    mobility: number;
    strength: number;
    function: number;
  };
  /** achievements 的描述 */
    achievements: Array<{
    goal: string;
    progress: number;
    status: 'ahead' | 'onTrack' | 'behind';
  }>;
  /** analysis 的描述 */
    analysis: {
    improvements: string[];
    challenges: string[];
    recommendations: string[];
  };
  /** nextSteps 的描述 */
    nextSteps: {
    adjustments: string[];
    focus: string[];
    timeline: string[];
  };
}

// 康复会话
export interface IRehabSession extends IBaseHealthData {
  /** planId 的描述 */
    planId: string;
  /** type 的描述 */
    type: "exercise" | "therapy" | "assessment";
  /** duration 的描述 */
    duration: number;

  /** activities 的描述 */
    activities: Array<{
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    intensity?: string;
    completion: number;
    notes?: string;
  }>;

  /** measurements 的描述 */
    measurements: {
    painBefore: number;
    painAfter: number;
    fatigue: number;
    performance: number;
    metrics: Record<string, number>;
  };

  /** feedback 的描述 */
    feedback: {
    difficulty: number;
    comfort: number;
    satisfaction: number;
    comments: string;
  };

  /** therapistNotes 的描述 */
    therapistNotes?: undefined | { observations: string[]; adjustments: string[]; recommendations: string[]; };
}
