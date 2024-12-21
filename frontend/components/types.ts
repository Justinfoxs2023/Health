import { ViewStyle } from 'react-native';

export interface ILoadingSpinnerProps {
  /** style 的描述 */
  style?: ViewStyle;
}

export interface IAlertDialogProps {
  /** visible 的描述 */
  visible: boolean;
  /** title 的描述 */
  title: string;
  /** message 的描述 */
  message: string;
  /** onConfirm 的描述 */
  onConfirm: () => void;
  /** onCancel 的描述 */
  onCancel?: () => void;
}

export interface IconProps {
  /** name 的描述 */
  name: string;
  /** size 的描述 */
  size: number;
  /** color 的描述 */
  color: string;
  /** style 的描述 */
  style?: ViewStyle;
}
