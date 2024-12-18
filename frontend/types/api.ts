/**
 * @fileoverview TS 文件 api.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IApiResponse<T> {
  /** code 的描述 */
  code: number;
  /** data 的描述 */
  data: T;
  /** message 的描述 */
  message: string;
}

export interface IPaginatedResponse<T> extends IApiResponse<T> {
  /** total 的描述 */
  total: number;
  /** page 的描述 */
  page: number;
  /** pageSize 的描述 */
  pageSize: number;
}

export interface IQueryParams {
  /** page 的描述 */
  page?: number;
  /** limit 的描述 */
  limit?: number;
  /** keyword 的描述 */
  keyword?: string;
  /** category 的描述 */
  category?: string;
}
