import React from 'react';

import { LoadingSpinner, Icon, ProgressChart } from '../../components';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getExercisePlan, updateExerciseProgress } from '../../api/exercise';
import { useQuery, useMutation } from '@tanstack/react-query';

interface IExerciseItem {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: string;
  /** duration 的描述 */
  duration: number;
  /** calories 的描述 */
  calories: number;
  /** sets 的描述 */
  sets?: number;
  /** reps 的描述 */
  reps?: number;
  /** completed 的描述 */
  completed: boolean;
  /** videoUrl 的描述 */
  videoUrl?: string;
}

interface IExercisePlan {
  /** id 的描述 */
  id: string;
  /** date 的描述 */
  date: string;
  /** totalCalories 的描述 */
  totalCalories: number;
  /** completedCalories 的描述 */
  completedCalories: number;
  /** exercises 的描述 */
  exercises: IExerciseItem[];
  /** weeklyGoal 的描述 */
  weeklyGoal: {
    days: number;
    calories: number;
  };
  /** progress 的描述 */
  progress: {
    completedDays: number;
    totalCalories: number;
  };
}

export const ExercisePlanScreen = () => {
  const { data: plan, isLoading } = useQuery<IExercisePlan>('exercisePlan', getExercisePlan);

  const mutation = useMutation(updateExerciseProgress);

  const handleComplete = (exerciseId: string) => {
    mutation.mutate(exerciseId);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      {/* 周进度概览 */}
      <View style={styles.weeklyProgress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>本周运动目标</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.editGoal}>调整目标</Text>
          </TouchableOpacity>
        </View>
        <ProgressChart
          progress={plan?.progress.completedDays / plan?.weeklyGoal.days}
          size={120}
          strokeWidth={12}
          progressColor="#2E7D32"
        />
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan?.progress.completedDays}</Text>
            <Text style={styles.statLabel}>已完成天数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan?.weeklyGoal.days}</Text>
            <Text style={styles.statLabel}>目标天数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan?.progress.totalCalories}</Text>
            <Text style={styles.statLabel}>消耗卡路里</Text>
          </View>
        </View>
      </View>

      {/* 今日运动计划 */}
      <View style={styles.todayPlan}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>今日运动计划</Text>
          <Text style={styles.caloriesGoal}>目标消耗: {plan?.totalCalories}千卡</Text>
        </View>

        {plan?.exercises.map(exercise => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <TouchableOpacity
              style={styles.exerciseContent}
              onPress={() => navigation.navigate('ExerciseDetail', { id: exercise.id })}
            >
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {exercise.duration}分钟 · {exercise.calories}千卡
                  {exercise.sets && ` · ${exercise.sets}组${exercise.reps}次`}
                </Text>
              </View>
              {exercise.videoUrl && <Icon name="play-circle" size={24} color="#2E7D32" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.completeButton, exercise.completed && styles.completedButton]}
              onPress={() => handleComplete(exercise.id)}
            >
              <Icon
                name={exercise.completed ? 'check' : 'circle'}
                size={24}
                color={exercise.completed ? '#fff' : '#2E7D32'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 运动建议 */}
      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>运动小贴士</Text>
        <Text style={styles.tipsContent}>
          • 运动前做好充分的热身准备{'\n'}• 注意保持正确的运动姿势{'\n'}• 运动强度要循序渐进{'\n'}•
          注意补充水分
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  weeklyProgress: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editGoal: {
    fontSize: 14,
    color: '#2E7D32',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  todayPlan: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesGoal: {
    fontSize: 14,
    color: '#666',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  exerciseContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  completedButton: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  tips: {
    margin: 15,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  tipsContent: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 22,
  },
});
