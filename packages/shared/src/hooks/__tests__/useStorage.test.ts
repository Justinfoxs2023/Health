import { renderHook, act } from '@testing-library/react';
import { useStorage } from '../useStorage';
import { storage } from '../../services/storage';

describe('useStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('应该使用初始值', async () => {
    const initialValue = { name: 'test' };
    const { result } = renderHook(() => useStorage('test', initialValue));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.value).toEqual(initialValue);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('应该从存储加载值', async () => {
    const storedValue = { name: 'stored' };
    await storage.setItem('test', storedValue);

    const { result } = renderHook(() => useStorage('test', { name: 'initial' }));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.value).toEqual(storedValue);
  });

  it('应该更新存储的值', async () => {
    const { result } = renderHook(() => useStorage('test', { name: 'initial' }));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const newValue = { name: 'updated' };
    await act(async () => {
      await result.current.setValue(newValue);
    });

    expect(result.current.value).toEqual(newValue);
    expect(await storage.getItem('test')).toEqual(newValue);
  });

  it('应该使用更新函数', async () => {
    const { result } = renderHook(() => useStorage('test', { count: 0 }));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.setValue(prev => ({ count: prev.count + 1 }));
    });

    expect(result.current.value).toEqual({ count: 1 });
  });

  it('应该移除存储的值', async () => {
    const initialValue = { name: 'initial' };
    await storage.setItem('test', { name: 'stored' });

    const { result } = renderHook(() => useStorage('test', initialValue));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.remove();
    });

    expect(result.current.value).toEqual(initialValue);
    expect(await storage.getItem('test')).toBeNull();
  });

  it('应该处理加载错误', async () => {
    const error = new Error('Load error');
    jest.spyOn(storage, 'getItem').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useStorage('test', { name: 'initial' }));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.value).toEqual({ name: 'initial' });
  });

  it('应该处理保存错误', async () => {
    const error = new Error('Save error');
    jest.spyOn(storage, 'setItem').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useStorage('test', { name: 'initial' }));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.setValue({ name: 'updated' });
    });

    expect(result.current.error).toEqual(error);
  });

  it('应该处理移除错误', async () => {
    const error = new Error('Remove error');
    jest.spyOn(storage, 'removeItem').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useStorage('test', { name: 'initial' }));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.remove();
    });

    expect(result.current.error).toEqual(error);
  });

  it('应该使用存储配置', async () => {
    const config = { ttl: 1000, encrypt: true };
    const setItemSpy = jest.spyOn(storage, 'setItem');

    const { result } = renderHook(() => useStorage('test', { name: 'initial' }, config));

    // 等待加载完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.setValue({ name: 'updated' });
    });

    expect(setItemSpy).toHaveBeenCalledWith('test', { name: 'updated' }, config);
  });
}); 