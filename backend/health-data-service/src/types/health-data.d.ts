// 健康数据类型定义
export interface HealthData {
  userId: string;
  timestamp: Date;
  vitalSigns?: VitalSigns;
  exercise?: Exercise;
  sleep?: Sleep;
  diet?: Diet;
  metrics?: HealthMetrics;
}

export interface VitalSigns {
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface Exercise {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  steps?: number;
  distance?: number;
}

export interface Sleep {
  startTime: Date;
  endTime: Date;
  quality: number;
  stages?: {
    deep: number;
    light: number;
    rem: number;
  };
}

export interface Diet {
  meals: Array<{
    time: Date;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: Array<{
      name: string;
      portion: number;
      calories: number;
      nutrients: {
        protein: number;
        carbs: number;
        fat: number;
      };
    }>;
  }>;
  totalCalories: number;
  waterIntake: number;
}

export interface HealthMetrics {
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
  boneDensity?: number;
  metabolicRate?: number;
} 