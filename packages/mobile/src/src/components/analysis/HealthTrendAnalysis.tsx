import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

interface TrendData {
  labels: string[];
  datasets: {
    data: number[];
    color?: string;
    label?: string;
  }[];
}

interface MetricTrend {
  name: string;
  data: TrendData;
  unit: string;
  analysis: {
    trend: 'up' | 'down' | 'stable';
    message: string;
    suggestion: string;
  };
}

interface HealthTrendAnalysisProps {
  trends: MetricTrend[];
}

export const HealthTrendAnalysis = ({ trends }: HealthTrendAnalysisProps) => {
  const theme = useTheme();

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
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
    <ScrollView style={styles.container}>
      {trends.map((metric, index) => (
        <Card key={index} style={styles.metricCard}>
          <Card.Content>
            <Text style={styles.metricTitle}>{metric.name}</Text>
            <LineChart
              data={metric.data}
              width={320}
              height={180}
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
            
            <View style={styles.analysisContainer}>
              <Text style={[
                styles.trendIndicator,
                { color: getTrendColor(metric.analysis.trend) }
              ]}>
                {metric.analysis.trend === 'up' ? '↑' : metric.analysis.trend === 'down' ? '↓' : '→'}
              </Text>
              <Text style={styles.analysisText}>{metric.analysis.message}</Text>
            </View>
            
            <Text style={styles.suggestion}>{metric.analysis.suggestion}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  metricCard: {
    marginBottom: 16,
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  analysisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  trendIndicator: {
    fontSize: 24,
    marginRight: 8,
  },
  analysisText: {
    fontSize: 16,
    flex: 1,
  },
  suggestion: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 