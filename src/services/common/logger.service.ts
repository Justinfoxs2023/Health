import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService {
  constructor(private config: ConfigService) {}

  log(message: string, context?: string) {
    console.log(`[${context || 'APP'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${context || 'APP'}] ${message}`, trace);
  }
} 