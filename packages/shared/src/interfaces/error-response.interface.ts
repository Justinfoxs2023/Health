export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, {
    value: any;
    constraints: string[];
    children?: Record<string, any>;
  }>;
  timestamp?: string;
  path?: string;
} 