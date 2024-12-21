/**
 * @fileoverview TS 文件 error-response.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IErrorResponse {
  /** code 的描述 */
  code: string;
  /** message 的描述 */
  message: string;
  /** details 的描述 */
  details?: Record<
    string,
    {
      value: any;
      constraints: string[];
      children?: Record<string, any>;
    }
  >;
  /** timestamp 的描述 */
  timestamp?: string;
  /** path 的描述 */
  path?: string;
}
