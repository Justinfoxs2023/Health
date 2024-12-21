/**
 * @fileoverview TS 文件 validator-types.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IValidationResult {
  /** error 的描述 */
    error: {
    details: Array{
      message: string;
      path: string;
    }>;
  };
  value: any;
}

export interface IValidator {
  /** validatedata 的描述 */
    validatedata: any: /** ValidationResult 的描述 */
    /** ValidationResult 的描述 */
    ValidationResult;
}

export interface IValidationSchema {
  /** key 的描述 */
    key: string: {
    type: string;
    required: boolean;
    min: number;
    max: number;
    pattern: RegExp;
    enum: any;
    validate: value: any  boolean;
  };
}
