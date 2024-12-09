import { BaseComponentProps } from './base';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

// 按钮组件
export interface ButtonProps extends BaseComponentProps {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'default';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// 输入框组件
export interface InputProps extends BaseComponentProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  multiline?: boolean;
  maxLength?: number;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// 卡片组件
export interface CardProps extends BaseComponentProps {
  elevation?: number;
  outlined?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

// 图标组件
export interface IconProps extends BaseComponentProps {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
}

// 列表组件
export interface ListProps<T> extends BaseComponentProps {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ItemSeparatorComponent?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

// 模态框组件
export interface ModalProps extends BaseComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  position?: 'center' | 'bottom';
  animation?: 'fade' | 'slide';
} 