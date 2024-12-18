/**
 * @fileoverview TS 文件 HealthData.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IHealthData {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** vitalSigns 的描述 */
  vitalSigns: IVitalSigns;
  /** bodyMetrics 的描述 */
  bodyMetrics: IBodyMetrics;
  /** activityData 的描述 */
  activityData: IActivityData;
  /** deviceInfo 的描述 */
  deviceInfo: IDeviceInfo;
}

export interface IVitalSigns {
  /** heartRate 的描述 */
  heartRate: number;
  /** bloodPressure 的描述 */
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  /** bodyTemperature 的描述 */
  bodyTemperature: number;
  /** respiratoryRate 的描述 */
  respiratoryRate: number;
  /** bloodOxygen 的描述 */
  bloodOxygen: number;
}

export interface IBodyMetrics {
  /** weight 的描述 */
  weight: number;
  /** height 的描述 */
  height: number;
  /** bmi 的描述 */
  bmi: number;
  /** bodyFat 的描述 */
  bodyFat: number;
  /** muscleMass 的描述 */
  muscleMass: number;
  /** boneMass 的描述 */
  boneMass: number;
  /** waterContent 的描述 */
  waterContent: number;
}

export interface IActivityData {
  /** steps 的描述 */
  steps: number;
  /** distance 的描述 */
  distance: number;
  /** caloriesBurned 的描述 */
  caloriesBurned: number;
  /** activeMinutes 的描述 */
  activeMinutes: number;
  /** sleepData 的描述 */
  sleepData: ISleepData;
}

export interface ISleepData {
  /** duration 的描述 */
  duration: number;
  /** quality 的描述 */
  quality: number;
  /** stages 的描述 */
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
}

export interface IDeviceInfo {
  /** deviceId 的描述 */
  deviceId: string;
  /** deviceType 的描述 */
  deviceType: string;
  /** manufacturer 的描述 */
  manufacturer: string;
  /** model 的描述 */
  model: string;
  /** accuracy 的描述 */
  accuracy: number;
}
