/**
 * @fileoverview TS 文件 health-base.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础健康数据类型
export interface IBaseHealthData {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** source 的描述 */
    source: user  device  professional  ai;
  reliability: number;  
  verified: boolean;
}

// 生命体征数据
export interface IVitalSignsData extends IBaseHealthData {
  /** bloodPressure 的描述 */
    bloodPressure: {
    systolic: number;
    diastolic: number;
    meanArterial?: number;
  };
  /** heartRate 的描述 */
    heartRate: {
    value: number;
    rhythm: 'regular' | 'irregular';
    variability?: number;
  };
  /** bodyTemperature 的描述 */
    bodyTemperature: number;
  /** respiratoryRate 的描述 */
    respiratoryRate: number;
  /** bloodOxygen 的描述 */
    bloodOxygen: number;
  /** bloodGlucose 的描述 */
    bloodGlucose?: undefined | number;
}

// 症状记录
export interface ISymptomRecord extends IBaseHealthData {
  /** type 的描述 */
    type: string;
  /** severity 的描述 */
    severity: 1 | 2 | 3 | 4 | 5;
  /** duration 的描述 */
    duration: number; // 持续时间(分钟)
  /** frequency 的描述 */
    frequency: "rare" | "occasional" | "frequent" | "constant";
  /** triggers 的描述 */
    triggers?: undefined | string[];
  /** accompaniedBy 的描述 */
    accompaniedBy?: undefined | string[];
  /** relievedBy 的描述 */
    relievedBy?: undefined | string[];
  /** impact 的描述 */
    impact: "none" | "mild" | "moderate" | "severe";
}

// 检测结果
export interface ITestResult extends IBaseHealthData {
  /** type 的描述 */
    type: string;
  /** category 的描述 */
    category: "blood" | "imaging" | "physical" | "genetic" | "other";
  /** values 的描述 */
    values: Record<string, number | string>;
  /** referenceRanges 的描述 */
    referenceRanges: Record<string, [number, number]>;
  /** interpretation 的描述 */
    interpretation: {
    summary: string;
    abnormalities: string[];
    recommendations: string[];
  };
  /** provider 的描述 */
    provider: {
    name: string;
    qualification: string;
    institution: string;
  };
}
