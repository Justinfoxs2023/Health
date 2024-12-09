import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomIcon } from '../../../icons';
import { DesignTokens } from '../../../tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: transparent 
            ? 'transparent' 
            : DesignTokens.colors.neutral.white
        }
      ]}
    >
      <View style={styles.content}>
        {leftIcon && (
          <TouchableOpacity style={styles.icon} onPress={onLeftPress}>
            <CustomIcon 
              name={leftIcon} 
              size={24} 
              color={DesignTokens.colors.neutral.gray[900]} 
            />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon && (
          <TouchableOpacity style={styles.icon} onPress={onRightPress}>
            <CustomIcon 
              name={rightIcon} 
              size={24} 
              color={DesignTokens.colors.neutral.gray[900]} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.neutral.gray[200]
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.md
  },
  title: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.neutral.gray[900]
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
}); 