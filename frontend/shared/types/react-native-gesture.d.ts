/**
 * @fileoverview TS 文件 react-native-gesture.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'react-native' {
  export interface GestureResponderEvent {
    nativeEvent: {
      changedTouches: NativeTouchEvent[];
      identifier: string;
      locationX: number;
      locationY: number;
      pageX: number;
      pageY: number;
      target: string;
      timestamp: number;
      touches: NativeTouchEvent[];
    };
  }

  export interface NativeTouchEvent {
    identifier: string;
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
    target: string;
    timestamp: number;
  }

  export interface PanResponderGestureState {
    dx: number;
    dy: number;
    moveX: number;
    moveY: number;
    vx: number;
    vy: number;
    x0: number;
    y0: number;
    numberActiveTouches: number;
    stateID: number;
  }

  export interface PanResponderCallbacks {
    onStartShouldSetPanResponder?: (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => boolean;
    onMoveShouldSetPanResponder?: (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => boolean;
    onPanResponderGrant?: (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => void;
    onPanResponderMove?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
    onPanResponderRelease?: (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => void;
    onPanResponderTerminate?: (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => void;
  }

  export const PanResponder: {
    create: (config: PanResponderCallbacks) => {
      panHandlers: {
        onStartShouldSetResponder: (e: GestureResponderEvent) => boolean;
        onMoveShouldSetResponder: (e: GestureResponderEvent) => boolean;
        onResponderGrant: (e: GestureResponderEvent) => void;
        onResponderMove: (e: GestureResponderEvent) => void;
        onResponderRelease: (e: GestureResponderEvent) => void;
        onResponderTerminate: (e: GestureResponderEvent) => void;
      };
    };
  };
}
