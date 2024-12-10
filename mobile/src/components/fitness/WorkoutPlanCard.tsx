import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, ProgressBar, useTheme } from 'react-native-paper';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  completed?: boolean;
}

interface WorkoutPlanCardProps {
  title: string;
  exercises: Exercise[];
  progress: number;
  onStart?: () => void;
}

export const WorkoutPlanCard = ({ title, exercises, progress, onStart }: WorkoutPlanCardProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        <View style={styles.exerciseList}>
          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetail}>
                {exercise.sets} × {exercise.reps}
              </Text>
            </View>
          ))}
        </View>
        <Button
          mode="contained"
          onPress={onStart}
          style={styles.button}
        >
          开始训练
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  exerciseList: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseName: {
    fontSize: 16,
  },
  exerciseDetail: {
    color: '#666',
  },
  button: {
    marginTop: 8,
  },
}); 