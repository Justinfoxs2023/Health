/**
 * @fileoverview TS 文件 error.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IErrorResponse {
  /** code 的描述 */
  code: string;
  /** status 的描述 */
  status: number;
  /** message 的描述 */
  message: string;
  /** details 的描述 */
  details?: any;
}

export interface IValidationErrorDetail {
  /** field 的描述 */
  field: string;
  /** message 的描述 */
  message: string;
  /** value 的描述 */
  value?: any;
}

export type ErrorCodeType =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';
