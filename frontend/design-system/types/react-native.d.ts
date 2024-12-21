/**
 * @fileoverview TS 文件 react-native.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'react-native' {
  export * from '@types/react-native';
}

declare module '@types/react-native' {
  export interface TextProps extends React.ComponentProps<'text'> {
    style?: any;
    children?: React.ReactNode;
  }

  export interface ViewProps extends React.ComponentProps<'view'> {
    style?: any;
    children?: React.ReactNode;
  }

  export interface ImageProps extends React.ComponentProps<'img'> {
    source: any;
    style?: any;
  }
}
