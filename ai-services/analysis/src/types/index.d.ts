export interface Dict {
  [key: string]: any;
}

export interface HealthData {
  vitalSigns?: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    temperature?: number;
  };
  exercise?: {
    steps: number;
    distance: number;
    calories: number;
    duration: number;
  };
  sleep?: {
    duration: number;
    quality: number;
    stages: {
      deep: number;
      light: number;
      rem: number;
    };
  };
  diet?: {
    calories: number;
    nutrients: {
      protein: number;
      carbs: number;
      fat: number;
    };
    meals: Array<{
      time: string;
      foods: string[];
    }>;
  };
}

export interface PredictionConfig {
  horizon: number;
  features: string[];
  modelType: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
} 