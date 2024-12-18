import { useState, useEffect, useCallback, useRef } from 'react';

import * from './useStorage';
import { BehaviorSubject } from 'rxjs';
import { debounce, throttle } from '../utils';
import { useGesture } from '@use-gesture/react';

/** 使用防抖值的Hook */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/** 使用节流函数的Hook */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): T {
  const throttled = useRef(throttle(fn, limit));
  return throttled.current as T;
}

/** 使用本地存储的Hook */
export function useLocalStorage<T>(key: string, initialValue: T): readonly [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = console.error('Error in index.ts:', () => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error('Error in index.ts:', error);
        return initialValue;
      }
    });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error in index.ts:', error);
    }
  };

  return [storedValue, setValue] as const;
}

/** 使用会话存储的Hook */
export function useSessionStorage<T>(key: string, initialValue: T): readonly [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = console.error('Error in index.ts:', () => {
      try {
        const item = window.sessionStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error('Error in index.ts:', error);
        return initialValue;
      }
    });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error in index.ts:', error);
    }
  };

  return [storedValue, setValue] as const;
}

/** 使用异步数据加载的Hook */
export function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true): { execute: () => Promise<void>; status: "idle" | "pending" | "success" | "error"; value: T | null; error: Error | null; } {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus('success');
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

/** 使用窗口大小的Hook */
export function useWindowSize(): { width: number; height: number; } {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/** 使用网络状态的Hook */
export function useNetwork(): { isOnline: boolean; networkType: string | undefined; } {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkType, setNetworkType] = useState<string | undefined>(
    (navigator.connection as any)?.type
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleConnectionChange = () => {
      setNetworkType((navigator.connection as any)?.type);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.connection?.addEventListener('change', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.connection?.removeEventListener('change', handleConnectionChange);
    };
  }, []);

  return { isOnline, networkType };
}

/** 使用滚动位置的Hook */
export function useScroll(): { x: number; y: number; } {
  const [scrollPosition, setScrollPosition] = useState({
    x: window.pageXOffset,
    y: window.pageYOffset,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

/** 性能监控Hook */
export function usePerformance(): { fcp: number; lcp: number; fid: number; cls: number; } {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0  // Cumulative Layout Shift
  });

  useEffect(() => {
    // 监控FCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setMetrics(prev => ({ ...prev, fcp: entries[0].startTime }));
      }
    }).observe({ entryTypes: ['paint'] });

    // 监控LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setMetrics(prev => ({ ...prev, lcp: entries[0].startTime }));
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // 监控FID
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setMetrics(prev => ({ ...prev, fid: entries[0].duration }));
      }
    }).observe({ entryTypes: ['first-input'] });

    // 监控CLS
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        setMetrics(prev => ({ ...prev, cls: entries[0].value }));
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }, []);

  return metrics;
}

/** 图片加载Hook */
export function useImageLoad(src?: string): { loading: boolean; error: Error | null; dimensions: { width: number; height: number; }; } {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      setLoading(false);
      setError(null);
    };
    img.onerror = () => {
      setLoading(false);
      setError(new Error('图片加载失败'));
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loading, error, dimensions };
}

/** 手势控制Hook */
export function useGestureControl(options = {}): { scale: number; rotation: number; position: { x: number; y: number; }; bind: any; } {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const bind = useGesture({
    onDrag: ({ movement: [mx, my] }) => {
      setPosition({ x: mx, y: my });
    },
    onPinch: ({ offset: [d] }) => {
      setScale(d);
    },
    onRotate: ({ offset: [r] }) => {
      setRotation(r);
    },
    ...options
  });

  return {
    scale,
    rotation,
    position,
    bind
  };
}

/** 数据同步Hook */
export function useDataSync<T>(key: string, initialData: T): { data: T; setData: React.Dispatch<React.SetStateAction<T>>; sync: () => Promise<void>; syncing: boolean; lastSync: Date | null; syncSubject: any; } {
  const [data, setData] = useState<T>(initialData);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const syncSubject = useRef(new BehaviorSubject<T>(initialData));

  const sync = console.error('Error in index.ts:', async () => {
      if (!navigator.onLine) return;

      setSyncing(true);
      try {
        // 执行同步逻辑
        const response = await fetch(`/api/sync/${key}`, {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const syncedData = await response.json();
        setData(syncedData);
        syncSubject.current.next(syncedData);
        setLastSync(new Date());
      } catch (error) {
        console.error('Error in index.ts:', '同步失败:', error);
      } finally {
        setSyncing(false);
      }
    }, [key, data]);

  useEffect(() => {
    const subscription = syncSubject.current.subscribe(newData => {
      localStorage.setItem(key, JSON.stringify(newData));
    });

    return () => subscription.unsubscribe();
  }, [key]);

  return {
    data,
    setData,
    sync,
    syncing,
    lastSync,
    syncSubject: syncSubject.current
  };
}

/** 健康数据监控Hook */
export function useHealthMonitor(userId: string): { vitals: { heartRate: number; bloodPressure: { systolic: number; diastolic: number; }; temperature: number; oxygenSaturation: number; }; alerts: string[]; } {
  const [vitals, setVitals] = useState({
    heartRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    temperature: 0,
    oxygenSaturation: 0
  });
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`wss://api.health.com/monitor/${userId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVitals(data.vitals);
      
      // 检查是否需要发出警报
      const newAlerts = [];
      if (data.vitals.heartRate > 100 || data.vitals.heartRate < 60) {
        newAlerts.push('心率异常');
      }
      if (data.vitals.bloodPressure.systolic > 140 || data.vitals.bloodPressure.diastolic > 90) {
        newAlerts.push('血压偏高');
      }
      if (data.vitals.temperature > 37.5) {
        newAlerts.push('体温偏高');
      }
      if (data.vitals.oxygenSaturation < 95) {
        newAlerts.push('血氧饱和度偏低');
      }
      
      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
      }
    };

    return () => ws.close();
  }, [userId]);

  return { vitals, alerts };
}

/** AI分析Hook */
export function useAIAnalysis(): { analyzing: boolean; results: any; error: Error | null; analyze: (data: any) => Promise<void>; } {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(async (data: any) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const results = await response.json();
      setResults(results);
    } catch (err) {
      setError(err as Error);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return {
    analyzing,
    results,
    error,
    analyze
  };
} 