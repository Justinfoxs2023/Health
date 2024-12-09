declare module 'react-native-linear-gradient' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
  }

  export default class LinearGradient extends React.Component<LinearGradientProps> {}
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import React from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class Icon extends React.Component<IconProps> {}
}

declare module 'react-native-safe-area-context' {
  export function useSafeAreaInsets(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
} 