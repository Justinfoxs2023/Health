export type AdviceCategory = 'diet' | 'exercise' | 'lifestyle' | 'medical';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface HealthAdvice {
  categories: CategoryAdvice[];
  priority: PriorityLevel;
  timeframe: string;
  goals: HealthGoal[];
}

export interface CategoryAdvice {
  type: AdviceCategory;
  recommendations: Recommendation[];
}

export interface Recommendation {
  title: string;
  description: string;
  actions: string[];
  expectedOutcomes: string[];
  timeframe: string;
  priority: PriorityLevel;
  precautions?: string[];
}

export interface HealthGoal {
  category: AdviceCategory;
  description: string;
  target: any;
  timeline: string;
  milestones: Milestone[];
}

export interface Milestone {
  description: string;
  target: any;
  deadline: Date;
  completed: boolean;
} 