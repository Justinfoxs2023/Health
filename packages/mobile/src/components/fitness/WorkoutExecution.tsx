import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, ProgressBar, useTheme } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  restTime: number;
}

interface WorkoutExecutionProps {
  exercises: Exercise[];
  onComplete: (results: WorkoutResult) => void;
  onPause: () => void;
}

interface WorkoutResult {
  completedExercises: Array<{
    exerciseId: string;
    completedSets: number;
    totalReps: number;
    duration?: number;
  }>;
  totalDuration: number;
  caloriesBurned: number;
}

export const WorkoutExecution = ({ exercises, onComplete, onPause }: WorkoutExecutionProps) => {
  const theme = useTheme();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [results, setResults] = useState<WorkoutResult>({
    completedExercises: [],
    totalDuration: 0,
    caloriesBurned: 0
  });

  const currentExercise = exercises[currentExerciseIndex];
  const progress = currentExerciseIndex / exercises.length;

  const handleSetComplete = () => {
    if (currentSet < currentExercise.sets) {
      setIsResting(true);
    } else {
      const exerciseResult = {
        exerciseId: currentExercise.id,
        completedSets: currentSet,
        totalReps: currentSet * currentExercise.reps,
        duration: currentExercise.duration
      };

      setResults(prev => ({
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseResult]
      }));

      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        onComplete(results);
      }
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    setCurrentSet(prev => prev + 1);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.progressCard}>
        <Card.Content>
          <Text style={styles.progressText}>
            {currentExerciseIndex + 1} / {exercises.length}
          </Text>
          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>

      <Card style={styles.exerciseCard}>
        <Card.Content>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <Text style={styles.setInfo}>
            第 {currentSet} 组 / 共 {currentExercise.sets} 组
          </Text>
          <Text style={styles.repInfo}>
            {currentExercise.reps} 次
          </Text>

          {isResting ? (
            <View style={styles.timerContainer}>
              <CountdownCircleTimer
                isPlaying
                duration={currentExercise.restTime}
                colors={[theme.colors.primary]}
                onComplete={handleRestComplete}
              >
                {({ remainingTime }) => (
                  <Text style={styles.timerText}>{remainingTime}</Text>
                )}
              </CountdownCircleTimer>
              <Text style={styles.restText}>休息时间</Text>
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={handleSetComplete}
              style={styles.completeButton}
            >
              完成本组
            </Button>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={onPause}
        style={styles.pauseButton}
      >
        暂停训练
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  exerciseCard: {
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  setInfo: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  repInfo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 24,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  restText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  completeButton: {
    marginTop: 16,
  },
  pauseButton: {
    marginTop: 8,
  },
}); 