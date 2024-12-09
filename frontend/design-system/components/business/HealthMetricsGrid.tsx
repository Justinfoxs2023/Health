import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { HealthStatusCard } from '../cards/HealthStatusCard';
import { DesignTokens } from '../../tokens';
import { animations } from '../../animations';

interface HealthMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
  trend?: {
    type: 'up' | 'down' | 'stable';
    value: number;
  };
  status: 'normal' | 'warning' | 'alert';
}

interface HealthMetricsGridProps {
  metrics: HealthMetric[];
  onMetricPress?: (metricId: string) => void;
}

export const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({
  metrics,
  onMetricPress
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
          style={[
            styles.cardWrapper,
            { transform: [{ scale: animations.scale(index) }] }
          ]}
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
    gap: DesignTokens.spacing.md
  },
  cardWrapper: {
    width: 160,
    shadowColor: DesignTokens.colors.neutral.black,
    ...DesignTokens.shadows.md
  }
}); 