import { Logger } from '../../utils/logger';
import { EventEmitter } from '../../utils/event-emitter';

export abstract class BaseComponent {
  protected logger: Logger;
  protected events: EventEmitter;
  protected state: Map<string, any>;

  constructor(name: string) {
    this.logger = new Logger(name);
    this.events = new EventEmitter();
    this.state = new Map();
  }

  // 生命周期钩子
  protected async onInit(): Promise<void> {}
  protected async onDestroy(): Promise<void> {}
  protected async onStateChange(key: string, value: any): Promise<void> {}

  // 状态管理
  protected setState(key: string, value: any): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    this.onStateChange(key, value);
    this.events.emit('stateChange', { key, oldValue, newValue: value });
  }

  protected getState(key: string): any {
    return this.state.get(key);
  }

  // 事件处理
  protected on(event: string, handler: Function): void {
    this.events.on(event, handler);
  }

  protected off(event: string, handler: Function): void {
    this.events.off(event, handler);
  }

  protected emit(event: string, data?: any): void {
    this.events.emit(event, data);
  }
} 