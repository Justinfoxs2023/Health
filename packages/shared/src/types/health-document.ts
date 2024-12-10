export interface HealthDocument {
  userId: string;
  lastUpdated: Date;
  
  // 基础健康数据
  basicInfo: {
    height: number;
    weight: number;
    bloodType: string;
    allergies: string[];
  };

  // 工具使用数据
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
  exerciseRecords: Array<{
    type: string;
    duration: number;
    calories: number;
    timestamp: Date;
    details: any;
  }>;

  // 饮食记录
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
  sleepRecords: Array<{
    startTime: Date;
    endTime: Date;
    quality: number;
    stages: any;
    factors: string[];
  }>;

  // 中医养生记录
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