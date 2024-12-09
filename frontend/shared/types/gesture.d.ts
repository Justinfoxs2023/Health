declare module 'react-native' {
  export interface GestureResponderHandlers {
    onStartShouldSetResponder?: (event: GestureResponderEvent) => boolean;
    onMoveShouldSetResponder?: (event: GestureResponderEvent) => boolean;
    onResponderGrant?: (event: GestureResponderEvent) => void;
    onResponderMove?: (event: GestureResponderEvent) => void;
    onResponderRelease?: (event: GestureResponderEvent) => void;
    onResponderTerminate?: (event: GestureResponderEvent) => void;
    onResponderTerminationRequest?: (event: GestureResponderEvent) => boolean;
  }

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
    force?: number;
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

  export const PanResponder: {
    create: (config: {
      onStartShouldSetPanResponder?: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => boolean;
      onMoveShouldSetPanResponder?: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => boolean;
      onPanResponderGrant?: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => void;
      onPanResponderMove?: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => void;
      onPanResponderRelease?: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => void;
      onPanResponderTerminate?: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => void;
    }) => {
      panHandlers: GestureResponderHandlers;
    };
  };
} 