export interface HealthData {
  userId: string;
  timestamp: Date;
  vitalSigns: VitalSigns;
  bodyMetrics: BodyMetrics;
  activityData: ActivityData;
  deviceInfo?: DeviceInfo;
}

export interface VitalSigns {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bodyTemperature: number;
  respiratoryRate: number;
  bloodOxygen: number;
}

export interface BodyMetrics {
  weight: number;
  height: number;
  bmi: number;
  bodyFat: number;
  muscleMass: number;
  boneMass: number;
  waterContent: number;
}

export interface ActivityData {
  steps: number;
  distance: number;
  caloriesBurned: number;
  activeMinutes: number;
  sleepData?: SleepData;
}

export interface SleepData {
  duration: number;
  quality: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: string;
  manufacturer: string;
  model: string;
  accuracy: number;
} 