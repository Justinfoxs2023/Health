import React from 'react';

export interface SkeletonProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 骨架屏形状 */
  variant?: 'text' | 'circular' | 'rectangular';
  /** 骨架屏宽度 */
  width?: number | string;
  /** 骨架屏高度 */
  height?: number | string;
  /** 是否显示动画 */
  animation?: boolean;
  /** 动画效果 */
  effect?: 'pulse' | 'wave';
  /** 圆角大小 */
  borderRadius?: number | string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 动画颜色 */
  animationColor?: string;
}

/**
 * 骨架屏组件
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  style,
  variant = 'rectangular',
  width,
  height,
  animation = true,
  effect = 'wave',
  borderRadius,
  backgroundColor,
  animationColor
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'text':
        return {
          width: width ?? '100%',
          height: height ?? '1em',
          borderRadius: borderRadius ?? '4px'
        };
      case 'circular':
        const size = width ?? height ?? '40px';
        return {
          width: size,
          height: size,
          borderRadius: '50%'
        };
      case 'rectangular':
      default:
        return {
          width: width ?? '100%',
          height: height ?? '100px',
          borderRadius: borderRadius ?? '4px'
        };
    }
  };

  return (
    <div
      className={`skeleton ${animation ? `skeleton--${effect}` : ''} ${className || ''}`}
      style={{
        ...getVariantStyles(),
        backgroundColor: backgroundColor ?? 'var(--theme-skeleton-background)',
        '--skeleton-animation-color': animationColor ?? 'var(--theme-skeleton-animation)',
        ...style
      }}
    />
  );
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .skeleton {
    display: block;
    background-color: var(--theme-skeleton-background);
    position: relative;
    overflow: hidden;
  }

  .skeleton--pulse {
    animation: skeleton-pulse 1.5s ease-in-out 0.5s infinite;
  }

  .skeleton--wave {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        var(--skeleton-animation-color),
        transparent
      );
      animation: skeleton-wave 1.5s ease-in-out 0.5s infinite;
    }
  }

  @keyframes skeleton-pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes skeleton-wave {
    0% {
      transform: translateX(-100%);
    }
    50%, 100% {
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style); 