import React, { useEffect, useRef } from 'react';

import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CustomIcon } from '../../../icons';
import { DesignTokens } from '../../../tokens';

interface IToastProps {
  /** message 的描述 */
  message: string;
  /** type 的描述 */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** duration 的描述 */
  duration?: number;
  /** onClose 的描述 */
  onClose?: () => void;
}

export const Toast: React.FC<IToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: DesignTokens.colors.functional.success,
          icon: 'check-circle',
        };
      case 'error':
        return {
          backgroundColor: DesignTokens.colors.functional.error,
          icon: 'x-circle',
        };
      case 'warning':
        return {
          backgroundColor: DesignTokens.colors.functional.warning,
          icon: 'alert-triangle',
        };
      default:
        return {
          backgroundColor: DesignTokens.colors.functional.info,
          icon: 'info',
        };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: getTypeStyles().backgroundColor,
        },
      ]}
    >
      <CustomIcon name={getTypeStyles().icon} size={20} color={DesignTokens.colors.neutral.white} />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={handleClose}>
        <CustomIcon name="x" size={20} color={DesignTokens.colors.neutral.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: DesignTokens.spacing.xl,
    left: DesignTokens.spacing.md,
    right: DesignTokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    ...DesignTokens.shadows.md,
  },
  message: {
    flex: 1,
    marginHorizontal: DesignTokens.spacing.md,
    color: DesignTokens.colors.neutral.white,
    fontSize: DesignTokens.typography.sizes.md,
  },
});
