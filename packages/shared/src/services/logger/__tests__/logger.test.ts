import { logger, LoggerService, ILogEntry } from '../index';
import { storage } from '../../storage';

describe('LoggerService', () => {
  let consoleSpy: jest.SpyInstance;
  let storageSpy: jest.SpyInstance;
  let dateNowSpy: jest.SpyInstance;
  const mockTimestamp = 1609459200000; // 2021-01-01T00:00:00.000Z

  beforeEach(() => {
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
    };
    storageSpy = jest.spyOn(storage, 'setItem').mockImplementation();
    dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    dateNowSpy.mockRestore();
  });

  it('应该创建单例实例', () => {
    const instance1 = LoggerService.getInstance();
    const instance2 = LoggerService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('应该使用默认配置', () => {
    const config = logger.getConfig();
    expect(config).toEqual({
      level: 'info',
      enableConsole: true,
      enableStorage: true,
      storageTTL: 7 * 24 * 60 * 60 * 1000,
      maxStorageEntries: 1000,
    });
  });

  it('应该更新配置', () => {
    const newConfig = {
      level: 'debug' as const,
      enableConsole: false,
    };
    logger.setConfig(newConfig);
    expect(logger.getConfig()).toEqual({
      ...logger.getConfig(),
      ...newConfig,
    });
  });

  describe('日志级别', () => {
    it('应该根据日志级别过滤日志', () => {
      logger.setConfig({ level: 'warn' });

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warn message');
      logger.error('Error message');

      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('控制台输出', () => {
    it('应该正确格式化控制台输出', () => {
      const message = 'Test message';
      const data = { test: true };

      logger.info(message, data);

      expect(consoleSpy.info).toHaveBeenCalledWith(
        '[2021-01-01T00:00:00.000Z] [INFO]',
        message,
        data,
      );
    });

    it('应该在错���日志中包含堆栈信息', () => {
      const error = new Error('Test error');
      logger.error('Error message', error);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[2021-01-01T00:00:00.000Z] [ERROR]',
        'Error message',
        error,
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(error.stack);
    });
  });

  describe('存储功能', () => {
    it('应该存储日志', async () => {
      const message = 'Test message';
      await logger.info(message);

      expect(storageSpy).toHaveBeenCalled();
      const call = storageSpy.mock.calls[0];
      expect(call[0]).toBe('logs');
      expect(Array.isArray(call[1])).toBe(true);
      expect(call[1][0]).toMatchObject({
        timestamp: mockTimestamp,
        level: 'info',
        message,
      });
    });

    it('应该限制存储的日志数量', async () => {
      logger.setConfig({ maxStorageEntries: 2 });

      await logger.info('Message 1');
      await logger.info('Message 2');
      await logger.info('Message 3');

      const logs = await logger.getLogs();
      expect(logs).toHaveLength(2);
      expect(logs[0].message).toBe('Message 2');
      expect(logs[1].message).toBe('Message 3');
    });

    it('应该清理过期日志', async () => {
      const oldTimestamp = mockTimestamp - 8 * 24 * 60 * 60 * 1000; // 8天前
      const oldLog: ILogEntry = {
        timestamp: oldTimestamp,
        level: 'info',
        message: 'Old message',
      };
      const newLog: ILogEntry = {
        timestamp: mockTimestamp,
        level: 'info',
        message: 'New message',
      };

      await storage.setItem('logs', [oldLog, newLog]);
      await logger.info('Another message');

      const logs = await logger.getLogs();
      expect(logs.some(log => log.timestamp === oldTimestamp)).toBe(false);
    });

    it('应该清空日志', async () => {
      await logger.info('Test message');
      await logger.clearLogs();

      const logs = await logger.getLogs();
      expect(logs).toHaveLength(0);
    });
  });

  describe('自定义处理器', () => {
    it('应该调用自定义处理器', async () => {
      const customHandler = jest.fn();
      logger.setConfig({ customHandler });

      const message = 'Test message';
      const data = { test: true };
      await logger.info(message, data);

      expect(customHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: mockTimestamp,
          level: 'info',
          message,
          data,
        }),
      );
    });
  });

  describe('源代码追踪', () => {
    it('应该包含源代码信息', async () => {
      await logger.info('Test message');
      const logs = await logger.getLogs();
      expect(logs[0].source).toMatch(/logger\.test\.ts/);
    });
  });
});
