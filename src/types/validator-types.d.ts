export interface ValidationResult {
  error?: {
    details: Array<{
      message: string;
      path: string[];
    }>;
  };
  value: any;
}

export interface Validator {
  validate(data: any): ValidationResult;
}

export interface ValidationSchema {
  [key: string]: {
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    validate?: (value: any) => boolean;
  };
} 