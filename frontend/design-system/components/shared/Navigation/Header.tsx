import React from 'react';

import { CustomIcon } from '../../../icons';
import { DesignTokens } from '../../../tokens';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IHeaderProps {
  /** title 的描述 */
  title: string;
  /** leftIcon 的描述 */
  leftIcon?: string;
  /** rightIcon 的描述 */
  rightIcon?: string;
  /** onLeftPress 的描述 */
  onLeftPress?: () => void;
  /** onRightPress 的描述 */
  onRightPress?: () => void;
  /** transparent 的描述 */
  transparent?: boolean;
}

export const Header: React.FC<IHeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: transparent ? 'transparent' : DesignTokens.colors.neutral.white,
        },
      ]}
    >
      <View style={styles.content}>
        {leftIcon && (
          <TouchableOpacity style={styles.icon} onPress={onLeftPress}>
            <CustomIcon name={leftIcon} size={24} color={DesignTokens.colors.neutral.gray[900]} />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon && (
          <TouchableOpacity style={styles.icon} onPress={onRightPress}>
            <CustomIcon name={rightIcon} size={24} color={DesignTokens.colors.neutral.gray[900]} />
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
    borderBottomColor: DesignTokens.colors.neutral.gray[200],
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.md,
  },
  title: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.neutral.gray[900],
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
