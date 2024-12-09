import { Logger } from '../../utils/logger';
import { Metrics } from '../../utils/metrics';

// 日志装饰器
export function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const logger = new Logger(target.constructor.name);

  descriptor.value = async function(...args: any[]) {
    try {
      logger.info(`Calling ${propertyKey}`, { args });
      const result = await originalMethod.apply(this, args);
      logger.info(`Completed ${propertyKey}`, { result });
      return result;
    } catch (error) {
      logger.error(`Error in ${propertyKey}`, { error, args });
      throw error;
    }
  };
}

// 性能监控装饰器
export function Monitor(operation: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const metrics = new Metrics();

    descriptor.value = async function(...args: any[]) {
      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        metrics.recordTiming(operation, duration);
        return result;
      } catch (error) {
        metrics.incrementCounter(`${operation}_error`);
        throw error;
      }
    };
  };
}

// 缓存装饰器
export function Cache(ttl: number = 3600) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { value: any; timestamp: number }>();

    descriptor.value = async function(...args: any[]) {
      const key = JSON.stringify(args);
      const cached = cache.get(key);
      
      if (cached && Date.now() - cached.timestamp < ttl * 1000) {
        return cached.value;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(key, { value: result, timestamp: Date.now() });
      return result;
    };
  };
} 