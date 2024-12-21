import React, { memo, useCallback } from 'react';

interface IMemoizationOptions {
  /** propsAreEqual 的描述 */
    propsAreEqual: prevProps: /** any 的描述 */
    /** any 的描述 */
    any, /** nextProps 的描述 */
    /** nextProps 的描述 */
    nextProps: any  /** boolean 的描述 */
    /** boolean 的描述 */
    boolean;
  /** dependencies 的描述 */
    dependencies: string;
}

export function withMemoization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: IMemoizationOptions = {},
): React.NamedExoticComponent<P> {
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
