import { HealthData } from './health.types';

export interface ProcessedData {
  features: number[][];
  labels?: number[][];
  metadata: {
    featureNames: string[];
    normalizedRanges: {
      [key: string]: {
        min: number;
        max: number;
      };
    };
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface DataProcessorConfig {
  normalization?: {
    method: 'min-max' | 'z-score';
    customRanges?: {
      [key: string]: {
        min: number;
        max: number;
      };
    };
  };
  validation?: {
    requiredFields: string[];
    ranges?: {
      [key: string]: {
        min: number;
        max: number;
      };
    };
  };
  featureEngineering?: {
    derivedFeatures?: {
      [key: string]: (data: any) => number;
    };
    featureSelection?: {
      method: 'correlation' | 'importance';
      threshold: number;
    };
  };
} 