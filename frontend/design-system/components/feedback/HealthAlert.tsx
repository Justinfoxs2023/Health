import React from 'react';

import { AnimationSystem } from '../../interaction/animations/AnimationSystem';
import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface IHealthAlertProps {
  /** type 的描述 */
  type: 'success' | 'warning' | 'error' | 'info';
  /** title 的描述 */
  title: string;
  /** message 的描述 */
  message: string;
  /** action 的描述 */
  action?: {
    label: string;
    onPress: () => void;
  };
  /** onClose 的描述 */
  onClose?: () => void;
}

export const HealthAlert: React.FC<IHealthAlertProps> = ({
  type,
  title,
  message,
  action,
  onClose,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const getAlertStyle = () => {
    switch (type) {
      case 'warning':
        return {
          backgroundColor: DesignTokens.colors.functional.warning + '10',
          borderColor: DesignTokens.colors.functional.warning,
          icon: 'warning',
        };
      case 'error':
        return {
          backgroundColor: DesignTokens.colors.functional.error + '10',
          borderColor: DesignTokens.colors.functional.error,
          icon: 'error',
        };
      case 'info':
        return {
          backgroundColor: DesignTokens.colors.functional.info + '10',
          borderColor: DesignTokens.colors.functional.info,
          icon: 'info',
        };
      default:
        return {
          backgroundColor: DesignTokens.colors.functional.success + '10',
          borderColor: DesignTokens.colors.functional.success,
          icon: 'success',
        };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: alertStyle.backgroundColor,
          borderColor: alertStyle.borderColor,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <CustomIcon name={alertStyle.icon} size={24} color={alertStyle.borderColor} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

      {action && (
        <TouchableOpacity style={styles.action} onPress={action.onPress}>
          <Text style={[styles.actionText, { color: alertStyle.borderColor }]}>{action.label}</Text>
        </TouchableOpacity>
      )}

      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <CustomIcon name="close" size={20} color={DesignTokens.colors.text.secondary} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: DesignTokens.radius.md,
    borderLeftWidth: 4,
    padding: DesignTokens.spacing.md,
    marginVertical: DesignTokens.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginLeft: DesignTokens.spacing.md,
  },
  title: {
    fontSize: DesignTokens.typography.sizes.md,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.xs,
  },
  message: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
  },
  action: {
    marginTop: DesignTokens.spacing.md,
  },
  actionText: {
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: String(DesignTokens.typography.weights.medium),
  },
  closeButton: {
    position: 'absolute',
    top: DesignTokens.spacing.sm,
    right: DesignTokens.spacing.sm,
  },
});
