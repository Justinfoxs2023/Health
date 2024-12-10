import { Logger } from '../../utils/logger';
import { EventEmitter } from '../../utils/event-emitter';
import { StateManager } from '../../utils/state-manager';

export class PlatformStateService {
  private logger: Logger;
  private events: EventEmitter;
  private stateManager: StateManager;

  constructor() {
    this.logger = new Logger('PlatformState');
    this.events = new EventEmitter();
    this.stateManager = new StateManager();
  }

  // 同步状态
  async syncState(platform: string, state: any): Promise<void> {
    try {
      // 1. 验证状态
      await this.validateState(state);
      
      // 2. 合并状态
      const mergedState = await this.mergeState(platform, state);
      
      // 3. 更新状态
      await this.stateManager.setState(platform, mergedState);
      
      // 4. 广播更新
      this.events.emit('stateUpdated', {
        platform,
        state: mergedState
      });
    } catch (error) {
      this.logger.error('状态同步失败', error);
      throw error;
    }
  }

  // 订阅状态变化
  subscribeToState(platform: string, callback: (state: any) => void): () => void {
    const handler = (event: any) => {
      if (event.platform === platform) {
        callback(event.state);
      }
    };
    
    this.events.on('stateUpdated', handler);
    return () => this.events.off('stateUpdated', handler);
  }

  // 获取状态快照
  async getStateSnapshot(platform: string): Promise<any> {
    try {
      return await this.stateManager.getState(platform);
    } catch (error) {
      this.logger.error('获取状态快照失败', error);
      throw error;
    }
  }

  // 状态回滚
  async rollbackState(platform: string, version: string): Promise<void> {
    try {
      // 1. 获取历史状态
      const historicalState = await this.stateManager.getHistoricalState(
        platform,
        version
      );
      
      // 2. 验证回滚
      await this.validateRollback(platform, historicalState);
      
      // 3. 执行回滚
      await this.stateManager.setState(platform, historicalState);
      
      // 4. 广播回滚
      this.events.emit('stateRollback', {
        platform,
        version,
        state: historicalState
      });
    } catch (error) {
      this.logger.error('状态回滚失败', error);
      throw error;
    }
  }
} 