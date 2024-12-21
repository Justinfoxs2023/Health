import React, { useEffect, useRef, useState } from 'react';

import { IAnimationProps, getAnimationStyle } from '../../utils/animation';

/** 动画组件 */
export const Animation: React.FC<IAnimationProps> = ({
  children,
  animation,
  visible = true,
  className,
  style,
}) => {
  const [isEntered, setIsEntered] = useState(visible);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (visible) {
      // 显示时立即渲染，然后添加enter类名触发动画
      setIsEntered(true);
      timeoutRef.current = window.setTimeout(() => {
        elementRef.current?.classList.add('enter');
      }, 50);
    } else {
      // 隐藏时先移除enter类名触发退出动画，然后移除元素
      elementRef.current?.classList.remove('enter');
      timeoutRef.current = window.setTimeout(() => {
        setIsEntered(false);
        animation.onComplete?.();
      }, animation.duration || 300);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, animation]);

  if (!isEntered) {
    return null;
  }

  return (
    <div
      ref={elementRef}
      className={`animation ${className || ''}`}
      style={{
        ...getAnimationStyle(animation),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .animation {
    will-change: transform, opacity;
  }
`;
document.head.appendChild(style);
