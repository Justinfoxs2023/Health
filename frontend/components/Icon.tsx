import React from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleProp, ViewStyle } from 'react-native';

interface IProps {
  /** name 的描述 */
  name: keyof typeof MaterialIcons.glyphMap;
  /** size 的描述 */
  size?: number;
  /** color 的描述 */
  color?: string;
  /** style 的描述 */
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IProps> = ({ name, size = 24, color = '#000', style }) => {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
};
