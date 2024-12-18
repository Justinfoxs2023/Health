import React, { useState, useEffect } from 'react';

import { Card, Text, Icon } from '../common';
import { CircadianRhythmGuide } from './CircadianRhythmGuide';
import { EnvironmentControl } from './EnvironmentControl';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSleepOptimization } from '../../hooks/sleep';

export const SleepOptimization: React.FC = () => {
  const [plan, setPlan] = useState(null);
  const { getOptimizationPlan, loading } = useSleepOptimization();

  useEffect(() => {
    loadOptimizationPlan();
  }, []);

  const loadOptimizationPlan = async () => {
    const data = await getOptimizationPlan();
    if (data) {
      setPlan(data);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <Text style={styles.title}>睡眠优化方案</Text>
        <Text style={styles.subtitle}>为您定制的睡眠改善建议</Text>
      </Card>

      {plan && (
        <>
          <CircadianRhythmGuide
            lightExposure={plan.circadianRhythm.lightExposure}
            activityTiming={plan.circadianRhythm.activityTiming}
          />
          <EnvironmentControl
            temperature={plan.environment.temperature}
            humidity={plan.environment.humidity}
            noise={plan.environment.noise}
            light={plan.environment.light}
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
