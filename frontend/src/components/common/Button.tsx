import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';

interface Props {
  title: string;
  icon?: string;
  type?: 'solid' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onPress?: () => void;
}

export const Button: React.FC<Props> = ({
  title,
  icon,
  type = 'solid',
  size = 'medium',
  disabled,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[type],
        styles[size],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <Icon 
          name={icon} 
          size={size === 'small' ? 16 : 20}
          color={type === 'solid' ? '#fff' : '#2E7D32'} 
        />
      )}
      <Text style={[
        styles.text,
        styles[`${type}Text`],
        styles[`${size}Text`]
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8
  },
  solid: {
    backgroundColor: '#2E7D32'
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2E7D32'
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    fontWeight: '500'
  },
  solidText: {
    color: '#fff'
  },
  outlineText: {
    color: '#2E7D32'
  },
  smallText: {
    fontSize: 13
  },
  mediumText: {
    fontSize: 14
  },
  largeText: {
    fontSize: 16
  }
}); 