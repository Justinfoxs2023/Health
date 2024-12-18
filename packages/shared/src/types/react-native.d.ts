/**
 * @fileoverview TS 文件 react-native.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'react-native' {
  import React from 'react';

  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
  }

  export interface TextProps {
    style?: any;
    children?: React.ReactNode;
  }

  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    activeOpacity?: number;
  }

  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    style?: TextStyle;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: string;
    autoCapitalize?: string;
  }

  export interface ImageProps {
    source: any;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  }

  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
  export const TextInput: React.ComponentType<TextInputProps>;
  export const Image: React.ComponentType<ImageProps>;
  export const StyleSheet: any;
  export const Animated: any;
  export const Platform: any;
  export const Dimensions: any;
  export const Keyboard: any;
  export const Alert: any;
}

declare module 'react-native-linear-gradient' {
  const LinearGradient: any;
  export default LinearGradient;
}

declare module 'react-native-vector-icons/*' {
  const Icon: any;
  export default Icon;
}

declare module 'react-native-chart-kit' {
  export const LineChart: any;
  export const BarChart: any;
  // 添加其他图表类型
}

export interface IViewStyle {
  [key: string]: any;
}

export interface ITextStyle {
  [key: string]: any;
}

export interface ImageStyle {
  [key: string]: any;
}

export const SafeAreaView: React.ComponentType<ViewProps>;
export const KeyboardAvoidingView: React.ComponentType<ViewProps>;
export const Alert: {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
};
export const Image: React.ComponentType<ImageProps>;
export const ScrollView: React.ComponentType<ScrollViewProps>;
export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;
export const Keyboard: {
  dismiss: () => void;
  addListener: (event: string, callback: () => void) => { remove: () => void };
};
export const Platform: {
  OS: 'ios' | 'android';
  select: <T>(specifics: { ios?: T; android?: T; default?: T }) => T;
};
export const Dimensions: {
  get: (dim: 'window' | 'screen') => { width: number; height: number };
};
export const Vibration: {
  vibrate: (pattern?: number | number[], repeat?: boolean) => void;
};
