import { Schema, ValidationResult } from 'joi';

// 验证器接口
export interface IValidator {
  validate<T>(data: T, schema: Schema): Promise<ValidationResult>;
}

// 验证规则类型
export interface ValidationRule {
  schema: Schema;
  message?: string;
}

// 验证器配置
export interface ValidatorConfig {
  abortEarly?: boolean;
  allowUnknown?: boolean;
  stripUnknown?: boolean;
}

// 验证结果类型
export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

export interface ValidationResponse {
  success: boolean;
  errors?: ValidationError[];
} 