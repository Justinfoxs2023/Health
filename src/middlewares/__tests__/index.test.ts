import { Express } from 'express';
import { createMockLogger } from '@utils/__tests__/test-utils';
import { setupMiddlewares } from '../index';

import { TestFactory } from '@/__tests__/helpers/test-factory';

describe('Middleware Setup', () => {
  let mockApp: Express;
  let mockLogger: jest.SpyInstance;

  beforeEach(() => {
    mockApp = {
      use: jest.fn(),
    } as unknown as Express;
    mockLogger = jest.spyOn(TestFactory.createTestLogger(), 'info');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('setup all middlewares correctly', () => {
    setupMiddlewares(mockApp);
    expect(mockApp.use).toHaveBeenCalledTimes(7); // 基础中间件数量
    expect(mockLogger).toHaveBeenCalledWith('中间件设置完成');
  });

  it('handle errors during setup', () => {
    const mockError = new Error('Setup failed');
    (mockApp.use as jest.Mock).mockImplementationOnce(() => {
      throw mockError;
    });

    expect(() => setupMiddlewares(mockApp)).toThrow(mockError);
    expect(mockLogger).toHaveBeenCalledWith('中间件设置失败', mockError);
  });
});
