import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseMigrationService {
  constructor(private connection: Connection) {}

  async runMigrations() {
    await this.connection.runMigrations();
  }

  async revertLastMigration() {
    await this.connection.undoLastMigration();
  }
}
