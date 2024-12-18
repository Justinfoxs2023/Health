import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  RedisHealthIndicator,
} from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';

@Cont
roller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
      () => this.checkGameServices(),
    ]);
  }

  private async checkGameServices() {
    // 检查游戏化核心服务
    return {
      levelSystem: await this.checkLevelSystem(),
      achievementSystem: await this.checkAchievementSystem(),
      featureUnlock: await this.checkFeatureUnlock(),
    };
  }
}
