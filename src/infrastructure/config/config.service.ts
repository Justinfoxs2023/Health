import { ConfigModule } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor() {
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    });
  }

  get(key: string): string {
    return process.env[key];
  }

  async getServiceLimits(serviceName: string) {
    return {
      rateLimit: parseInt(process.env[`${serviceName.toUpperCase()}_RATE_LIMIT`] || '100'),
      concurrency: parseInt(process.env[`${serviceName.toUpperCase()}_CONCURRENCY`] || '10'),
    };
  }
}
