// 手势配置类型
export interface GestureConfig {
  // 基础手势配置
  base: {
    tapDelay: number;      // 点击延迟
    doubleTapDelay: number; // 双击延迟
    longPressDelay: number; // 长按延迟
    panThreshold: number;   // 滑动阈值
    velocityThreshold: number; // 速度阈值
  };

  // 手势识别配置
  recognition: {
    minPointers: number;   // 最小触点数
    maxPointers: number;   // 最大触点数
    minDistance: number;   // 最小移动距离
    minVelocity: number;   // 最小速度
    direction: 'horizontal' | 'vertical' | 'both';
  };

  // 手势反馈
  feedback: {
    haptic: boolean;      // 触感反馈
    visual: boolean;      // 视觉反馈
    sound: boolean;       // 声音反馈
  };
}

// 手势状态
export interface GestureState {
  // 基础信息
  type: 'tap' | 'pan' | 'pinch' | 'rotate' | 'longPress';
  active: boolean;
  success: boolean;
  cancelled: boolean;

  // 位置信息
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  translationX: number;
  translationY: number;

  // 速度信息
  velocityX: number;
  velocityY: number;

  // 多点触控
  numberOfPointers: number;
  scale?: number;
  rotation?: number;

  // 时间信息
  startTime: number;
  currentTime: number;
  duration: number;
}

// 动画配置
export interface AnimationConfig {
  // 动画类型
  type: 'spring' | 'timing' | 'decay';
  
  // 通用配置
  duration?: number;
  delay?: number;
  easing?: string;
  useNativeDriver?: boolean;

  // 弹簧动画配置
  spring?: {
    damping: number;
    mass: number;
    stiffness: number;
    restDisplacementThreshold: number;
    restSpeedThreshold: number;
  };

  // 衰减动画配置
  decay?: {
    velocity: number;
    deceleration: number;
  };
}

// 转场动画
export interface TransitionConfig {
  // 转场类型
  type: 'fade' | 'slide' | 'scale' | 'flip' | 'custom';
  
  // 动画配置
  animation: AnimationConfig;
  
  // 转场方向
  direction?: 'left' | 'right' | 'up' | 'down';
  
  // 自定义配置
  custom?: {
    enter?: AnimationConfig;
    exit?: AnimationConfig;
    shared?: {
      element: string;
      animation: AnimationConfig;
    }[];
  };
}

// 性能监控
export interface PerformanceMetrics {
  // 帧率
  fps: number;
  jankCount: number;
  totalFrames: number;
  
  // 内存
  jsHeapSize: number;
  nativeHeapSize: number;
  
  // 渲染
  renderTime: number;
  layoutTime: number;
  
  // 手势
  gestureResponseTime: number;
  touchMoveCount: number;
} 