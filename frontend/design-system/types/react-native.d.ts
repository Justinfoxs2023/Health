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