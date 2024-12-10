import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { HealthMetrics } from './health/HealthMetrics';

export const HealthStatus = () => {
  const theme = useTheme();

  const healthData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        data: [65, 68, 66, 70, 69, 67, 68],
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>健康状况</Text>
        <HealthMetrics 
          data={healthData}
          title="心率"
          unit="次/分钟"
        />
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
}); 