import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

interface HealthDataCardProps {
  title: string;
  value: number;
  unit: string;
  data: number[];
  labels: string[];
  trend?: 'up' | 'down' | 'stable';
}

export const HealthDataCard = ({ title, value, unit, data, labels, trend }: HealthDataCardProps) => {
  const theme = useTheme();

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.error;
      case 'down':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.value, { color: getTrendColor() }]}>
            {value} {unit}
          </Text>
        </View>
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={300}
          height={150}
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            decimalPlaces: 1,
            color: (opacity = 1) => theme.colors.primary,
            labelColor: (opacity = 1) => theme.colors.text,
          }}
          bezier
          style={styles.chart}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 