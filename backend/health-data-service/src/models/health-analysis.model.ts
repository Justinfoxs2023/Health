import { Schema, model, Document } from 'mongoose';

interface IHealthAnalysis extends Document {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: Date;
  metrics: {
    vitalSigns: {
      heartRate: {
        avg: number;
        max: number;
        min: number;
        trend: 'up' | 'down' | 'stable';
      };
      bloodPressure: {
        systolic: {
          avg: number;
          trend: 'up' | 'down' | 'stable';
        };
        diastolic: {
          avg: number;
          trend: 'up' | 'down' | 'stable';
        };
      };
      bloodOxygen: {
        avg: number;
        min: number;
        trend: 'up' | 'down' | 'stable';
      };
    };
    activity: {
      steps: {
        total: number;
        achievement: number; // 目标完成率
        trend: 'up' | 'down' | 'stable';
      };
      exercise: {
        duration: number; // 分钟
        calories: number;
        types: Array<{
          name: string;
          duration: number;
          frequency: number;
        }>;
      };
    };
    sleep: {
      avgDuration: number;
      quality: number; // 0-100
      pattern: {
        bedtime: string;
        wakeTime: string;
        deepSleepPercentage: number;
      };
    };
    nutrition: {
      calories: {
        intake: number;
        burned: number;
        balance: number;
      };
      macros: {
        protein: number;
        carbs: number;
        fat: number;
      };
      hydration: number;
    };
  };
  analysis: {
    healthScore: number; // 0-100
    risks: Array<{
      type: string;
      level: 'low' | 'medium' | 'high';
      description: string;
    }>;
    improvements: Array<{
      area: string;
      suggestion: string;
      priority: 'low' | 'medium' | 'high';
    }>;
  };
  aiInsights: {
    predictions: Array<{
      metric: string;
      value: number;
      confidence: number;
    }>;
    recommendations: Array<{
      category: string;
      content: string;
      relevance: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HealthAnalysisSchema = new Schema({
  userId: { type: String, required: true, index: true },
  period: { type: String, required: true, enum: ['daily', 'weekly', 'monthly'] },
  date: { type: Date, required: true },
  metrics: {
    vitalSigns: {
      heartRate: {
        avg: Number,
        max: Number,
        min: Number,
        trend: { type: String, enum: ['up', 'down', 'stable'] }
      },
      bloodPressure: {
        systolic: {
          avg: Number,
          trend: { type: String, enum: ['up', 'down', 'stable'] }
        },
        diastolic: {
          avg: Number,
          trend: { type: String, enum: ['up', 'down', 'stable'] }
        }
      },
      bloodOxygen: {
        avg: Number,
        min: Number,
        trend: { type: String, enum: ['up', 'down', 'stable'] }
      }
    },
    activity: {
      steps: {
        total: Number,
        achievement: Number,
        trend: { type: String, enum: ['up', 'down', 'stable'] }
      },
      exercise: {
        duration: Number,
        calories: Number,
        types: [{
          name: String,
          duration: Number,
          frequency: Number
        }]
      }
    },
    sleep: {
      avgDuration: Number,
      quality: Number,
      pattern: {
        bedtime: String,
        wakeTime: String,
        deepSleepPercentage: Number
      }
    },
    nutrition: {
      calories: {
        intake: Number,
        burned: Number,
        balance: Number
      },
      macros: {
        protein: Number,
        carbs: Number,
        fat: Number
      },
      hydration: Number
    }
  },
  analysis: {
    healthScore: Number,
    risks: [{
      type: String,
      level: { type: String, enum: ['low', 'medium', 'high'] },
      description: String
    }],
    improvements: [{
      area: String,
      suggestion: String,
      priority: { type: String, enum: ['low', 'medium', 'high'] }
    }]
  },
  aiInsights: {
    predictions: [{
      metric: String,
      value: Number,
      confidence: Number
    }],
    recommendations: [{
      category: String,
      content: String,
      relevance: Number
    }]
  }
}, {
  timestamps: true
});

// 索引
HealthAnalysisSchema.index({ userId: 1, period: 1, date: -1 });
HealthAnalysisSchema.index({ 'analysis.healthScore': -1 });

export const HealthAnalysis = model<IHealthAnalysis>('HealthAnalysis', HealthAnalysisSchema); 