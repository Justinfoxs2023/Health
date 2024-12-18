import { useState, useCallback, useMemo } from 'react';

import { shallowEqual } from 'react-redux';

interface IOptimizedStateOptions<T> {
  /** initialState 的描述 */
  initialState: T;
  /** cacheKey 的描述 */
  cacheKey?: string;
  /** normalizer 的描述 */
  normalizer?: (data: T) => any;
  /** compareFunc 的描述 */
  compareFunc?: (prev: T, next: T) => boolean;
}

export function useOptimizedState<T>({
  initialState,
  cacheKey,
  normalizer,
  compareFunc = shallowEqual,
}: IOptimizedStateOptions<T>): readonly [any, (newState: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(() => {
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : initialState;
    }
    return initialState;
  });

  const optimizedSetState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setState(prev => {
        const next = typeof newState === 'function' ? (newState as Function)(prev) : newState;

        // 数据范式化
        const normalizedNext = normalizer ? normalizer(next) : next;

        // 比较是否需要更新
        if (!compareFunc(prev, normalizedNext)) {
          // 缓存更新
          if (cacheKey) {
            localStorage.setItem(cacheKey, JSON.stringify(normalizedNext));
          }
          return normalizedNext;
        }
        return prev;
      });
    },
    [cacheKey, normalizer, compareFunc],
  );

  // 记忆化派生状态
  const memoizedState = useMemo(() => state, [state]);

  return [memoizedState, optimizedSetState] as const;
}
