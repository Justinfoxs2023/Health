/**
 * @fileoverview TS 文件 vector-icons.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'react-native-vector-icons' {
  export function createIconSetFromIcoMoon(config: any, fontFamily: string, fontFile?: string): any;
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
