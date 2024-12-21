import { Logger } from '@utils/logger';
import { createMockLogger } from '@utils/__tests__/test-utils';

export class TestFactory {
  static createTestLogger(): Logger {
    return createMockLogger();
  }

  static createTestData<T>(override: Partial<T> = {}): T {
    // 实现测试数据生成逻辑
    return {
      id: 'test-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    } as T;
  }
}
