import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface WorkoutStats {
  date: string;
  duration: number;
  caloriesBurned: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

interface WorkoutTrackerProps {
  weeklyStats: WorkoutStats[];
  monthlyProgress: {
    labels: string[];
    workoutDays: number[];
    totalDuration: number[];
    caloriesBurned: number[];
  };
}

export const WorkoutTracker = ({ weeklyStats, monthlyProgress }: WorkoutTrackerProps) => {
  const theme = useTheme();

  const caloriesData = {
    labels: monthlyProgress.labels,
    datasets: [{
      data: monthlyProgress.caloriesBurned
    }]
  };

  const workoutDaysData = {
    labels: monthlyProgress.labels,
    datasets: [{
      data: monthlyProgress.workoutDays
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>每月训练天数</Text>
          <BarChart
            data={workoutDaysData}
            width={320}
            height={200}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.text,
            }}
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>卡路里消耗趋势</Text>
          <LineChart
            data={caloriesData}
            width={320}
            height={200}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.text,
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>本周训练记录</Text>
          {weeklyStats.map((day, index) => (
            <View key={index} style={styles.dayRecord}>
              <Text style={styles.date}>{day.date}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statItem}>
                  时长: {Math.round(day.duration / 60)}分钟
                </Text>
                <Text style={styles.statItem}>
                  消耗: {day.caloriesBurned}千卡
                </Text>
              </View>
              <View style={styles.exerciseList}>
                {day.exercises.map((exercise, exIndex) => (
                  <Text key={exIndex} style={styles.exercise}>
                    {exercise.name}: {exercise.sets}组 × {exercise.reps}次
                    {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  dayRecord: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statItem: {
    marginRight: 16,
    color: '#666',
  },
  exerciseList: {
    marginTop: 8,
  },
  exercise: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 