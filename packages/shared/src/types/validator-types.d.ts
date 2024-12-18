/**
 * @fileoverview TS 文件 validator-types.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IValidationResult {
  /** error 的描述 */
  error?: {
    details: Array<{
      message: string;
      path: string[];
    }>;
  };
  /** value 的描述 */
  value: any;
}

export interface IValidator {
  validate(data: any): IValidationResult;
}

export interface IValidationSchema {
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
