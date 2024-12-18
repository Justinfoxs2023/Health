import React from 'react';

import { ActivityTracker } from './ActivityTracker';
import { Card, Text, Icon } from '../common';
import { MedicationReminder } from './MedicationReminder';
import { SedentaryAlert } from './SedentaryAlert';
import { View, StyleSheet } from 'react-native';
import { WaterIntakeReminder } from './WaterIntakeReminder';

interface IProps {
  /** activityGoal 的描述 */
  activityGoal: number;
  /** waterIntake 的描述 */
  waterIntake: {
    target: number;
    reminders: string[];
  };
  /** sedentaryAlert 的描述 */
  sedentaryAlert: {
    interval: number;
    message: string;
  };
  /** medication 的描述 */
  medication: {
    schedule: Array<{
      time: string;
      medicine: string;
      dosage: string;
    }>;
  };
}

export const DaytimeTracking: React.FC<IProps> = ({
  activityGoal,
  waterIntake,
  sedentaryAlert,
  medication,
}) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>日间追踪</Text>

      <ActivityTracker goal={activityGoal} />

      <WaterIntakeReminder target={waterIntake.target} reminders={waterIntake.reminders} />

      <SedentaryAlert interval={sedentaryAlert.interval} message={sedentaryAlert.message} />

      <MedicationReminder schedule={medication.schedule} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
});
