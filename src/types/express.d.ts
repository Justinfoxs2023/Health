import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

export interface IRequest extends ExpressRequest {
  /** path 的描述 */
  path: string;
  /** user 的描述 */
  user?: any;
}

export interface IResponse extends ExpressResponse {
  /** statusCode 的描述 */
  statusCode: number;
  on(event: string, callback: () => void): void;
}

export { NextFunction };
