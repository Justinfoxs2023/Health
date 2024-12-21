import { ErrorResponse } from '../interfaces/error-response.interface';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService } from '../services/common/logger.service';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const errorResponse: ErrorResponse = {
      code: this.getErrorCode(status, exceptionResponse),
      message: this.getErrorMessage(exceptionResponse),
      details: exceptionResponse.details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(`HTTP Exception: ${errorResponse.message}`, {
      statusCode: status,
      path: request.url,
      details: errorResponse.details,
    });

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number, response: any): string {
    if (response.code) {
      return response.code;
    }

    const statusCodes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_SERVER_ERROR',
    };

    return statusCodes[status] || 'UNKNOWN_ERROR';
  }

  private getErrorMessage(response: any): string {
    if (typeof response === 'string') {
      return response;
    }
    return response.message || 'An unexpected error occurred';
  }
}
