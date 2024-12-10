import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph } from 'react-native-paper';
import { HealthMetric } from '@/types/health-metrics';

interface HealthAnalyticsProps {
  metrics: HealthMetric[];
  timeRange: 'day' | 'week' | 'month' | 'year';
  onRangeChange: (range: string) => void;
}

export const HealthAnalytics: React.FC<HealthAnalyticsProps> = ({
  metrics,
  timeRange,
  onRangeChange
}) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analyzeMetrics();
  }, [metrics, timeRange]);

  const analyzeMetrics = async () => {
    setLoading(true);
    try {
      const data = await processMetrics(metrics, timeRange);
      setAnalysisData(data);
    } finally {
      setLoading(false);
    }
  };

  const renderTrendChart = () => (
    <Card style={styles.chart}>
      <Card.Content>
        <Title>健康趋势</Title>
        <LineChart
          data={analysisData.trends}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={styles.chartStyle}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* 时间范围选择器 */}
      <TimeRangeSelector
        range={timeRange}
        onChange={onRangeChange}
      />

      {/* 健康指标概览 */}
      <MetricsSummary metrics={metrics} />

      {/* 趋势图表 */}
      {analysisData && renderTrendChart()}

      {/* 健康建议 */}
      <HealthRecommendations
        data={analysisData?.recommendations}
      />

      {/* 风险预警 */}
      <RiskAlerts
        risks={analysisData?.risks}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  chart: {
    marginVertical: 8,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  }
}); 