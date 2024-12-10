export interface VitalSigns {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  timestamp: Date;
}

export interface ExerciseData {
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  heartRateZones: {
    zone: string;
    duration: number;
  }[];
  timestamp: Date;
}

export interface DietaryData {
  meals: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: {
      name: string;
      portion: number;
      calories: number;
      nutrients: {
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    }[];
  }[];
  totalCalories: number;
  timestamp: Date;
}

export interface HealthAnalysisResult {
  trends: {
    vitalSigns: TrendAnalysis;
    exercise: TrendAnalysis;
    dietary: TrendAnalysis;
  };
  predictions: {
    healthRisks: RiskPrediction[];
    recommendations: Recommendation[];
  };
  correlations: CorrelationAnalysis[];
  anomalies: AnomalyDetection[];
}

export interface TrendAnalysis {
  metric: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
  confidence: number;
}

export interface RiskPrediction {
  riskType: string;
  probability: number;
  factors: string[];
  recommendedActions: string[];
}

export interface Recommendation {
  category: 'exercise' | 'diet' | 'lifestyle';
  action: string;
  priority: 'high' | 'medium' | 'low';
  expectedBenefits: string[];
}

export interface CorrelationAnalysis {
  factor1: string;
  factor2: string;
  correlationCoefficient: number;
  significance: number;
}

export interface AnomalyDetection {
  metric: string;
  value: number;
  expectedRange: {
    min: number;
    max: number;
  };
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
} 