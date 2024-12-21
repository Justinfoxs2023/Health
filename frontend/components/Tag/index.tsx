import React from 'react';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IProps {
  /** text 的描述 */
  text: string;
  /** type 的描述 */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** small 的描述 */
  small?: boolean;
  /** onPress 的描述 */
  onPress?: () => void;
}

export const Tag: React.FC<IProps> = ({ text, type = 'default', small, onPress }) => {
  const Container = onPress ? TouchableOpacity : TouchableOpacity;

  return (
    <Container
      style={[
        styles.container,
        styles[type],
        small && styles.smallContainer,
        !onPress && styles.noPress,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.text, styles[`${type}Text`], small && styles.smallText]}>{text}</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  noPress: {
    opacity: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  smallText: {
    fontSize: 12,
  },
  default: {
    backgroundColor: '#f5f5f5',
  },
  defaultText: {
    color: '#666',
  },
  primary: {
    backgroundColor: '#e3f2fd',
  },
  primaryText: {
    color: '#1976d2',
  },
  success: {
    backgroundColor: '#e8f5e9',
  },
  successText: {
    color: '#2e7d32',
  },
  warning: {
    backgroundColor: '#fff3e0',
  },
  warningText: {
    color: '#f57c00',
  },
  danger: {
    backgroundColor: '#ffebee',
  },
  dangerText: {
    color: '#d32f2f',
  },
});
