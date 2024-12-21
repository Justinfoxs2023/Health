import { Request as ExpressRequest } from 'express';

export interface IRequest extends ExpressRequest {
  /** user 的描述 */
  user?: {
    id: string;
    roles: string[];
  };
}
