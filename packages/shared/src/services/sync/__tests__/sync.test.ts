import { IHealthData, HealthDataType } from '../../../types';
import { http } from '../../http';
import { logger } from '../../logger';
import { storage } from '../../storage';
import { syncService } from '../index';

// Mock storage
jest.mock('../../storage', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// Mock http
jest.mock('../../http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock logger
jest.mock('../../logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('SyncService', () => {
  // 测试数据
  const mockHealthData: IHealthData = {
    id: '1',
    type: HealthDataType.BLOOD_PRESSURE,
    value: 120,
    timestamp: new Date(),
    userId: 'user1',
  };

  beforeEach(() => {
    // 清理所有mock
    jest.clearAllMocks();
    // 重置网络状态
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });
    // 清理事件监听
    window.dispatchEvent(new Event('online'));
  });

  describe('初始化', () => {
    it('应���是单例', () => {
      const instance1 = syncService;
      const instance2 = syncService;
      expect(instance1).toBe(instance2);
    });

    it('应该正确初始化状态', () => {
      const state = syncService.getState();
      expect(state).toEqual({
        syncing: false,
        lastSyncTime: null,
        pendingCount: 0,
        offline: false,
      });
    });

    it('应该加载待同步队列', () => {
      const mockQueue = ['1', '2', '3'];
      (storage.getItem as jest.Mock).mockResolvedValueOnce(mockQueue);

      // 触发加载
      syncService['loadPendingQueue']();

      expect(storage.getItem).toHaveBeenCalledWith('sync_pending_queue');
    });
  });

  describe('配置', () => {
    it('应该正确更新配置', () => {
      const newConfig = {
        autoSyncInterval: 10000,
        maxRetries: 5,
        conflictStrategy: 'client' as const,
      };

      syncService.configure(newConfig);

      expect(syncService['config']).toEqual({
        ...syncService['config'],
        ...newConfig,
      });
    });

    it('应该重启自动同步定时器', () => {
      jest.useFakeTimers();
      const spy = jest.spyOn(syncService as any, 'sync');

      syncService.configure({ autoSyncInterval: 1000 });
      jest.advanceTimersByTime(1000);

      expect(spy).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('同步操作', () => {
    it('应该正确添加待同步数据', async () => {
      await syncService.addPendingData(mockHealthData);

      expect(syncService.getState().pendingCount).toBe(1);
      expect(storage.setItem).toHaveBeenCalledWith('sync_pending_queue', [mockHealthData.id]);
    });

    it('应该防止重复同步', async () => {
      // 模拟同步中状态
      syncService['setState']({ syncing: true });

      await syncService.sync();

      expect(logger.warn).toHaveBeenCalledWith('同步已在进行中');
    });

    it('应该正确执行同步流程', async () => {
      // 模拟待同步数据
      const mockPendingData = [mockHealthData];
      const mockServerData = [{ ...mockHealthData, value: 130 }];

      (storage.getItem as jest.Mock)
        .mockResolvedValueOnce(mockHealthData)
        .mockResolvedValueOnce(['1']);
      (http.get as jest.Mock).mockResolvedValueOnce({ data: mockServerData });
      (http.post as jest.Mock).mockResolvedValueOnce({});

      await syncService.addPendingData(mockHealthData);
      await syncService.sync();

      expect(http.get).toHaveBeenCalledWith('/api/health-data');
      expect(http.post).toHaveBeenCalledWith('/api/health-data/batch', {
        data: expect.any(Array),
      });
    });

    it('应该正确处理同步错误', async () => {
      const error = new Error('同步失败');
      (http.get as jest.Mock).mockRejectedValueOnce(error);

      await syncService.addPendingData(mockHealthData);
      await expect(syncService.sync()).rejects.toThrow('同步失败');

      expect(logger.error).toHaveBeenCalled();
      expect(syncService.getState().syncing).toBe(false);
    });
  });

  describe('离线支持', () => {
    it('应该检测到离线状态', () => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: false,
      });
      window.dispatchEvent(new Event('offline'));

      expect(syncService.getState().offline).toBe(true);
    });

    it('应该在恢复在线时自动同步', async () => {
      const spy = jest.spyOn(syncService as any, 'sync');

      // 模拟离线状态
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: false,
      });
      window.dispatchEvent(new Event('offline'));

      // 添加待同步数据
      await syncService.addPendingData(mockHealthData);

      // 恢复在线
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: true,
      });
      window.dispatchEvent(new Event('online'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('冲突处理', () => {
    it('应该根据策略解决冲突', async () => {
      const localData = [mockHealthData];
      const serverData = [{ ...mockHealthData, value: 130 }];

      // 测试服务器优先策略
      syncService.configure({ conflictStrategy: 'server' });
      const resolved1 = await syncService['resolveConflicts'](localData, serverData);
      expect(resolved1[0].value).toBe(130);

      // 测试客户端优先策略
      syncService.configure({ conflictStrategy: 'client' });
      const resolved2 = await syncService['resolveConflicts'](localData, serverData);
      expect(resolved2[0].value).toBe(120);

      // 测试手动解决策略
      syncService.configure({ conflictStrategy: 'manual' });
      const eventSpy = jest.spyOn(window, 'dispatchEvent');
      await syncService['resolveConflicts'](localData, serverData);
      expect(eventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    });
  });

  describe('清理操作', () => {
    it('应该正确清除待同步数据', async () => {
      await syncService.addPendingData(mockHealthData);
      await syncService.clearPendingData();

      expect(syncService.getState().pendingCount).toBe(0);
      expect(storage.setItem).toHaveBeenCalledWith('sync_pending_queue', []);
    });

    it('应该正确清除已同步的数据', async () => {
      await syncService.addPendingData(mockHealthData);
      await syncService['clearSyncedData']([mockHealthData]);

      expect(syncService.getState().pendingCount).toBe(0);
    });
  });
});
