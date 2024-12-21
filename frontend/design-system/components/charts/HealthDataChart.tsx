import React from 'react';

import { DesignTokens } from '../../tokens';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { View, StyleSheet, Dimensions } from 'react-native';

interface IHealthDataChartProps {
  /** type 的描述 */
  type: 'line' | 'bar';
  /** data 的描述 */
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: string;
    }[];
  };
  /** height 的描述 */
  height?: number;
  /** title 的描述 */
  title?: string;
  /** yAxisSuffix 的描述 */
  yAxisSuffix?: string;
}

export const HealthDataChart: React.FC<IHealthDataChartProps> = ({
  type,
  data,
  height = 220,
  title,
  yAxisSuffix = '',
}) => {
  const chartConfig = {
    backgroundColor: DesignTokens.colors.neutral.white,
    backgroundGradientFrom: DesignTokens.colors.neutral.white,
    backgroundGradientTo: DesignTokens.colors.neutral.white,
    decimalPlaces: 1,
    color: (opacity = 1) => DesignTokens.colors.brand.primary,
    style: {
      borderRadius: DesignTokens.radius.lg,
    },
  };

  const screenWidth = Dimensions.get('window').width - DesignTokens.spacing.lg * 2;

  const renderChart = () => {
    const commonProps = {
      data,
      width: screenWidth,
      height,
      chartConfig,
      bezier: true,
      style: {
        marginVertical: DesignTokens.spacing.md,
        borderRadius: DesignTokens.radius.lg,
      },
    };

    return type === 'line' ? <LineChart {...commonProps} /> : <BarChart {...commonProps} />;
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.neutral.white,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.lg,
    ...DesignTokens.shadows.md,
  },
  title: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.neutral.gray[900],
    marginBottom: DesignTokens.spacing.md,
  },
});
