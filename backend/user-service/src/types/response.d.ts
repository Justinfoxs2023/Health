import { Response } from 'express';

export interface ITypedResponse<T = any> extends Response {
  status(code: number): this;
  json(body: { code: number; data?: T; message?: string }): this;
}

export interface IApiResponse<T = any> {
  /** code 的描述 */
  code: number;
  /** data 的描述 */
  data?: T;
  /** message 的描述 */
  message?: string;
}
