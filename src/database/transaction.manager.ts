import { Connection, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionManager {
  constructor(private connection: Connection) {}

  async transaction<T>(operation: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
    existingQueryRunner?: QueryRunner,
  ): Promise<T> {
    if (existingQueryRunner) {
      return operation(existingQueryRunner);
    }
    return this.transaction(operation);
  }
}
