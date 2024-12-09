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