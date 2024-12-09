export interface ErrorResponse {
  code: string;
  status: number;
  message: string;
  details?: any;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
}

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'; 