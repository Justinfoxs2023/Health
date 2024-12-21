import React from 'react';

import { Card, Text, useTheme, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { View, StyleSheet, ScrollView } from 'react-native';

interface IAssessmentRecord {
  /** id 的描述 */
  id: string;
  /** date 的描述 */
  date: string;
  /** healthScore 的描述 */
  healthScore: number;
  /** bmi 的描述 */
  bmi: number;
  /** metrics 的描述 */
  metrics: {
    [key: string]: number;
  };
  /** recommendations 的描述 */
  recommendations: string[];
}

interface IAssessmentHistoryProps {
  /** records 的描述 */
  records: IAssessmentRecord[];
  /** onViewDetail 的描述 */
  onViewDetail: (record: IAssessmentRecord) => void;
}

export const AssessmentHistory = ({ records, onViewDetail }: IAssessmentHistoryProps) => {
  const theme = useTheme();

  const healthScoreData = {
    labels: records.map(r => r.date.slice(5)), // 只显示月日
    datasets: [
      {
        data: records.map(r => r.healthScore),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.trendCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>健康评分趋势</Text>
          <LineChart
            data={healthScoreData}
            width={320}
            height={180}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.text,
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {records.map(record => (
        <Card key={record.id} style={styles.recordCard}>
          <Card.Content>
            <View style={styles.recordHeader}>
              <Text style={styles.date}>{record.date}</Text>
              <Text style={styles.score}>评分: {record.healthScore}</Text>
            </View>

            <View style={styles.metricsContainer}>
              {Object.entries(record.metrics).map(([key, value]) => (
                <View key={key} style={styles.metric}>
                  <Text style={styles.metricLabel}>{key}</Text>
                  <Text style={styles.metricValue}>{value}</Text>
                </View>
              ))}
            </View>

            <Button
              mode="outlined"
              onPress={() => onViewDetail(record)}
              style={styles.detailButton}
            >
              查看详情
            </Button>
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
  trendCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recordCard: {
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metric: {
    width: '50%',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailButton: {
    marginTop: 8,
  },
});
