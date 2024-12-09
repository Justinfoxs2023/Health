import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';

interface Props {
  color: string;
  text: string;
  icon?: string;
}

export const Badge: React.FC<Props> = ({ color, text, icon }) => {
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
    borderRadius: 12
  },
  text: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500'
  }
}); 