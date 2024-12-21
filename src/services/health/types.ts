/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 生命体征数据
 */
export interface IVitalSigns {
  /** bloodPressure 的描述 */
    bloodPressure: {
    systolic: number;  
    diastolic: number;  
  };
  /** heartRate 的描述 */
    heartRate: number; // 心率
  /** temperature 的描述 */
    temperature: number; // 体温
  /** bloodOxygen 的描述 */
    bloodOxygen: number; // 血氧
  /** timestamp 的描述 */
    timestamp: Date; // 记录时间
}

/**
 * 健康数据
 */
export interface IHealthData {
  /** userId 的描述 */
    userId: string;  /** ID 的描述 */
    /** ID 的描述 */
    ID
  /** timestamp 的描述 */
    timestamp: Date;  
  /** vitalSigns 的描述 */
    vitalSigns: IVitalSigns;  
  /** weight 的描述 */
    weight: number;  /** kg 的描述 */
    /** kg 的描述 */
    kg
  /** height 的描述 */
    height: number;  /** cm 的描述 */
    /** cm 的描述 */
    cm
  /** bmi 的描述 */
    bmi: number;  
  /** sleepData 的描述 */
    sleepData: {
     
    duration: number;  
    quality: number;  110
    startTime: Date;  
    endTime: Date;  
  };
  /** exerciseData 的描述 */
    exerciseData?: undefined | { type: string; duration: number; intensity: number; caloriesBurned: number; };
  /** nutritionData 的描述 */
    nutritionData?: undefined | { calories: number; protein: number; carbs: number; fat: number; water: number; };
  /** medicationData 的描述 */
    medicationData?: undefined | { name: string; dosage: number; unit: string; time: Date; }[];
  /** symptoms 的描述 */
    symptoms?: undefined | { name: string; severity: number; duration: number; notes: string; }[];
}

/**
 * 健康趋势
 */
export interface IHealthTrends {
  /** trends 的描述 */
    trends: {
    vitalSigns: {
      bloodPressure: TrendDatanumber;
      heartRate: TrendDatanumber;
      temperature: TrendDatanumber;
      bloodOxygen: TrendDatanumber;
    };
    weight?: ITrendData<number>;
    bmi?: ITrendData<number>;
    sleep?: {
      duration: ITrendData<number>;
      quality: ITrendData<number>;
    };
    exercise?: {
      frequency: ITrendData<number>;
      duration: ITrendData<number>;
      intensity: ITrendData<number>;
    };
    nutrition?: {
      calories: ITrendData<number>;
      protein: ITrendData<number>;
      carbs: ITrendData<number>;
      fat: ITrendData<number>;
      water: ITrendData<number>;
    };
  };
  /** recommendations 的描述 */
    recommendations: string[];
  /** lastUpdated 的描述 */
    lastUpdated: Date;
}

/**
 * 趋势数据
 */
export interface ITrendData<T> {
  /** current 的描述 */
    current: T;
  /** previous 的描述 */
    previous: T;
  /** change 的描述 */
    change: number;
  /** trend 的描述 */
    trend: "increasing" | "decreasing" | "stable";
  /** data 的描述 */
    data: {
    value: T;
    timestamp: Date;
  }[];
}

/**
 * 健康风险
 */
export interface IHealthRisk {
  /** type 的描述 */
    type: string;  
  /** level 的描述 */
    level: low  medium  high  critical;  
  description: string;  
  recommendations: string;  
  timestamp: Date;  
  status: active  resolved  monitoring;  
  relatedData: any;  
}

/**
 * 健康报告
 */
export interface IHealthReport {
  /** userId 的描述 */
    userId: string;  /** ID 的描述 */
    /** ID 的描述 */
    ID
  /** timestamp 的描述 */
    timestamp: Date;  
  /** period 的描述 */
    period: {
     
    start: Date;
    end: Date;
  };
  /** summary 的描述 */
    summary: {
    // 总结
    healthScore: number; // 健康评分
    mainFindings: string[]; // 主要发现
    improvements: string[]; // 改进项
    risks: IHealthRisk[]; // 风险项
  };
  /** details 的描述 */
    details: {
    // 详细数据
    vitalSigns: IVitalSigns[];
    trends: IHealthTrends;
    lifestyle: {
      sleepQuality: number;
      exerciseLevel: number;
      nutritionBalance: number;
      stressLevel: number;
    };
  };
  /** recommendations 的描述 */
    recommendations: {
    // 建议
    lifestyle: string[]; // 生活方式
    exercise: string[]; // 运动
    nutrition: string[]; // 营养
    medical: string[]; // 医疗
  };
  /** nextSteps 的描述 */
    nextSteps: {
    // 下一步计划
    shortTerm: string[]; // 短期目标
    longTerm: string[]; // 长期目标
    appointments?: {
      // 预约
      type: string;
      date: Date;
      provider: string;
    }[];
  };
}
