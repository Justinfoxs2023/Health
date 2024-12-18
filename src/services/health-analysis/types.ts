/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IVitalSigns {
  /** heartRate 的描述 */
    heartRate: number;
  /** bloodPressure 的描述 */
    bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  /** temperature 的描述 */
    temperature: number;
  /** respiratoryRate 的描述 */
    respiratoryRate: number;
  /** oxygenSaturation 的描述 */
    oxygenSaturation: number;
  /** timestamp 的描述 */
    timestamp: Date;
}

export interface IExerciseData {
  /** type 的描述 */
    type: string;
  /** duration 的描述 */
    duration: number;
  /** intensity 的描述 */
    intensity: low  medium  high;
  caloriesBurned: number;
  heartRateZones: {
    zone: string;
    duration: number;
  }[];
  timestamp: Date;
}

export interface IDietaryData {
  /** meals 的描述 */
    meals: {
    type: breakfast  lunch  dinner  snack;
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

export interface IHealthAnalysisResult {
  /** trends 的描述 */
    trends: {
    vitalSigns: ITrendAnalysis;
    exercise: ITrendAnalysis;
    dietary: ITrendAnalysis;
  };
  /** predictions 的描述 */
    predictions: {
    healthRisks: IRiskPrediction[];
    recommendations: IRecommendation[];
  };
  /** correlations 的描述 */
    correlations: ICorrelationAnalysis[];
  /** anomalies 的描述 */
    anomalies: IAnomalyDetection[];
}

export interface ITrendAnalysis {
  /** metric 的描述 */
    metric: string;
  /** trend 的描述 */
    trend: increasing  decreasing  stable;
  changeRate: number;
  confidence: number;
}

export interface IRiskPrediction {
  /** riskType 的描述 */
    riskType: string;
  /** probability 的描述 */
    probability: number;
  /** factors 的描述 */
    factors: string;
  /** recommendedActions 的描述 */
    recommendedActions: string;
}

export interface IRecommendation {
  /** category 的描述 */
    category: exercise  diet  lifestyle;
  action: string;
  priority: high  medium  low;
  expectedBenefits: string;
}

export interface ICorrelationAnalysis {
  /** factor1 的描述 */
    factor1: string;
  /** factor2 的描述 */
    factor2: string;
  /** correlationCoefficient 的描述 */
    correlationCoefficient: number;
  /** significance 的描述 */
    significance: number;
}

export interface IAnomalyDetection {
  /** metric 的描述 */
    metric: string;
  /** value 的描述 */
    value: number;
  /** expectedRange 的描述 */
    expectedRange: {
    min: number;
    max: number;
  };
  /** severity 的描述 */
    severity: "low" | "medium" | "high";
  /** timestamp 的描述 */
    timestamp: Date;
}
