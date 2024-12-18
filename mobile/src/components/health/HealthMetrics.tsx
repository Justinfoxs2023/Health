import React from 'react';

import { Card, Text, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { View, StyleSheet } from 'react-native';

interface IHealthMetricsProps {
  /** data 的描述 */
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  };
  /** title 的描述 */
  title: string;
  /** unit 的描述 */
  unit: string;
}

export const HealthMetrics = ({ data, title, unit }: IHealthMetricsProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <LineChart
          data={data}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            decimalPlaces: 1,
            color: (opacity = 1) => theme.colors.primary,
            labelColor: (opacity = 1) => theme.colors.text,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
        <Text style={styles.unit}>单位: {unit}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  unit: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
