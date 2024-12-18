/**
 * @fileoverview TS 文件 error.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IAppError extends Error {
  /** status 的描述 */
  status: number;
  /** code 的描述 */
  code: string;
}

export interface IValidationError extends IAppError {
  /** details 的描述 */
  details?: Array<{
    message: string;
    path: string[];
  }>;
}

export interface IAuthenticationError extends IAppError {}
export interface IAuthorizationError extends IAppError {}
export interface INotFoundError extends IAppError {}
export interface ISecurityError extends IAppError {}
