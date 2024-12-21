import React from 'react';

import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';
import { HealthChart } from '../data-visualization/HealthChart';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface IHealthDataDetailProps {
  /** title 的描述 */
  title: string;
  /** value 的描述 */
  value: number;
  /** unit 的描述 */
  unit: string;
  /** type 的描述 */
  type: 'heartRate' | 'bloodPressure' | 'bloodOxygen' | 'weight';
  /** historicalData 的描述 */
  historicalData: {
    labels: string[];
    datasets: {
      data: number[];
      color?: string;
    }[];
  };
  /** analysis 的描述 */
  analysis: {
    trend: 'up' | 'down' | 'stable';
    status: 'normal' | 'warning' | 'alert';
    message: string;
  };
  /** recommendations 的描述 */
  recommendations: string[];
}

export const HealthDataDetail: React.FC<IHealthDataDetailProps> = ({
  title,
  value,
  unit,
  type,
  historicalData,
  analysis,
  recommendations,
}) => {
  const getStatusColor = () => {
    switch (analysis.status) {
      case 'warning':
        return DesignTokens.colors.functional.warning;
      case 'alert':
        return DesignTokens.colors.functional.error;
      default:
        return DesignTokens.colors.functional.success;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <CustomIcon name={type} size={24} color={DesignTokens.colors.brand.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      <View style={styles.chartContainer}>
        <HealthChart type="line" data={historicalData} height={200} />
      </View>

      <View style={[styles.analysisContainer, { borderColor: getStatusColor() }]}>
        <View style={styles.analysisHeader}>
          <CustomIcon name={`trend-${analysis.trend}`} size={20} color={getStatusColor()} />
          <Text style={[styles.analysisStatus, { color: getStatusColor() }]}>
            {analysis.status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.analysisMessage}>{analysis.message}</Text>
      </View>

      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>建议</Text>
        {recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <CustomIcon name="check-circle" size={16} color={DesignTokens.colors.brand.primary} />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignTokens.spacing.lg,
  },
  title: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    padding: DesignTokens.spacing.lg,
  },
  value: {
    fontSize: DesignTokens.typography.sizes.xxl,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.text.primary,
  },
  unit: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.secondary,
  },
  chartContainer: {
    padding: DesignTokens.spacing.lg,
  },
  analysisContainer: {
    margin: DesignTokens.spacing.lg,
    padding: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.radius.lg,
    borderLeftWidth: 4,
    backgroundColor: DesignTokens.colors.background.secondary,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  },
  analysisStatus: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: String(DesignTokens.typography.weights.bold),
  },
  analysisMessage: {
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.primary,
  },
  recommendationsContainer: {
    padding: DesignTokens.spacing.lg,
  },
  recommendationsTitle: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  },
  recommendationText: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.primary,
  },
});
