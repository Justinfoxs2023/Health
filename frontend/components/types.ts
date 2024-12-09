import { ViewStyle } from 'react-native';

export interface LoadingSpinnerProps {
  style?: ViewStyle;
}

export interface AlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface IconProps {
  name: string;
  size: number;
  color: string;
  style?: ViewStyle;
} 