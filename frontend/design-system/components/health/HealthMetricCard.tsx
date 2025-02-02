import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';
import { AnimationSystem } from '../../interaction/animations/AnimationSystem';

interface HealthMetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  trend?: {
    type: 'up' | 'down' | 'stable';
    value: number;
  };
  status?: 'normal' | 'warning' | 'alert';
  onPress?: () => void;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  status = 'normal',
  onPress
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
        <Text style={styles.unit}>{unit}</Text>
      </View>

      {trend && (
        <View style={styles.trend}>
          <CustomIcon 
            name={`trend-${trend.type}`} 
            size={16} 
            color={getStatusColor()} 
          />
          <Text style={[styles.trendValue, { color: getStatusColor() }]}>
            {trend.value}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.background.paper,
    borderRadius: DesignTokens.radius.lg,
    padding: DesignTokens.spacing.lg,
    borderLeftWidth: 4,
    ...DesignTokens.shadows.md
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm
  },
  title: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.secondary
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  value: {
    fontSize: DesignTokens.typography.sizes.xxl,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.text.primary
  },
  unit: {
    marginLeft: DesignTokens.spacing.xs,
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DesignTokens.spacing.sm
  },
  trendValue: {
    marginLeft: DesignTokens.spacing.xs,
    fontSize: DesignTokens.typography.sizes.sm
  }
}); 