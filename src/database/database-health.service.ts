import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseHealthService {
  constructor(private connection: Connection) {}

  async check() {
    return {
      isHealthy: this.connection.isConnected,
      details: {
        type: this.connection.options.type,
        database: this.connection.options.database,
      },
    };
  }
}
