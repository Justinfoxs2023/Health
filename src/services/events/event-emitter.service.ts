import { EventEmitter2 } from 'eventemitter2';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';

export interface IEventMetadata {
  /** timestamp 的描述 */
    timestamp: Date;
  /** source 的描述 */
    source: string;
  /** type 的描述 */
    type: string;
  /** key 的描述 */
    key: string: /** any 的描述 */
    /** any 的描述 */
    any;
}

@Injectable()
export class EventEmitter {
  private emitter: EventEmitter2;

  constructor(private readonly logger: Logger, private readonly metrics: MetricsService) {
    this.emitter = new EventEmitter2({
      wildcard: true,
      delimiter: ':',
      maxListeners: 20,
      verboseMemoryLeak: true,
    });

    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.emitter.on('error', (error: Error) => {
      this.logger.error('事件处理错误', { error });
      this.metrics.increment('event_handling_error');
    });
  }

  emit(event: string, data: any): boolean {
    const timer = this.metrics.startTimer('event_emission');
    try {
      const metadata: IEventMetadata = {
        timestamp: new Date(),
        source: 'system',
        type: event,
        data,
      };

      const result = this.emitter.emit(event, metadata);
      this.metrics.increment('event_emitted');
      this.logger.debug('事件已发送', { event, metadata });

      timer.end();
      return result;
    } catch (error) {
      this.logger.error('事件发送失败', { error, event, data });
      this.metrics.increment('event_emission_error');
      timer.end();
      return false;
    }
  }

  on(event: string, listener: (metadata: IEventMetadata) => void): void {
    try {
      this.emitter.on(event, listener);
      this.metrics.increment('event_listener_added');
      this.logger.debug('事件监听器已添加', { event });
    } catch (error) {
      this.logger.error('添加事件监听器失败', { error, event });
      this.metrics.increment('event_listener_add_error');
      throw error;
    }
  }

  once(event: string, listener: (metadata: IEventMetadata) => void): void {
    try {
      this.emitter.once(event, listener);
      this.metrics.increment('event_one_time_listener_added');
      this.logger.debug('一次性事件监听器已添加', { event });
    } catch (error) {
      this.logger.error('添加一次性事件监听器失败', { error, event });
      this.metrics.increment('event_one_time_listener_add_error');
      throw error;
    }
  }

  off(event: string, listener: (metadata: IEventMetadata) => void): void {
    try {
      this.emitter.off(event, listener);
      this.metrics.increment('event_listener_removed');
      this.logger.debug('事件监听器已移除', { event });
    } catch (error) {
      this.logger.error('移除事件监听器失败', { error, event });
      this.metrics.increment('event_listener_remove_error');
      throw error;
    }
  }

  removeAllListeners(event?: string): void {
    try {
      this.emitter.removeAllListeners(event);
      this.metrics.increment('all_event_listeners_removed');
      this.logger.debug('所有事件监听器已移除', { event });
    } catch (error) {
      this.logger.error('移除所有事件监听器失败', { error, event });
      this.metrics.increment('all_event_listeners_remove_error');
      throw error;
    }
  }

  listenerCount(event: string): number {
    try {
      return this.emitter.listenerCount(event);
    } catch (error) {
      this.logger.error('获取事件监听器数量失败', { error, event });
      this.metrics.increment('listener_count_error');
      return 0;
    }
  }

  async waitFor(event: string, timeout?: number): Promise<IEventMetadata> {
    const timer = this.metrics.startTimer('event_wait');
    try {
      const result = await this.emitter.waitFor(event, {
        timeout,
        handleError: true,
      });

      this.metrics.increment('event_wait_success');
      timer.end();
      return result;
    } catch (error) {
      this.logger.error('等待事件超时', { error, event, timeout });
      this.metrics.increment('event_wait_timeout');
      timer.end();
      throw error;
    }
  }

  onAny(listener: (event: string, metadata: IEventMetadata) => void): void {
    try {
      this.emitter.onAny(listener);
      this.metrics.increment('any_event_listener_added');
      this.logger.debug('全局事件监听器已添加');
    } catch (error) {
      this.logger.error('添加全局事件监听器失败', { error });
      this.metrics.increment('any_event_listener_add_error');
      throw error;
    }
  }

  offAny(listener: (event: string, metadata: IEventMetadata) => void): void {
    try {
      this.emitter.offAny(listener);
      this.metrics.increment('any_event_listener_removed');
      this.logger.debug('全局事件监听器已移除');
    } catch (error) {
      this.logger.error('移除全局事件监听器失败', { error });
      this.metrics.increment('any_event_listener_remove_error');
      throw error;
    }
  }
}
