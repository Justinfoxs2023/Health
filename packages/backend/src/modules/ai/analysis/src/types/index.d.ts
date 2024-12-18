/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IDict {
  [key: string]: any;
}

export interface IHealthData {
  /** vitalSigns 的描述 */
  vitalSigns?: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    temperature?: number;
  };
  /** exercise 的描述 */
  exercise?: {
    steps: number;
    distance: number;
    calories: number;
    duration: number;
  };
  /** sleep 的描述 */
  sleep?: {
    duration: number;
    quality: number;
    stages: {
      deep: number;
      light: number;
      rem: number;
    };
  };
  /** diet 的描述 */
  diet?: {
    calories: number;
    nutrients: {
      protein: number;
      carbs: number;
      fat: number;
    };
    meals: Array<{
      time: string;
      foods: string[];
    }>;
  };
}

export interface IPredictionConfig {
  /** horizon 的描述 */
  horizon: number;
  /** features 的描述 */
  features: string[];
  /** modelType 的描述 */
  modelType: string;
}

export interface IModelMetrics {
  /** accuracy 的描述 */
  accuracy: number;
  /** precision 的描述 */
  precision: number;
  /** recall 的描述 */
  recall: number;
  /** f1Score 的描述 */
  f1Score: number;
}
