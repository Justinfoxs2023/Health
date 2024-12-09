declare module 'react-native' {
  export interface ViewStyle {
    [key: string]: any;
  }

  export interface TextStyle {
    [key: string]: any;
  }

  export interface ImageStyle {
    [key: string]: any;
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

  export const TextInput: React.ComponentType<TextInputProps>;
  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
  export const Platform: any;
  export const Dimensions: any;
  export const Keyboard: any;
  export const Alert: any;
} 