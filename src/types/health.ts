import { Document } from 'mongoose';

export interface HealthMetrics extends Document {
  userId: string;
  timestamp: Date;
  metrics: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    bloodOxygen: number;
    temperature: number;
    respiratoryRate?: number;
    weight?: number;
    bmi?: number;
  };
  source: string;
  accuracy: number;
  validated: boolean;
}

export interface ActivityData extends Document {
  userId: string;
  timestamp: Date;
  type: string;
  duration: number;
  intensity: string;
  caloriesBurned?: number;
  steps?: number;
  distance?: number;
  heartRateZones?: Array<{
    zone: string;
    duration: number;
  }>;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export interface NutritionData extends Document {
  userId: string;
  timestamp: Date;
  meals: Array<{
    type: string;
    foods: Array<{
      name: string;
      portion: number;
      unit: string;
      nutrients: {
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        fiber?: number;
        vitamins?: Map<string, number>;
        minerals?: Map<string, number>;
      };
    }>;
    totalCalories?: number;
    imageUrl?: string;
    aiAnalyzed: boolean;
  }>;
  waterIntake?: number;
  supplements?: Array<{
    name: string;
    dose: number;
    unit: string;
  }>;
}

export interface SleepData extends Document {
  userId: string;
  timestamp: Date;
  duration: number;
  quality: number;
  stages: Array<{
    stage: string;
    duration: number;
  }>;
  interruptions?: number;
  environmentalFactors?: {
    temperature?: number;
    humidity?: number;
    noise?: number;
    light?: number;
  };
  heartRateVariability?: number;
}

export interface MentalHealthData extends Document {
  userId: string;
  timestamp: Date;
  mood: string;
  stressLevel: number;
  anxiety?: number;
  depression?: number;
  activities?: Array<{
    type: string;
    duration: number;
    impact: number;
  }>;
  notes?: string;
  therapySession?: {
    attended: boolean;
    type?: string;
    notes?: string;
  };
} 