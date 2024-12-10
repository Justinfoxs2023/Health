// 设备类型定义
export interface HealthDevice {
  id: string;
  userId: string;
  deviceType: DeviceType;
  manufacturer: string;
  model: string;
  macAddress: string;
  lastSync: Date;
  status: DeviceStatus;
  batteryLevel?: number;
}

// 设备类型枚举
export enum DeviceType {
  BLOOD_PRESSURE = 'bloodPressure',
  BLOOD_GLUCOSE = 'bloodGlucose',
  BODY_SCALE = 'bodyScale',
  SMART_WATCH = 'smartWatch',
  HEART_RATE = 'heartRate',
  THERMOMETER = 'thermometer',
  SLEEP_MONITOR = 'sleepMonitor',
  ECG = 'ecg',
  SPORT_DEVICE = 'sportDevice'
}

// 设备状态
export enum DeviceStatus {
  ACTIVE = 'active',
  OFFLINE = 'offline',
  LOW_BATTERY = 'lowBattery',
  ERROR = 'error'
}

// 健康数据记录
export interface HealthRecord {
  id: string;
  userId: string;
  deviceId: string;
  timestamp: Date;
  type: HealthMetricType;
  value: number | object;
  unit: string;
  tags?: string[];
  note?: string;
}

// 健康指标类型
export enum HealthMetricType {
  // 血压相关
  SYSTOLIC_PRESSURE = 'systolicPressure',
  DIASTOLIC_PRESSURE = 'diastolicPressure',
  PULSE_RATE = 'pulseRate',
  
  // 血糖相关
  BLOOD_GLUCOSE = 'bloodGlucose',
  
  // 体重体脂相关
  WEIGHT = 'weight',
  BMI = 'bmi',
  BODY_FAT = 'bodyFat',
  MUSCLE_MASS = 'muscleMass',
  BONE_MASS = 'boneMass',
  WATER_CONTENT = 'waterContent',
  
  // 运动相关
  STEPS = 'steps',
  DISTANCE = 'distance',
  CALORIES = 'calories',
  ACTIVITY_MINUTES = 'activityMinutes',
  
  // 睡眠相关
  SLEEP_DURATION = 'sleepDuration',
  DEEP_SLEEP = 'deepSleep',
  LIGHT_SLEEP = 'lightSleep',
  REM_SLEEP = 'remSleep',
  
  // 心率相关
  HEART_RATE = 'heartRate',
  HEART_RATE_VARIABILITY = 'hrv',
  
  // 体温相关
  BODY_TEMPERATURE = 'bodyTemperature'
} 