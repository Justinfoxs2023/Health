import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RedissonLockService {
  private readonly lockTimeout: number;
  private readonly retryInterval: number;

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService
  ) {
    this.lockTimeout = parseInt(config.get('LOCK_TIMEOUT') || '5000');
    this.retryInterval = parseInt(config.get('LOCK_RETRY_INTERVAL') || '100');
  }

  async lock(key: string, timeout: number = this.lockTimeout): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const lockValue = Date.now().toString();

    const acquired = await this.redis.set(
      lockKey,
      lockValue,
      'NX',
      'PX',
      timeout
    );

    return !!acquired;
  }

  async unlock(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    await this.redis.del(lockKey);
  }

  async tryLock(
    key: string,
    timeout: number = this.lockTimeout,
    retries: number = 3
  ): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      const acquired = await this.lock(key, timeout);
      if (acquired) return true;
      await new Promise(resolve => setTimeout(resolve, this.retryInterval));
    }
    return false;
  }
} 