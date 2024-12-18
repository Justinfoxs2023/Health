import { BaseComponentProps } from './base';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

// 按钮组件
export interface IButtonProps extends BaseComponentProps {
  /** variant 的描述 */
  variant?: 'contained' | 'outlined' | 'text';
  /** color 的描述 */
  color?: 'primary' | 'secondary' | 'default';
  /** size 的描述 */
  size?: 'small' | 'medium' | 'large';
  /** disabled 的描述 */
  disabled?: boolean;
  /** loading 的描述 */
  loading?: boolean;
  /** onPress 的描述 */
  onPress?: () => void;
  /** startIcon 的描述 */
  startIcon?: React.ReactNode;
  /** endIcon 的描述 */
  endIcon?: React.ReactNode;
  /** fullWidth 的描述 */
  fullWidth?: boolean;
}

// 输入框组件
export interface InputProps extends BaseComponentProps {
  /** value 的描述 */
  value?: string;
  /** defaultValue 的描述 */
  defaultValue?: string;
  /** placeholder 的描述 */
  placeholder?: string;
  /** label 的描述 */
  label?: string;
  /** error 的描述 */
  error?: boolean;
  /** helperText 的描述 */
  helperText?: string;
  /** disabled 的描述 */
  disabled?: boolean;
  /** multiline 的描述 */
  multiline?: boolean;
  /** maxLength 的描述 */
  maxLength?: number;
  /** secureTextEntry 的描述 */
  secureTextEntry?: boolean;
  /** onChangeText 的描述 */
  onChangeText?: (text: string) => void;
  /** onFocus 的描述 */
  onFocus?: () => void;
  /** onBlur 的描述 */
  onBlur?: () => void;
}

// 卡片组件
export interface ICardProps extends BaseComponentProps {
  /** elevation 的描述 */
  elevation?: number;
  /** outlined 的描述 */
  outlined?: boolean;
  /** onPress 的描述 */
  onPress?: () => void;
  /** children 的描述 */
  children?: React.ReactNode;
}

// 图标组件
export interface IconProps extends BaseComponentProps {
  /** name 的描述 */
  name: string;
  /** size 的描述 */
  size?: number;
  /** color 的描述 */
  color?: string;
  /** onPress 的描述 */
  onPress?: () => void;
}

// 列表组件
export interface IListProps<T> extends BaseComponentProps {
  /** data 的描述 */
  data: T[];
  /** renderItem 的描述 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** keyExtractor 的描述 */
  keyExtractor?: (item: T, index: number) => string;
  /** ListEmptyComponent 的描述 */
  ListEmptyComponent?: React.ReactNode;
  /** ListHeaderComponent 的描述 */
  ListHeaderComponent?: React.ReactNode;
  /** ListFooterComponent 的描述 */
  ListFooterComponent?: React.ReactNode;
  /** ItemSeparatorComponent 的描述 */
  ItemSeparatorComponent?: React.ReactNode;
  /** onRefresh 的描述 */
  onRefresh?: () => void;
  /** refreshing 的描述 */
  refreshing?: boolean;
  /** onEndReached 的描述 */
  onEndReached?: () => void;
  /** onEndReachedThreshold 的描述 */
  onEndReachedThreshold?: number;
}

// 模态框组件
export interface IModalProps extends BaseComponentProps {
  /** visible 的描述 */
  visible: boolean;
  /** onClose 的描述 */
  onClose: () => void;
  /** title 的描述 */
  title?: string;
  /** children 的描述 */
  children: React.ReactNode;
  /** footer 的描述 */
  footer?: React.ReactNode;
  /** closeOnOverlayClick 的描述 */
  closeOnOverlayClick?: boolean;
  /** position 的描述 */
  position?: 'center' | 'bottom';
  /** animation 的描述 */
  animation?: 'fade' | 'slide';
}
