import React from 'react';

declare module 'react-native' {
  // 基础样式类型
  export interface ViewStyle {
    [key: string]: any;
  }

  export interface TextStyle {
    [key: string]: any;
  }

  export interface ImageStyle {
    [key: string]: any;
  }

  // 基础Props类型
  export interface ViewProps {
    style?: ViewStyle | ViewStyle[];
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TextProps {
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    activeOpacity?: number;
    disabled?: boolean;
  }

  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    style?: TextStyle | TextStyle[];
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    [key: string]: any;
  }

  export interface ImageProps {
    source: ImageSourcePropType;
    style?: ImageStyle | ImageStyle[];
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
    [key: string]: any;
  }

  // 组件导出
  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const TextInput: React.ComponentType<TextInputProps>;
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
  export const Image: React.ComponentType<ImageProps>;
  export const SafeAreaView: React.ComponentType<ViewProps>;
  export const KeyboardAvoidingView: React.ComponentType<ViewProps>;
  export const ScrollView: React.ComponentType<ViewProps>;
  export const ActivityIndicator: React.ComponentType<ViewProps>;
} 