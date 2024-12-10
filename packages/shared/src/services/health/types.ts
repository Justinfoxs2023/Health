export interface HealthData {
  vitals: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
  };
  bodyMetrics: {
    height: number;
    weight: number;
    bmi: number;
    bodyFat: number;
    muscleMass: number;
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  };
  activity: {
    steps: number;
    distance: number;
    activeMinutes: number;
    caloriesBurned: number;
  };
  sleep: {
    duration: number;
    quality: number;
    deepSleep: number;
    remSleep: number;
    lightSleep: number;
    awakeTime: number;
  };
  stress: {
    level: number;
    variability: number;
    recoveryTime: number;
  };
}

export interface RiskAlert {
  id: string;
  type: string;
  level: 'low' | 'medium' | 'high';
  message: string;
  timestamp: number;
  data: Record<string, any>;
  handled: boolean;
}

export interface RiskRule {
  id: string;
  type: string;
  condition: (data: HealthData) => boolean;
  level: 'low' | 'medium' | 'high';
  message: string;
  threshold?: number;
  cooldown?: number;
}

export interface HealthRisk {
  type: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  data?: Record<string, any>;
  timestamp?: number;
}

export interface HealthMetric {
  type: string;
  value: number;
  unit: string;
  timestamp: number;
  normalRange?: {
    min: number;
    max: number;
  };
}

export interface HealthTrend {
  metric: string;
  data: Array<{
    value: number;
    timestamp: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
}

export interface HealthRecommendation {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actions: string[];
  relatedMetrics: string[];
  timestamp: number;
}

export interface HealthGoal {
  id: string;
  type: string;
  target: number;
  current: number;
  unit: string;
  startDate: number;
  endDate: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface HealthNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: number;
  read: boolean;
  data?: Record<string, any>;
}

export interface HealthReport {
  id: string;
  type: string;
  date: number;
  metrics: HealthMetric[];
  risks: HealthRisk[];
  recommendations: HealthRecommendation[];
  goals: HealthGoal[];
  summary: {
    overallHealth: 'poor' | 'fair' | 'good' | 'excellent';
    mainRisks: HealthRisk[];
    improvements: HealthRisk[];
    score: number;
  };
} 