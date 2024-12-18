import React from 'react';

import { DesignTokens } from '../../tokens';
import { HealthStatusCard } from '../cards/HealthStatusCard';
import { View, StyleSheet, ScrollView } from 'react-native';
import { animations } from '../../animations';

interface IHealthMetric {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** value 的描述 */
  value: number;
  /** unit 的描述 */
  unit: string;
  /** icon 的描述 */
  icon: string;
  /** trend 的描述 */
  trend?: {
    type: 'up' | 'down' | 'stable';
    value: number;
  };
  /** status 的描述 */
  status: 'normal' | 'warning' | 'alert';
}

interface IHealthMetricsGridProps {
  /** metrics 的描述 */
  metrics: IHealthMetric[];
  /** onMetricPress 的描述 */
  onMetricPress?: (metricId: string) => void;
}

export const HealthMetricsGrid: React.FC<IHealthMetricsGridProps> = ({
  metrics,
  onMetricPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {metrics.map((metric, index) => (
        <View
          key={metric.id}
          style={[styles.cardWrapper, { transform: [{ scale: animations.scale(index) }] }]}
        >
          <HealthStatusCard
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            trend={metric.trend}
            status={metric.status}
            onPress={() => onMetricPress?.(metric.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: DesignTokens.spacing.md,
    gap: DesignTokens.spacing.md,
  },
  cardWrapper: {
    width: 160,
    shadowColor: DesignTokens.colors.neutral.black,
    ...DesignTokens.shadows.md,
  },
});
