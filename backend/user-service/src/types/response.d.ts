import { Response } from 'express';

export interface TypedResponse<T = any> extends Response {
  status(code: number): this;
  json(body: {
    code: number;
    data?: T;
    message?: string;
  }): this;
}

export interface ApiResponse<T = any> {
  code: number;
  data?: T;
  message?: string;
} 