import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

interface IProps {
  /** text 的描述 */
  text: string;
  /** type 的描述 */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** size 的描述 */
  size?: 'small' | 'medium' | 'large';
}

export const Tag: React.FC<IProps> = ({ text, type = 'default', size = 'medium' }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'primary':
        return '#E3F2FD';
      case 'success':
        return '#E8F5E9';
      case 'warning':
        return '#FFF3E0';
      case 'danger':
        return '#FFEBEE';
      default:
        return '#F5F5F5';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'primary':
        return '#1976D2';
      case 'success':
        return '#2E7D32';
      case 'warning':
        return '#F57C00';
      case 'danger':
        return '#D32F2F';
      default:
        return '#666666';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      default:
        return 12;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 6, paddingVertical: 2 };
      case 'large':
        return { paddingHorizontal: 12, paddingVertical: 6 };
      default:
        return { paddingHorizontal: 8, paddingVertical: 4 };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }, getPadding()]}>
      <Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
  },
  text: {
    fontWeight: '500',
  },
});
