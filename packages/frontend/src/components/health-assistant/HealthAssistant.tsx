import React, { useState, useEffect } from 'react';

import { Card, Text, Button, LoadingSpinner } from '../common';
import { DaytimeTracking } from './DaytimeTracking';
import { EmergencySupport } from './EmergencySupport';
import { EveningAssessment } from './EveningAssessment';
import { MorningRoutine } from './MorningRoutine';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useHealthAssistant } from '../../hooks/health-assistant';

export const HealthAssistant: React.FC = () => {
  const [routine, setRoutine] = useState(null);
  const { getDailyRoutine, loading, error } = useHealthAssistant();

  useEffect(() => {
    loadDailyRoutine();
  }, []);

  const loadDailyRoutine = async () => {
    const data = await getDailyRoutine();
    if (data) {
      setRoutine(data);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <Text style={styles.title}>个性化健康管家</Text>
        <Text style={styles.subtitle}>您的专属健康助理</Text>
      </Card>

      {routine && (
        <>
          <MorningRoutine
            vitalSigns={routine.morning.vitalSigns}
            breakfast={routine.morning.breakfast}
            exercise={routine.morning.exercise}
          />
          <DaytimeTracking
            activityGoal={routine.daytime.activityGoal}
            waterIntake={routine.daytime.waterIntake}
            sedentaryAlert={routine.daytime.sedentaryAlert}
            medication={routine.daytime.medication}
          />
          <EveningAssessment
            healthSummary={routine.evening.healthSummary}
            sleepPlan={routine.evening.sleepPlan}
            nextDayPlan={routine.evening.nextDayPlan}
          />
          <EmergencySupport />
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
