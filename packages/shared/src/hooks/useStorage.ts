import React from 'react';

import { storage, IStorageItemConfig } from '../services/storage';

/**
 * 存储Hook
 * @param key 存储键
 * @param initialValue 初始值
 * @param config 存储配置
 */
export function useStorage<T>(
  key: string,
  initialValue: T,
  config?: IStorageItemConfig,
): {
  value: T;
  setValue: (newValue: T | ((prev: T) => T)) => Promise<void>;
  remove: () => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [value, setValue] = React.useState<T>(initialValue);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // 加载存储的值
  React.useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const storedValue = await storage.getItem<T>(key);
        setValue(storedValue ?? initialValue);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load value'));
        setValue(initialValue);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, initialValue]);

  // 更新值的函数
  const updateValue = React.useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      try {
        setLoading(true);
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        await storage.setItem(key, valueToStore, config);
        setValue(valueToStore);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to save value'));
      } finally {
        setLoading(false);
      }
    },
    [key, value, config],
  );

  // 移除值的函数
  const removeValue = React.useCallback(async () => {
    try {
      setLoading(true);
      await storage.removeItem(key);
      setValue(initialValue);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove value'));
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  return {
    value,
    setValue: updateValue,
    remove: removeValue,
    loading,
    error,
  };
}
