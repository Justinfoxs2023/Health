import React from 'react';

import { BreakfastCard } from './BreakfastCard';
import { Card, Text, Icon } from '../common';
import { ExercisePlanCard } from './ExercisePlanCard';
import { View, StyleSheet } from 'react-native';
import { VitalSignsCard } from './VitalSignsCard';

interface IProps {
  /** vitalSigns 的描述 */
  vitalSigns: {
    time: string;
    items: string[];
  };
  /** breakfast 的描述 */
  breakfast: {
    menu: string[];
    nutrition: Record<string, number>;
  };
  /** exercise 的描述 */
  exercise: {
    type: string;
    duration: number;
    intensity: string;
  };
}

export const MorningRoutine: React.FC<IProps> = ({ vitalSigns, breakfast, exercise }) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>晨间例程</Text>

      <VitalSignsCard time={vitalSigns.time} items={vitalSigns.items} />

      <BreakfastCard menu={breakfast.menu} nutrition={breakfast.nutrition} />

      <ExercisePlanCard
        type={exercise.type}
        duration={exercise.duration}
        intensity={exercise.intensity}
      />
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
