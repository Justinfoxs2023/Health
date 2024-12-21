import React from 'react';

import { Icon } from './Icon';
import { Text } from './Text';
import { View, StyleSheet } from 'react-native';

interface IProps {
  /** color 的描述 */
  color: string;
  /** text 的描述 */
  text: string;
  /** icon 的描述 */
  icon?: string;
}

export const Badge: React.FC<IProps> = ({ color, text, icon }) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      {icon && <Icon name={icon} size={12} color="#fff" />}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});
