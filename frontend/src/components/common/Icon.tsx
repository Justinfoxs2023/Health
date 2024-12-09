import React from 'react';
import { View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export const Icon: React.FC<Props> = ({
  name,
  size = 24,
  color = '#000'
}) => {
  return <MaterialIcons name={name} size={size} color={color} />;
}; 