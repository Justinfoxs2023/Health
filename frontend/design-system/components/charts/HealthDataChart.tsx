import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { DesignTokens } from '../../tokens';

interface HealthDataChartProps {
  type: 'line' | 'bar';
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: string;
    }[];
  };
  height?: number;
  title?: string;
  yAxisSuffix?: string;
}

export const HealthDataChart: React.FC<HealthDataChartProps> = ({
  type,
  data,
  height = 220,
  title,
  yAxisSuffix = ''
}) => {
  const chartConfig = {
    backgroundColor: DesignTokens.colors.neutral.white,
    backgroundGradientFrom: DesignTokens.colors.neutral.white,
    backgroundGradientTo: DesignTokens.colors.neutral.white,
    decimalPlaces: 1,
    color: (opacity = 1) => DesignTokens.colors.brand.primary,
    style: {
      borderRadius: DesignTokens.radius.lg
    }
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
        borderRadius: DesignTokens.radius.lg
      }
    };

    return type === 'line' ? (
      <LineChart {...commonProps} />
    ) : (
      <BarChart {...commonProps} />
    );
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
    ...DesignTokens.shadows.md
  },
  title: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.neutral.gray[900],
    marginBottom: DesignTokens.spacing.md
  }
}); 