import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from '../common';
import { VitalSignsCard } from './VitalSignsCard';
import { BreakfastCard } from './BreakfastCard';
import { ExercisePlanCard } from './ExercisePlanCard';

interface Props {
  vitalSigns: {
    time: string;
    items: string[];
  };
  breakfast: {
    menu: string[];
    nutrition: Record<string, number>;
  };
  exercise: {
    type: string;
    duration: number;
    intensity: string;
  };
}

export const MorningRoutine: React.FC<Props> = ({
  vitalSigns,
  breakfast,
  exercise
}) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>晨间例程</Text>
      
      <VitalSignsCard 
        time={vitalSigns.time}
        items={vitalSigns.items}
      />
      
      <BreakfastCard
        menu={breakfast.menu}
        nutrition={breakfast.nutrition}
      />
      
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
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15
  }
}); 