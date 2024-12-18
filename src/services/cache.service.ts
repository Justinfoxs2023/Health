/**
 * @fileoverview TS 文件 cache.service.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class CacheService {
  // 缓存用户游戏化数据
  async cacheUserGameData(userId: string, data: any) {
    await redis.setex(`user:${userId}:game`, 3600, JSON.stringify(data));
  }

  // 获取缓存数据
  async getCachedGameData(userId: string) {
    const data = await redis.get(`user:${userId}:game`);
    return data ? JSON.parse(data) : null;
  }
}
