import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getExerciseProgress, completeExercise } from '../../api/exercise';
import { LoadingSpinner, Icon, Timer, AlertDialog } from '../../components';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ExerciseProgress {
  planId: string;
  currentDay: number;
  exercises: {
    id: string;
    name: string;
    type: string;
    duration: number;
    calories: number;
    sets?: number;
    reps?: number;
    completed: boolean;
    startTime?: string;
    endTime?: string;
  }[];
  totalDuration: number;
  completedDuration: number;
  totalCalories: number;
  burnedCalories: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

export const ExerciseProgressScreen = ({ route, navigation }) => {
  const { planId } = route.params;
  const [activeExercise, setActiveExercise] = React.useState<string | null>(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const { data: progress, isLoading, refetch } = useQuery<ExerciseProgress>(
    ['exerciseProgress', planId],
    () => getExerciseProgress(planId)
  );

  const completeMutation = useMutation(completeExercise, {
    onSuccess: () => {
      refetch();
      if (progress?.exercises.every(e => e.completed)) {
        setAlertMessage('恭喜您完成今天的运动计划！');
        setShowAlert(true);
      }
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '操作失败，请重试');
      setShowAlert(true);
    }
  });

  const handleStartExercise = (exerciseId: string) => {
    if (activeExercise) {
      setAlertMessage('请先完成当前运动');
      setShowAlert(true);
      return;
    }
    setActiveExercise(exerciseId);
  };

  const handleCompleteExercise = (exerciseId: string) => {
    completeMutation.mutate(exerciseId);
    setActiveExercise(null);
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.completedDuration / progress.totalDuration) * 100);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      {/* 总体进度 */}
      <View style={styles.header}>
        <Text style={styles.title}>今日运动进度</Text>
        <View style={styles.progressStats}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
            <Text style={styles.progressLabel}>完成进度</Text>
          </View>
          <View style={styles.statsColumn}>
            <View style={styles.statItem}>
              <Icon name="clock" size={20} color="#666" />
              <Text style={styles.statValue}>
                {progress?.completedDuration}/{progress?.totalDuration}分钟
              </Text>
              <Text style={styles.statLabel}>运动时长</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="activity" size={20} color="#666" />
              <Text style={styles.statValue}>
                {progress?.burnedCalories}/{progress?.totalCalories}千卡
              </Text>
              <Text style={styles.statLabel}>消耗热量</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 运动列表 */}
      <View style={styles.exerciseList}>
        {progress?.exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseType}>{exercise.type}</Text>
              </View>
              {exercise.completed ? (
                <View style={styles.completedBadge}>
                  <Icon name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.completedText}>已完成</Text>
                </View>
              ) : activeExercise === exercise.id ? (
                <View style={styles.inProgressBadge}>
                  <Icon name="play-circle" size={16} color="#1976D2" />
                  <Text style={styles.inProgressText}>进行中</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.exerciseDetails}>
              <View style={styles.detailItem}>
                <Icon name="clock" size={16} color="#666" />
                <Text style={styles.detailText}>{exercise.duration}分钟</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="activity" size={16} color="#666" />
                <Text style={styles.detailText}>{exercise.calories}千卡</Text>
              </View>
              {exercise.sets && (
                <View style={styles.detailItem}>
                  <Icon name="repeat" size={16} color="#666" />
                  <Text style={styles.detailText}>{exercise.sets}组{exercise.reps}次</Text>
                </View>
              )}
            </View>

            {activeExercise === exercise.id ? (
              <View style={styles.exerciseControls}>
                <Timer
                  duration={exercise.duration * 60}
                  onComplete={() => handleCompleteExercise(exercise.id)}
                />
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleCompleteExercise(exercise.id)}
                >
                  <Text style={styles.completeButtonText}>完成运动</Text>
                </TouchableOpacity>
              </View>
            ) : !exercise.completed && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => handleStartExercise(exercise.id)}
              >
                <Text style={styles.startButtonText}>开始运动</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />

      {completeMutation.isLoading && <LoadingSpinner />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  progressLabel: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 4
  },
  statsColumn: {
    flex: 1
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  statValue: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8
  },
  exerciseList: {
    padding: 15
  },
  exerciseItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  exerciseInfo: {
    flex: 1
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  exerciseType: {
    fontSize: 12,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4
  },
  inProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  inProgressText: {
    fontSize: 12,
    color: '#1976D2',
    marginLeft: 4
  },
  exerciseDetails: {
    flexDirection: 'row',
    marginBottom: 15
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  exerciseControls: {
    alignItems: 'center'
  },
  startButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  completeButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
}); 