/**
 * @fileoverview TS 文件 errors.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class AnalyticsError extends Error {
  public status: number;
  public code: string;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.code = 'ANALYTICS_ERROR';
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
