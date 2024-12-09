import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

// 基础Props类型
export interface BaseProps {
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}

// 按钮Props类型
export interface ButtonProps extends BaseProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

// 输入框Props类型
export interface InputProps extends BaseProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  disabled?: boolean;
}

// 卡片Props类型
export interface CardProps extends BaseProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  elevation?: number;
  children?: React.ReactNode;
}

// 图标Props类型
export interface IconProps extends BaseProps {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
}

// 列表Props类型
export interface ListProps<T> extends BaseProps {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
  ListEmptyComponent?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
} 