import { Request, Response, NextFunction } from 'express';
import { container } from '../bootstrap';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';

export class ErrorHandler {
  static handle(error: any, req: Request, res: Response, next: NextFunction) {
    const logger = container.get<Logger>(TYPES.Logger);
    
    logger.error('Unhandled error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.details
      });
    }

    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
} 