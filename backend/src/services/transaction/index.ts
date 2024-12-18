import mongoose from 'mongoose';
import { logger } from '../logger';

class TransactionService {
  /**
   * 执行事务
   */
  async executeTransaction<T>(
    operations: (session: mongoose.ClientSession) => Promise<T>,
  ): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await operations(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      logger.error('事务执行失败:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * 批量执行事务
   */
  async executeBulkTransaction<T>(
    operations: (session: mongoose.ClientSession) => Promise<T[]>,
  ): Promise<T[]> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const results = await operations(session);
      await session.commitTransaction();
      return results;
    } catch (error) {
      await session.abortTransaction();
      logger.error('批量事务执行失败:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * 执行带重试的事务
   */
  async executeTransactionWithRetry<T>(
    operations: (session: mongoose.ClientSession) => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        return await this.executeTransaction(operations);
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw error;
        }
        logger.warn(`事务重试 ${retries}/${maxRetries}:`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }

    throw new Error('事务重试次数超过最大限制');
  }

  /**
   * 执行带超时的事务
   */
  async executeTransactionWithTimeout<T>(
    operations: (session: mongoose.ClientSession) => Promise<T>,
    timeoutMs = 5000,
  ): Promise<T> {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('事务执行超时')), timeoutMs);
    });

    try {
      const result = await Promise.race([this.executeTransaction(operations), timeoutPromise]);
      return result as T;
    } catch (error) {
      logger.error('事务执行超时或失败:', error);
      throw error;
    }
  }

  /**
   * 执行带回滚钩子的事务
   */
  async executeTransactionWithRollback<T>(
    operations: (session: mongoose.ClientSession) => Promise<T>,
    rollbackHook?: (error: any) => Promise<void>,
  ): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await operations(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      if (rollbackHook) {
        try {
          await rollbackHook(error);
        } catch (rollbackError) {
          logger.error('回滚钩子执行失败:', rollbackError);
        }
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * 执行带进度报告的批量事务
   */
  async executeBulkTransactionWithProgress<T>(
    operations: (session: mongoose.ClientSession) => Promise<T[]>,
    progressCallback?: (completed: number, total: number) => void,
  ): Promise<T[]> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const results = await operations(session);
      if (progressCallback) {
        progressCallback(results.length, results.length);
      }
      await session.commitTransaction();
      return results;
    } catch (error) {
      await session.abortTransaction();
      logger.error('带进度报告的批量事务执行失败:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export const transactionService = new TransactionService();
