import React from 'react';

import { Card, Text, useTheme } from 'react-native-paper';
import { HealthDataCard } from './HealthDataCard';
import { View, StyleSheet, ScrollView } from 'react-native';

interface IHealthData {
  /** heartRate 的描述 */
  heartRate: {
    current: number;
    history: number[];
    labels: string[];
  };
  /** bloodPressure 的描述 */
  bloodPressure: {
    systolic: number;
    diastolic: number;
    history: number[];
    labels: string[];
  };
  /** bloodSugar 的描述 */
  bloodSugar: {
    current: number;
    history: number[];
    labels: string[];
  };
}

export const HealthMonitor = () => {
  const theme = useTheme();

  // 模拟数据，实际应从API获取
  const healthData: IHealthData = {
    heartRate: {
      current: 75,
      history: [72, 75, 73, 78, 76, 74, 75],
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      history: [118, 122, 119, 121, 120, 118, 120],
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    bloodSugar: {
      current: 5.6,
      history: [5.4, 5.6, 5.5, 5.7, 5.6, 5.5, 5.6],
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
  };

  return (
    <ScrollView style={styles.container}>
      <HealthDataCard
        title="心率"
        value={healthData.heartRate.current}
        unit="次/分钟"
        data={healthData.heartRate.history}
        labels={healthData.heartRate.labels}
      />
      <HealthDataCard
        title="血压"
        value={healthData.bloodPressure.systolic}
        unit="mmHg"
        data={healthData.bloodPressure.history}
        labels={healthData.bloodPressure.labels}
      />
      <HealthDataCard
        title="血糖"
        value={healthData.bloodSugar.current}
        unit="mmol/L"
        data={healthData.bloodSugar.history}
        labels={healthData.bloodSugar.labels}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
