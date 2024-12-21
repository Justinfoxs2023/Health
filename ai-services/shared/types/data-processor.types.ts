import { IHealthData } from './health.types';

export interface IProcessedData {
  /** features 的描述 */
  features: number[][];
  /** labels 的描述 */
  labels?: number[][];
  /** metadata 的描述 */
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

export interface IValidationResult {
  /** isValid 的描述 */
  isValid: boolean;
  /** errors 的描述 */
  errors: IValidationError[];
}

export interface IValidationError {
  /** field 的描述 */
  field: string;
  /** message 的描述 */
  message: string;
  /** code 的描述 */
  code: string;
}

export interface IDataProcessorConfig {
  /** normalization 的描述 */
  normalization?: {
    method: 'min-max' | 'z-score';
    customRanges?: {
      [key: string]: {
        min: number;
        max: number;
      };
    };
  };
  /** validation 的描述 */
  validation?: {
    requiredFields: string[];
    ranges?: {
      [key: string]: {
        min: number;
        max: number;
      };
    };
  };
  /** featureEngineering 的描述 */
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
