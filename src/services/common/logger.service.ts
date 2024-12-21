import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  constructor(private config: ConfigService) {}

  log(message: string, context?: string) {
    console.log(`[${context || 'APP'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error('Error in logger.service.ts:', `[${context || 'APP'}] ${message}`, trace);
  }
}
