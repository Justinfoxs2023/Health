/**
 * @fileoverview TS 文件 health-document.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IHealthDocument {
  /** userId 的描述 */
  userId: string;
  /** lastUpdated 的描述 */
  lastUpdated: Date;

  // 基础健康数据
  /** basicInfo 的描述 */
  basicInfo: {
    height: number;
    weight: number;
    bloodType: string;
    allergies: string[];
  };

  // 工具使用数据
  /** toolData 的描述 */
  toolData: {
    [key in ToolType]?: {
      lastUsed: Date;
      records: Array<{
        timestamp: Date;
        data: any;
        source: string;
      }>;
      analysis: {
        trends: any;
        recommendations: string[];
        alerts: string[];
      };
    };
  };

  // 健康指标
  /** healthMetrics 的描述 */
  healthMetrics: {
    bmi: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
      timestamp: Date;
    };
    bloodSugar: {
      value: number;
      timestamp: Date;
    };
    // ... 其他健康指标
  };

  // 运动记录
  /** exerciseRecords 的描述 */
  exerciseRecords: Array<{
    type: string;
    duration: number;
    calories: number;
    timestamp: Date;
    details: any;
  }>;

  // 饮食记录
  /** dietRecords 的描述 */
  dietRecords: Array<{
    meals: Array<{
      type: string;
      foods: Array<{
        name: string;
        portion: number;
        nutrients: any;
      }>;
      timestamp: Date;
    }>;
    dailyAnalysis: {
      totalCalories: number;
      nutrientBreakdown: any;
      recommendations: string[];
    };
  }>;

  // 睡眠记录
  /** sleepRecords 的描述 */
  sleepRecords: Array<{
    startTime: Date;
    endTime: Date;
    quality: number;
    stages: any;
    factors: string[];
  }>;

  // 中医养生记录
  /** tcmRecords 的描述 */
  tcmRecords: {
    constitution: string;
    diagnoses: Array<{
      timestamp: Date;
      symptoms: string[];
      prescription: any;
    }>;
    treatments: Array<{
      type: string;
      timestamp: Date;
      details: any;
      effectiveness: number;
    }>;
  };
}
