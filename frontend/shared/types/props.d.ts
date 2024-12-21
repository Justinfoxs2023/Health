import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

// 基础Props类型
export interface IBaseProps {
  /** style 的描述 */
  style?: ViewStyle | ViewStyle[];
  /** testID 的描述 */
  testID?: string;
}

// 按钮Props类型
export interface IButtonProps extends IBaseProps {
  /** title 的描述 */
  title: string;
  /** onPress 的描述 */
  onPress?: () => void;
  /** disabled 的描述 */
  disabled?: boolean;
  /** loading 的描述 */
  loading?: boolean;
  /** variant 的描述 */
  variant?: 'primary' | 'secondary' | 'outline';
  /** size 的描述 */
  size?: 'small' | 'medium' | 'large';
  /** buttonStyle 的描述 */
  buttonStyle?: ViewStyle;
  /** textStyle 的描述 */
  textStyle?: TextStyle;
}

// 输入框Props类型
export interface InputProps extends IBaseProps {
  /** value 的描述 */
  value?: string;
  /** onChangeText 的描述 */
  onChangeText?: (text: string) => void;
  /** placeholder 的描述 */
  placeholder?: string;
  /** label 的描述 */
  label?: string;
  /** error 的描述 */
  error?: string;
  /** secureTextEntry 的描述 */
  secureTextEntry?: boolean;
  /** keyboardType 的描述 */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  /** autoCapitalize 的描述 */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** maxLength 的描述 */
  maxLength?: number;
  /** disabled 的描述 */
  disabled?: boolean;
}

// 卡片Props类型
export interface ICardProps extends IBaseProps {
  /** title 的描述 */
  title?: string;
  /** subtitle 的描述 */
  subtitle?: string;
  /** onPress 的描述 */
  onPress?: () => void;
  /** elevation 的描述 */
  elevation?: number;
  /** children 的描述 */
  children?: React.ReactNode;
}

// 图标Props类型
export interface IconProps extends IBaseProps {
  /** name 的描述 */
  name: string;
  /** size 的描述 */
  size?: number;
  /** color 的描述 */
  color?: string;
  /** onPress 的描述 */
  onPress?: () => void;
}

// 列表Props类型
export interface IListProps<T> extends IBaseProps {
  /** data 的描述 */
  data: T[];
  /** renderItem 的描述 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** keyExtractor 的描述 */
  keyExtractor?: (item: T, index: number) => string;
  /** onRefresh 的描述 */
  onRefresh?: () => void;
  /** refreshing 的描述 */
  refreshing?: boolean;
  /** onEndReached 的描述 */
  onEndReached?: () => void;
  /** ListEmptyComponent 的描述 */
  ListEmptyComponent?: React.ReactNode;
  /** ListHeaderComponent 的描述 */
  ListHeaderComponent?: React.ReactNode;
  /** ListFooterComponent 的描述 */
  ListFooterComponent?: React.ReactNode;
}
