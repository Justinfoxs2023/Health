import { CSSProperties } from 'react';

/** 动画时长配置 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 450
} as const;

/** 动画缓动函数配置 */
export const ANIMATION_EASING = {
  // 标准缓动
  EASE: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // 进入场景
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  // 退出场景
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  // 弹性缓动
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;

/** 动画类型 */
export type AnimationType = 
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom'
  | 'bounce'
  | 'rotate'
  | 'flip';

/** 动画配置接口 */
export interface AnimationConfig {
  /** 动画类型 */
  type: AnimationType;
  /** 动画时长(ms) */
  duration?: number;
  /** 动画延迟(ms) */
  delay?: number;
  /** 缓动函数 */
  easing?: string;
  /** 动画完成回调 */
  onComplete?: () => void;
}

/** 获取动画样式 */
export function getAnimationStyle(config: AnimationConfig): CSSProperties {
  const {
    type,
    duration = ANIMATION_DURATION.NORMAL,
    delay = 0,
    easing = ANIMATION_EASING.EASE
  } = config;

  const baseStyle: CSSProperties = {
    transition: `all ${duration}ms ${easing} ${delay}ms`
  };

  switch (type) {
    case 'fade':
      return {
        ...baseStyle,
        opacity: 0,
        '&.enter': {
          opacity: 1
        }
      };
    case 'slide-up':
      return {
        ...baseStyle,
        transform: 'translateY(100%)',
        '&.enter': {
          transform: 'translateY(0)'
        }
      };
    case 'slide-down':
      return {
        ...baseStyle,
        transform: 'translateY(-100%)',
        '&.enter': {
          transform: 'translateY(0)'
        }
      };
    case 'slide-left':
      return {
        ...baseStyle,
        transform: 'translateX(100%)',
        '&.enter': {
          transform: 'translateX(0)'
        }
      };
    case 'slide-right':
      return {
        ...baseStyle,
        transform: 'translateX(-100%)',
        '&.enter': {
          transform: 'translateX(0)'
        }
      };
    case 'zoom':
      return {
        ...baseStyle,
        transform: 'scale(0)',
        '&.enter': {
          transform: 'scale(1)'
        }
      };
    case 'bounce':
      return {
        ...baseStyle,
        transform: 'scale(0)',
        easing: ANIMATION_EASING.BOUNCE,
        '&.enter': {
          transform: 'scale(1)'
        }
      };
    case 'rotate':
      return {
        ...baseStyle,
        transform: 'rotate(-180deg)',
        '&.enter': {
          transform: 'rotate(0)'
        }
      };
    case 'flip':
      return {
        ...baseStyle,
        transform: 'perspective(400px) rotateX(-90deg)',
        '&.enter': {
          transform: 'perspective(400px) rotateX(0)'
        }
      };
    default:
      return baseStyle;
  }
}

/** 动画组件Props */
export interface AnimationProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 动画配置 */
  animation: AnimationConfig;
  /** 是否显示 */
  visible?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}

/** 创建CSS关键帧动画 */
export function createKeyframes(name: string, frames: Record<string, CSSProperties>): string {
  const keyframes = Object.entries(frames)
    .map(([key, value]) => {
      const cssProps = Object.entries(value)
        .map(([prop, val]) => `${prop}: ${val};`)
        .join(' ');
      return `${key} { ${cssProps} }`;
    })
    .join(' ');

  return `@keyframes ${name} { ${keyframes} }`;
}

/** 添加CSS关键帧动画到文档 */
export function injectKeyframes(name: string, frames: Record<string, CSSProperties>): void {
  const style = document.createElement('style');
  style.textContent = createKeyframes(name, frames);
  document.head.appendChild(style);
}

/** 预定义动画关键帧 */
export const ANIMATION_KEYFRAMES = {
  fadeIn: {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  },
  fadeOut: {
    '0%': { opacity: 1 },
    '100%': { opacity: 0 }
  },
  slideUp: {
    '0%': { transform: 'translateY(100%)' },
    '100%': { transform: 'translateY(0)' }
  },
  slideDown: {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(0)' }
  },
  zoomIn: {
    '0%': { transform: 'scale(0)' },
    '100%': { transform: 'scale(1)' }
  },
  zoomOut: {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(0)' }
  },
  rotate: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  bounce: {
    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
    '40%': { transform: 'translateY(-30px)' },
    '60%': { transform: 'translateY(-15px)' }
  }
}; 