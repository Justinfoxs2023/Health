import { Logger } from '../types/logger';
import { RedisClient } from '../infrastructure/redis';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class EventBus {
  private readonly CHANNEL = 'app:events';

  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.Redis) private readonly redis: RedisClient,
  ) {
    this.subscribe();
  }

  async publish(event: string, data: any): Promise<void> {
    try {
      const message = JSON.stringify({ event, data, timestamp: Date.now() });
      await this.redis.publish(this.CHANNEL, message);
    } catch (error) {
      this.logger.error('事件发布失败', error);
    }
  }

  private subscribe(): void {
    this.redis.subscribe(this.CHANNEL, message => {
      try {
        const { event, data } = JSON.parse(message);
        this.handleEvent(event, data);
      } catch (error) {
        this.logger.error('事件处理失败', error);
      }
    });
  }

  private handleEvent(event: string, data: any): void {
    // 实现事件处理逻辑
  }
}
