import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from '../utils/errors';

export class ValidationMiddleware {
  static validateBody(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = schema.validate(req.body);
        if (error) {
          throw new ValidationError(error.details[0].message);
        }
        req.body = value;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  static validateQuery(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = schema.validate(req.query);
        if (error) {
          throw new ValidationError(error.details[0].message);
        }
        req.query = value;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
