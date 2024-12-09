export class AnalyticsError extends Error {
  public status: number;
  public code: string;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.code = 'ANALYTICS_ERROR';
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
} 