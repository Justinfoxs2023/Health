import React from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native';

interface IProps {
  /** name 的描述 */
  name: string;
  /** size 的描述 */
  size?: number;
  /** color 的描述 */
  color?: string;
}

export const Icon: React.FC<IProps> = ({ name, size = 24, color = '#000' }) => {
  return <MaterialIcons name={name} size={size} color={color} />;
};
