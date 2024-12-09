declare module 'react-native-vector-icons' {
  export function createIconSetFromIcoMoon(
    config: any,
    fontFamily: string,
    fontFile?: string
  ): any;
}

declare module 'react-native-vector-icons/*' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  class Icon extends Component<IconProps> {}
  export default Icon;
} 