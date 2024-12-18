/**
 * @fileoverview TS 文件 health-devices.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 设备类型定义
export interface IHealthDevice {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** deviceType 的描述 */
  deviceType: DeviceType;
  /** manufacturer 的描述 */
  manufacturer: string;
  /** model 的描述 */
  model: string;
  /** macAddress 的描述 */
  macAddress: string;
  /** lastSync 的描述 */
  lastSync: Date;
  /** status 的描述 */
  status: DeviceStatus;
  /** batteryLevel 的描述 */
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
  SPORT_DEVICE = 'sportDevice',
}

// 设备状态
export enum DeviceStatus {
  ACTIVE = 'active',
  OFFLINE = 'offline',
  LOW_BATTERY = 'lowBattery',
  ERROR = 'error',
}

// 健康数据记录
export interface IHealthRecord {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** deviceId 的描述 */
  deviceId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** type 的描述 */
  type: HealthMetricType;
  /** value 的描述 */
  value: number | object;
  /** unit 的描述 */
  unit: string;
  /** tags 的描述 */
  tags?: string[];
  /** note 的描述 */
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
  BODY_TEMPERATURE = 'bodyTemperature',
}
