import React, { useState, useEffect } from 'react';

import { Card, Text, Button, LoadingSpinner } from '../common';
import { MetricsPanel } from './MetricsPanel';
import { SleepQualityChart } from './SleepQualityChart';
import { SleepStagesChart } from './SleepStagesChart';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSleepMonitoring } from '../../hooks/sleep';

export const SleepMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState(null);
  const { getMetrics, loading, error } = useSleepMonitoring();

  useEffect(() => {
    loadSleepMetrics();
  }, []);

  const loadSleepMetrics = async () => {
    const data = await getMetrics();
    if (data) {
      setMetrics(data);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <Text style={styles.title}>睡眠质量监测</Text>
        <Text style={styles.subtitle}>实时监测您的睡眠健康状况</Text>
      </Card>

      {metrics && (
        <>
          <SleepQualityChart data={metrics.quality} />
          <SleepStagesChart data={metrics.stages} />
          <MetricsPanel
            efficiency={metrics.efficiency}
            breathing={metrics.breathingQuality}
            hrv={metrics.heartRateVariability}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
