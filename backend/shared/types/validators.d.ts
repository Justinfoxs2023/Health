import { Schema, ValidationResult } from 'joi';

// 验证器接口
export interface IValidator {
  validate<T>(data: T, schema: Schema): Promise<ValidationResult>;
}

// 验证规则类型
export interface IValidationRule {
  /** schema 的描述 */
  schema: Schema;
  /** message 的描述 */
  message?: string;
}

// 验证器配置
export interface IValidatorConfig {
  /** abortEarly 的描述 */
  abortEarly?: boolean;
  /** allowUnknown 的描述 */
  allowUnknown?: boolean;
  /** stripUnknown 的描述 */
  stripUnknown?: boolean;
}

// 验证结果类型
export interface IValidationError {
  /** field 的描述 */
  field: string;
  /** message 的描述 */
  message: string;
  /** type 的描述 */
  type: string;
}

export interface IValidationResponse {
  /** success 的描述 */
  success: boolean;
  /** errors 的描述 */
  errors?: IValidationError[];
}
