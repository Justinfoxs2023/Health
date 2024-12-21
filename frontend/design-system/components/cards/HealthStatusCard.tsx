import React from 'react';

import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { animations } from '../../animations';

interface IHealthStatusCardProps {
  /** title 的描述 */
  title: string;
  /** value 的描述 */
  value: string | number;
  /** unit 的描述 */
  unit?: string;
  /** icon 的描述 */
  icon: string;
  /** trend 的描述 */
  trend?: {
    type: 'up' | 'down' | 'stable';
    value: string | number;
  };
  /** status 的描述 */
  status?: 'normal' | 'warning' | 'alert';
  /** onPress 的描述 */
  onPress?: () => void;
}

export const HealthStatusCard: React.FC<IHealthStatusCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  status = 'normal',
  onPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return DesignTokens.colors.functional.warning;
      case 'alert':
        return DesignTokens.colors.functional.error;
      default:
        return DesignTokens.colors.functional.success;
    }
  };

  const getTrendIcon = () => {
    switch (trend?.type) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'trending-flat';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: getStatusColor() }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <CustomIcon name={icon} size={24} color={getStatusColor()} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>

      {trend && (
        <View style={styles.trend}>
          <CustomIcon name={getTrendIcon()} size={16} color={getStatusColor()} />
          <Text style={[styles.trendValue, { color: getStatusColor() }]}>{trend.value}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.neutral.white,
    borderRadius: DesignTokens.radius.lg,
    padding: DesignTokens.spacing.md,
    borderLeftWidth: 4,
    ...DesignTokens.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  },
  title: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.neutral.gray[600],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: DesignTokens.typography.sizes.xxl,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.neutral.gray[900],
  },
  unit: {
    marginLeft: DesignTokens.spacing.xs,
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.neutral.gray[600],
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DesignTokens.spacing.sm,
  },
  trendValue: {
    marginLeft: DesignTokens.spacing.xs,
    fontSize: DesignTokens.typography.sizes.sm,
  },
});
