/**
 * @fileoverview TS 文件 gesture.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 手势配置类型
export interface IGestureConfig {
  // 基础手势配置
  /** base 的描述 */
  base: {
    tapDelay: number; // 点击延迟
    doubleTapDelay: number; // 双击延迟
    longPressDelay: number; // 长按延迟
    panThreshold: number; // 滑动阈值
    velocityThreshold: number; // 速度阈值
  };

  // 手势识别配置
  /** recognition 的描述 */
  recognition: {
    minPointers: number; // 最小触点数
    maxPointers: number; // 最大触点数
    minDistance: number; // 最小移动距离
    minVelocity: number; // 最小速度
    direction: 'horizontal' | 'vertical' | 'both';
  };

  // 手势反馈
  /** feedback 的描述 */
  feedback: {
    haptic: boolean; // 触感反馈
    visual: boolean; // 视觉反馈
    sound: boolean; // 声音反馈
  };
}

// 手势状态
export interface IGestureState {
  // 基础信息
  /** type 的描述 */
  type: 'tap' | 'pan' | 'pinch' | 'rotate' | 'longPress';
  /** active 的描述 */
  active: boolean;
  /** success 的描述 */
  success: boolean;
  /** cancelled 的描述 */
  cancelled: boolean;

  // 位置信息
  /** x 的描述 */
  x: number;
  /** y 的描述 */
  y: number;
  /** absoluteX 的描述 */
  absoluteX: number;
  /** absoluteY 的描述 */
  absoluteY: number;
  /** translationX 的描述 */
  translationX: number;
  /** translationY 的描述 */
  translationY: number;

  // 速度信息
  /** velocityX 的描述 */
  velocityX: number;
  /** velocityY 的描述 */
  velocityY: number;

  // 多点触控
  /** numberOfPointers 的描述 */
  numberOfPointers: number;
  /** scale 的描述 */
  scale?: number;
  /** rotation 的描述 */
  rotation?: number;

  // 时间信息
  /** startTime 的描述 */
  startTime: number;
  /** currentTime 的描述 */
  currentTime: number;
  /** duration 的描述 */
  duration: number;
}

// 动画配置
export interface IAnimationConfig {
  // 动画类型
  /** type 的描述 */
  type: 'spring' | 'timing' | 'decay';

  // 通用配置
  /** duration 的描述 */
  duration?: number;
  /** delay 的描述 */
  delay?: number;
  /** easing 的描述 */
  easing?: string;
  /** useNativeDriver 的描述 */
  useNativeDriver?: boolean;

  // 弹簧动画配置
  /** spring 的描述 */
  spring?: {
    damping: number;
    mass: number;
    stiffness: number;
    restDisplacementThreshold: number;
    restSpeedThreshold: number;
  };

  // 衰减动画配置
  /** decay 的描述 */
  decay?: {
    velocity: number;
    deceleration: number;
  };
}

// 转场动画
export interface ITransitionConfig {
  // 转场类型
  /** type 的描述 */
  type: 'fade' | 'slide' | 'scale' | 'flip' | 'custom';

  // 动画配置
  /** animation 的描述 */
  animation: IAnimationConfig;

  // 转场方向
  /** direction 的描述 */
  direction?: 'left' | 'right' | 'up' | 'down';

  // 自定义配置
  /** custom 的描述 */
  custom?: {
    enter?: IAnimationConfig;
    exit?: IAnimationConfig;
    shared?: {
      element: string;
      animation: IAnimationConfig;
    }[];
  };
}

// 性能监控
export interface IPerformanceMetrics {
  // 帧率
  /** fps 的描述 */
  fps: number;
  /** jankCount 的描述 */
  jankCount: number;
  /** totalFrames 的描述 */
  totalFrames: number;

  // 内存
  /** jsHeapSize 的描述 */
  jsHeapSize: number;
  /** nativeHeapSize 的描述 */
  nativeHeapSize: number;

  // 渲染
  /** renderTime 的描述 */
  renderTime: number;
  /** layoutTime 的描述 */
  layoutTime: number;

  // 手势
  /** gestureResponseTime 的描述 */
  gestureResponseTime: number;
  /** touchMoveCount 的描述 */
  touchMoveCount: number;
}
