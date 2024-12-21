import React from 'react';

import { Text, useTheme } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WorkoutPlanCard } from './WorkoutPlanCard';

interface IWorkoutPlan {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** exercises 的描述 */
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
  }>;
  /** progress 的描述 */
  progress: number;
}

export const WorkoutPlanner = () => {
  const theme = useTheme();

  // 模拟数据，实际应从API获取
  const workoutPlans: IWorkoutPlan[] = [
    {
      id: '1',
      title: '每日基础训练',
      exercises: [
        { name: '俯卧撑', sets: 3, reps: 15 },
        { name: '深蹲', sets: 3, reps: 20 },
        { name: '平板支撑', sets: 3, reps: 60 },
      ],
      progress: 0.6,
    },
    {
      id: '2',
      title: '有氧训练',
      exercises: [
        { name: '慢跑', sets: 1, reps: 30 },
        { name: '跳绳', sets: 3, reps: 100 },
        { name: '高抬腿', sets: 3, reps: 50 },
      ],
      progress: 0.3,
    },
  ];

  const handleStartWorkout = (planId: string) => {
    // 实现开始训练的逻辑
    console.log('开始训练:', planId);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>今日训练计划</Text>
      {workoutPlans.map(plan => (
        <WorkoutPlanCard
          key={plan.id}
          title={plan.title}
          exercises={plan.exercises}
          progress={plan.progress}
          onStart={() => handleStartWorkout(plan.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
