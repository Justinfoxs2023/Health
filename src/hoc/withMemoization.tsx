import React, { memo, useCallback } from 'react';

interface MemoizationOptions {
  propsAreEqual?: (prevProps: any, nextProps: any) => boolean;
  dependencies?: string[];
}

export function withMemoization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: MemoizationOptions = {}
) {
  const { propsAreEqual, dependencies = [] } = options;

  // 创建记忆化的回调函数
  const MemoizedComponent = memo(({ ...props }: P) => {
    const memoizedCallbacks = dependencies.reduce((acc, dep) => {
      if (typeof props[dep] === 'function') {
        acc[dep] = useCallback(props[dep], []);
      }
      return acc;
    }, {});

    return <WrappedComponent {...props} {...memoizedCallbacks} />;
  }, propsAreEqual);

  return MemoizedComponent;
} 