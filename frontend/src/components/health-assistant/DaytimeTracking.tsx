import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from '../common';
import { ActivityTracker } from './ActivityTracker';
import { WaterIntakeReminder } from './WaterIntakeReminder';
import { SedentaryAlert } from './SedentaryAlert';
import { MedicationReminder } from './MedicationReminder';

interface Props {
  activityGoal: number;
  waterIntake: {
    target: number;
    reminders: string[];
  };
  sedentaryAlert: {
    interval: number;
    message: string;
  };
  medication: {
    schedule: Array<{
      time: string;
      medicine: string;
      dosage: string;
    }>;
  };
}

export const DaytimeTracking: React.FC<Props> = ({
  activityGoal,
  waterIntake,
  sedentaryAlert,
  medication
}) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>日间追踪</Text>
      
      <ActivityTracker goal={activityGoal} />
      
      <WaterIntakeReminder
        target={waterIntake.target}
        reminders={waterIntake.reminders}
      />
      
      <SedentaryAlert
        interval={sedentaryAlert.interval}
        message={sedentaryAlert.message}
      />
      
      <MedicationReminder schedule={medication.schedule} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15
  }
}); 