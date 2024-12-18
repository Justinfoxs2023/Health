import { storage, StorageService } from '../index';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    indexedDB.deleteDatabase('health_app');
  });

  describe('localStorage', () => {
    it('应该正确存储和获取数据', async () => {
      const key = 'test';
      const value = { name: 'test', age: 18 };

      await storage.setItem(key, value);
      const result = await storage.getItem(key);

      expect(result).toEqual(value);
    });

    it('应该正确处理过期数据', async () => {
      const key = 'test';
      const value = { name: 'test' };

      await storage.setItem(key, value, { ttl: 100 }); // 100ms后过期

      const result1 = await storage.getItem(key);
      expect(result1).toEqual(value);

      await new Promise(resolve => setTimeout(resolve, 150));

      const result2 = await storage.getItem(key);
      expect(result2).toBeNull();
    });

    it('应该正确移除数据', async () => {
      const key = 'test';
      const value = { name: 'test' };

      await storage.setItem(key, value);
      await storage.removeItem(key);

      const result = await storage.getItem(key);
      expect(result).toBeNull();
    });

    it('应该正确清空数据', async () => {
      await storage.setItem('test1', { name: 'test1' });
      await storage.setItem('test2', { name: 'test2' });

      await storage.clear();

      const keys = await storage.keys();
      expect(keys).toHaveLength(0);
    });

    it('应该正确获取所有键', async () => {
      await storage.setItem('test1', { name: 'test1' });
      await storage.setItem('test2', { name: 'test2' });

      const keys = await storage.keys();
      expect(keys).toContain('test1');
      expect(keys).toContain('test2');
    });

    it('应该正确计算存储大小', async () => {
      await storage.setItem('test1', { name: 'test1' });
      await storage.setItem('test2', { name: 'test2' });

      const size = await storage.size();
      expect(size).toBeGreaterThan(0);
    });
  });

  describe('sessionStorage', () => {
    beforeEach(() => {
      (storage as any) = StorageService.getInstance({ driver: 'sessionStorage' });
    });

    it('应该正确存储和获取数据', async () => {
      const key = 'test';
      const value = { name: 'test' };

      await storage.setItem(key, value);
      const result = await storage.getItem(key);

      expect(result).toEqual(value);
    });
  });

  describe('indexedDB', () => {
    beforeEach(async () => {
      (storage as any) = StorageService.getInstance({ driver: 'indexedDB' });
      // 等待IndexedDB初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('应该正确存储和获取数据', async () => {
      const key = 'test';
      const value = { name: 'test' };

      await storage.setItem(key, value);
      const result = await storage.getItem(key);

      expect(result).toEqual(value);
    });

    it('应该正确移除数据', async () => {
      const key = 'test';
      const value = { name: 'test' };

      await storage.setItem(key, value);
      await storage.removeItem(key);

      const result = await storage.getItem(key);
      expect(result).toBeNull();
    });

    it('应该正确清空数据', async () => {
      await storage.setItem('test1', { name: 'test1' });
      await storage.setItem('test2', { name: 'test2' });

      await storage.clear();

      const keys = await storage.keys();
      expect(keys).toHaveLength(0);
    });
  });

  describe('错误处理', () => {
    it('应该处理存储配额超出错误', async () => {
      const key = 'test';
      const largeValue = new Array(10 * 1024 * 1024).fill('a').join(''); // 10MB

      await expect(storage.setItem(key, largeValue)).rejects.toThrow('QuotaExceededError');
    });

    it('应该处理无效JSON数据', async () => {
      localStorage.setItem('health_test', 'invalid json');

      const result = await storage.getItem('test');
      expect(result).toBeNull();
    });
  });

  describe('加密和压缩', () => {
    beforeEach(() => {
      (storage as any) = StorageService.getInstance({
        driver: 'localStorage',
        encryptionKey: 'test-key',
        compress: true,
      });
    });

    it('应该正确加密和解密数据', async () => {
      const key = 'test';
      const value = { name: 'test' };

      await storage.setItem(key, value, { encrypt: true });
      const result = await storage.getItem(key);

      expect(result).toEqual(value);
    });

    it('应该正确压缩和解压数据', async () => {
      const key = 'test';
      const value = { name: 'test' };

      await storage.setItem(key, value, { compress: true });
      const result = await storage.getItem(key);

      expect(result).toEqual(value);
    });
  });
});
