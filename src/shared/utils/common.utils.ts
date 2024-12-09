export class CommonUtils {
  // 深度合并对象
  static deepMerge<T>(target: T, source: Partial<T>): T {
    const merged = { ...target };
    
    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        merged[key] = CommonUtils.deepMerge(merged[key], source[key]);
      } else {
        merged[key] = source[key];
      }
    }
    
    return merged;
  }

  // 类型安全的类型转换
  static safeCast<T>(value: any, defaultValue: T): T {
    try {
      if (value === null || value === undefined) {
        return defaultValue;
      }
      return value as T;
    } catch {
      return defaultValue;
    }
  }

  // 异步重试机制
  static async retry<T>(
    func: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await func();
    } catch (error) {
      if (retries <= 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return CommonUtils.retry(func, retries - 1, delay * 2);
    }
  }

  // 防抖函数
  static debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // 节流函数
  static throttle(func: Function, limit: number): Function {
    let inThrottle: boolean;
    return function(...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
} 