import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';

interface TransactionParticipant {
  serviceId: string;
  action: string;
  compensate: string;
}

@Injectable()
export class TransactionCoordinatorService {
  private readonly lockTimeout = 30000; // 30 seconds

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly redis: RedisService
  ) {}

  async begin(participants: TransactionParticipant[]): Promise<string> {
    // 创建全局事务
    const transaction = await this.transactionRepo.save({
      status: 'PENDING',
      participants,
      startTime: new Date()
    });

    // 获取分布式锁
    const acquired = await this.acquireLocks(transaction.id, participants);
    if (!acquired) {
      await this.rollback(transaction.id);
      throw new Error('Failed to acquire locks');
    }

    return transaction.id;
  }

  async commit(transactionId: string): Promise<void> {
    const transaction = await this.transactionRepo.findOne(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    try {
      // 执行所有参与者的提交操作
      for (const participant of transaction.participants) {
        await this.executeAction(participant.serviceId, participant.action);
      }

      // 更新事务状态
      await this.transactionRepo.update(transactionId, {
        status: 'COMMITTED',
        endTime: new Date()
      });

      // 释放锁
      await this.releaseLocks(transactionId, transaction.participants);
    } catch (error) {
      // 如果提交失败，执行补偿操作
      await this.rollback(transactionId);
      throw error;
    }
  }

  private async acquireLocks(
    transactionId: string,
    participants: TransactionParticipant[]
  ): Promise<boolean> {
    for (const participant of participants) {
      const lockKey = `transaction:${transactionId}:${participant.serviceId}`;
      const acquired = await this.redis.set(
        lockKey,
        'locked',
        'NX',
        'PX',
        this.lockTimeout
      );
      if (!acquired) {
        return false;
      }
    }
    return true;
  }

  private async releaseLocks(
    transactionId: string,
    participants: TransactionParticipant[]
  ): Promise<void> {
    for (const participant of participants) {
      const lockKey = `transaction:${transactionId}:${participant.serviceId}`;
      await this.redis.del(lockKey);
    }
  }
} 