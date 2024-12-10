import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

export interface Request extends ExpressRequest {
  path: string;
  user?: any;
}

export interface Response extends ExpressResponse {
  statusCode: number;
  on(event: string, callback: () => void): void;
}

export { NextFunction }; 