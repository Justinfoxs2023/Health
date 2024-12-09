export interface HealthPlan {
  id: string;
  clientId: string;
  advisorId: string;
  goals: HealthGoal[];
  recommendations: HealthRecommendation[];
  schedule: HealthSchedule;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthGoal {
  category: HealthCategory;
  description: string;
  target: {
    metric: string;
    value: number;
    unit: string;
  };
  priority: number;
  deadline: Date;
  progress: number;
}

export type HealthCategory = 
  | 'sleep' 
  | 'stress' 
  | 'diet' 
  | 'exercise' 
  | 'lifestyle' 
  | 'mental';

export interface HealthRecommendation {
  category: HealthCategory;
  title: string;
  description: string;
  actions: string[];
  priority: number;
  frequency?: string;
}

export interface HealthSchedule {
  checkups: Appointment[];
  activities: ScheduledActivity[];
  reminders: HealthReminder[];
}

export interface Appointment {
  type: string;
  date: Date;
  duration: number;
  location?: string;
  notes?: string;
}

export interface ScheduledActivity {
  type: string;
  frequency: string;
  timeOfDay: string;
  duration: number;
  instructions?: string;
}

export interface HealthReminder {
  type: string;
  frequency: string;
  time: string;
  message: string;
}

export interface LifestyleRecord {
  id: string;
  clientId: string;
  date: Date;
  sleep: {
    duration: number;
    quality: number;
    notes?: string;
  };
  stress: {
    level: number;
    factors?: string[];
    notes?: string;
  };
  activities: {
    type: string;
    duration: number;
    intensity?: number;
  }[];
  mood: number;
  notes?: string;
} 