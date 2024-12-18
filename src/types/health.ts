import { Document } from 'mongoose';

export interface IHealthMetrics extends Document {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** metrics 的描述 */
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
  /** source 的描述 */
  source: string;
  /** accuracy 的描述 */
  accuracy: number;
  /** validated 的描述 */
  validated: false | true;
}

export interface IActivityData extends Document {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: string;
  /** caloriesBurned 的描述 */
  caloriesBurned?: undefined | number;
  /** steps 的描述 */
  steps?: undefined | number;
  /** distance 的描述 */
  distance?: undefined | number;
  /** heartRateZones 的描述 */
  heartRateZones?: undefined | { zone: string; duration: number; }[];
  /** location 的描述 */
  location?: undefined | { type: string; coordinates: number[]; };
}

export interface INutritionData extends Document {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** meals 的描述 */
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
  /** waterIntake 的描述 */
  waterIntake?: undefined | number;
  /** supplements 的描述 */
  supplements?: undefined | { name: string; dose: number; unit: string; }[];
}

export interface ISleepData extends Document {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** duration 的描述 */
  duration: number;
  /** quality 的描述 */
  quality: number;
  /** stages 的描述 */
  stages: Array<{
    stage: string;
    duration: number;
  }>;
  /** interruptions 的描述 */
  interruptions?: undefined | number;
  /** environmentalFactors 的描述 */
  environmentalFactors?: undefined | { temperature?: number | undefined; humidity?: number | undefined; noise?: number | undefined; light?: number | undefined; };
  /** heartRateVariability 的描述 */
  heartRateVariability?: undefined | number;
}

export interface IMentalHealthData extends Document {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** mood 的描述 */
  mood: string;
  /** stressLevel 的描述 */
  stressLevel: number;
  /** anxiety 的描述 */
  anxiety?: undefined | number;
  /** depression 的描述 */
  depression?: undefined | number;
  /** activities 的描述 */
  activities?: undefined | { type: string; duration: number; impact: number; }[];
  /** notes 的描述 */
  notes?: undefined | string;
  /** therapySession 的描述 */
  therapySession?: undefined | { attended: boolean; type?: string | undefined; notes?: string | undefined; };
}
