/** 健康指标数据 */
export interface HealthMetricsType {
  /** 用户ID */
  userId: string;
  /** 记录时间 */
  timestamp: Date;
  /** 指标数据 */
  metrics: {
    /** 心率 */
    heartRate: number;
    /** 血压 */
    bloodPressure: {
      /** 收缩压 */
      systolic: number;
      /** 舒张压 */
      diastolic: number;
    };
    /** 血氧饱和度 */
    bloodOxygen: number;
    /** 体温 */
    temperature: number;
    /** 呼吸率 */
    respiratoryRate?: number;
    /** 体重 */
    weight?: number;
    /** BMI */
    bmi?: number;
  };
  /** 数据来源设备 */
  source: string;
  /** 数据准确度 */
  accuracy: number;
  /** 数据验证状态 */
  validated: boolean;
} 