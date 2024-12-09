import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useQuery } from 'react-query';
import { getHealthRiskDetail } from '../../api/health';
import {
  LoadingSpinner,
  RiskLevelIndicator,
  DataChart,
  TimelineList
} from '../../components';

export const HealthRiskDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { data, isLoading } = useQuery(['healthRisk', id], () => getHealthRiskDetail(id));

  if (isLoading) return <LoadingSpinner />;

  const risk = data?.data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{risk.riskType}</Text>
          <RiskLevelIndicator level={risk.severity} />
        </View>
        <Text style={styles.description}>{risk.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>触发指标</Text>
        <View style={styles.card}>
          {risk.triggers.map((trigger, index) => (
            <View key={index} style={styles.trigger}>
              <Text style={styles.triggerName}>{trigger.indicator}</Text>
              <DataChart
                value={trigger.value}
                threshold={trigger.threshold}
                trend={trigger.trend}
                style={styles.chart}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>相关数据</Text>
        <View style={styles.card}>
          <View style={styles.dataGroup}>
            <Text style={styles.groupTitle}>运动数据</Text>
            <Text style={styles.dataItem}>运动强度: {risk.relatedData.exercise.intensity}</Text>
            <Text style={styles.dataItem}>运动时长: {risk.relatedData.exercise.duration}分钟</Text>
            <Text style={styles.dataItem}>运动频率: {risk.relatedData.exercise.frequency}次/周</Text>
          </View>

          <View style={styles.dataGroup}>
            <Text style={styles.groupTitle}>生命体征</Text>
            <Text style={styles.dataItem}>心率: {risk.relatedData.vitals.heartRate}次/分</Text>
            <Text style={styles.dataItem}>
              血压: {risk.relatedData.vitals.bloodPressure.systolic}/{risk.relatedData.vitals.bloodPressure.diastolic}mmHg
            </Text>
            <Text style={styles.dataItem}>体温: {risk.relatedData.vitals.bodyTemperature}°C</Text>
          </View>

          <View style={styles.dataGroup}>
            <Text style={styles.groupTitle}>营养数据</Text>
            <Text style={styles.dataItem}>热量摄入: {risk.relatedData.nutrition.calorieIntake}千卡</Text>
            <Text style={styles.dataItem}>蛋白质摄入: {risk.relatedData.nutrition.proteinIntake}克</Text>
            <Text style={styles.dataItem}>水分摄入: {risk.relatedData.nutrition.hydration}毫升</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>建议措施</Text>
        <View style={styles.card}>
          {risk.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendation}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationType}>{rec.type}</Text>
                <Text style={[styles.priority, styles[`priority${rec.priority}`]]}>
                  {rec.priority}优先级
                </Text>
              </View>
              <Text style={styles.recommendationContent}>{rec.description}</Text>
              <Text style={styles.timeframe}>建议完成时间: {rec.timeframe}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>处理记录</Text>
        <TimelineList
          data={risk.handlingRecords}
          renderItem={({ item }) => (
            <View style={styles.record}>
              <Text style={styles.recordAction}>{item.action}</Text>
              {item.result && <Text style={styles.recordResult}>{item.result}</Text>}
              <Text style={styles.recordTime}>
                {new Date(item.time).toLocaleString()}
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 15
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  section: {
    marginTop: 15,
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
  },
  trigger: {
    marginBottom: 15
  },
  triggerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  chart: {
    height: 200
  },
  dataGroup: {
    marginBottom: 20
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  dataItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5
  },
  recommendation: {
    marginBottom: 20
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  recommendationType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  priority: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  priority高: {
    backgroundColor: '#FFEBEE',
    color: '#D32F2F'
  },
  priority中: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00'
  },
  priority低: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32'
  },
  recommendationContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24
  },
  timeframe: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  record: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8
  },
  recordAction: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5
  },
  recordResult: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  recordTime: {
    fontSize: 12,
    color: '#999'
  }
}); 