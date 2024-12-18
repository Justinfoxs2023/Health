import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // 获取缓存
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  // 设置缓存
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  // 删除缓存
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // 使用模式删除多个缓存
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // 设置哈希表字段
  async hset(key: string, field: string, value: string): Promise<void> {
    await this.redis.hset(key, field, value);
  }

  // 获取哈希表字段
  async hget(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field);
  }

  // 获取哈希表所有字段
  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(key);
  }

  // 删除哈希表字段
  async hdel(key: string, ...fields: string[]): Promise<void> {
    await this.redis.hdel(key, ...fields);
  }

  // 设置带过期时间的哈希表
  async hsetWithExpiry(key: string, field: string, value: string, ttl: number): Promise<void> {
    const pipeline = this.redis.pipeline();
    pipeline.hset(key, field, value);
    pipeline.expire(key, ttl);
    await pipeline.exec();
  }

  // 原子递增
  async increment(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  // 原子递减
  async decrement(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  // 设置集合成员
  async sadd(key: string, ...members: string[]): Promise<void> {
    await this.redis.sadd(key, ...members);
  }

  // 移除集合成员
  async srem(key: string, ...members: string[]): Promise<void> {
    await this.redis.srem(key, ...members);
  }

  // 检查集合成员是否存在
  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.redis.sismember(key, member);
    return result === 1;
  }

  // 获取集合所有成员
  async smembers(key: string): Promise<string[]> {
    return this.redis.smembers(key);
  }

  // 获取集合成员数量
  async scard(key: string): Promise<number> {
    return this.redis.scard(key);
  }

  // 添加有序集合成员
  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.redis.zadd(key, score, member);
  }

  // 获取有序集合成员分数
  async zscore(key: string, member: string): Promise<string | null> {
    return this.redis.zscore(key, member);
  }

  // 获取有序集合排名范围的成员
  async zrange(key: string, start: number, stop: number, withScores = false): Promise<string[]> {
    return this.redis.zrange(key, start, stop, withScores ? 'WITHSCORES' : undefined);
  }

  // 获取有序集合倒序排名范围的成员
  async zrevrange(key: string, start: number, stop: number, withScores = false): Promise<string[]> {
    return this.redis.zrevrange(key, start, stop, withScores ? 'WITHSCORES' : undefined);
  }

  // 移除有序集合成员
  async zrem(key: string, ...members: string[]): Promise<void> {
    await this.redis.zrem(key, ...members);
  }

  // 获取有序集合成员数量
  async zcard(key: string): Promise<number> {
    return this.redis.zcard(key);
  }

  // 批量设置缓存
  async mset(keyValues: Record<string, string>): Promise<void> {
    await this.redis.mset(keyValues);
  }

  // 批量获取缓存
  async mget(...keys: string[]): Promise<(string | null)[]> {
    return this.redis.mget(...keys);
  }

  // 设置键的过期时间
  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  // 获取键的剩余过期时间
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  // 检查键是否存在
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  // 使用Lua脚本实现分布式锁
  async acquireLock(lockKey: string, lockValue: string, ttl: number): Promise<boolean> {
    const result = await this.redis.set(lockKey, lockValue, 'NX', 'EX', ttl);
    return result === 'OK';
  }

  // 使用Lua脚本释放分布式锁
  async releaseLock(lockKey: string, lockValue: string): Promise<boolean> {
    const script = `
      if redis.call("get",KEYS[1]) == ARGV[1] then
        return redis.call("del",KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.redis.eval(script, 1, lockKey, lockValue);
    return result === 1;
  }

  // 使用Lua脚本实现计数器限流
  async rateLimit(key: string, limit: number, window: number): Promise<boolean> {
    const script = `
      local counter = redis.call('incr',KEYS[1])
      if counter == 1 then
        redis.call('expire',KEYS[1],ARGV[1])
      end
      if counter > tonumber(ARGV[2]) then
        return 0
      end
      return 1
    `;
    const result = await this.redis.eval(script, 1, key, window, limit);
    return result === 1;
  }

  // 使用Lua脚本实现滑动窗口限流
  async slidingWindowRateLimit(key: string, limit: number, window: number): Promise<boolean> {
    const now = Date.now();
    const script = `
      redis.call('zremrangebyscore', KEYS[1], 0, ARGV[1])
      local counter = redis.call('zcard', KEYS[1])
      if counter < tonumber(ARGV[3]) then
        redis.call('zadd', KEYS[1], ARGV[2], ARGV[2])
        redis.call('expire', KEYS[1], ARGV[4])
        return 1
      end
      return 0
    `;
    const result = await this.redis.eval(script, 1, key, now - window * 1000, now, limit, window);
    return result === 1;
  }
}
