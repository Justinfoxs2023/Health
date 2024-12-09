import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { DesignTokens } from '../../tokens';

interface HealthChartProps {
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

export const HealthChart: React.FC<HealthChartProps> = ({
  type,
  data,
  height = 220,
  title,
  yAxisSuffix = ''
}) => {
  const screenWidth = Dimensions.get('window').width - DesignTokens.spacing.lg * 2;

  const chartConfig = {
    backgroundColor: DesignTokens.colors.background.paper,
    backgroundGradientFrom: DesignTokens.colors.background.paper,
    backgroundGradientTo: DesignTokens.colors.background.paper,
    decimalPlaces: 1,
    color: (opacity = 1) => DesignTokens.colors.brand.primary,
    style: {
      borderRadius: DesignTokens.radius.lg
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      width: screenWidth,
      height,
      chartConfig,
      style: {
        marginVertical: DesignTokens.spacing.md,
        borderRadius: DesignTokens.radius.lg
      }
    };

    return type === 'line' ? (
      <LineChart {...commonProps} bezier />
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
    backgroundColor: DesignTokens.colors.background.paper,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.lg,
    ...DesignTokens.shadows.md
  },
  title: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.md
  }
}); 