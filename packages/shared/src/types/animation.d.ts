/**
 * @fileoverview TS 文件 animation.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace Animated {
  export interface Value {
    setValue(value: number): void;
    interpolate(config: any): any;
  }

  export interface CompositeAnimation {
    start(callback?: () => void): void;
    stop(): void;
  }

  export interface AnimatedValue extends Value {
    _value: number;
  }
}
