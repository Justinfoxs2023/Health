import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getExercisePlanDetail, startExercisePlan } from '../../api/exercise';
import { LoadingSpinner, Icon, AlertDialog } from '../../components';

interface ExercisePlanDetail {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  category: string;
  imageUrl: string;
  tags: string[];
  schedule: {
    dayOfWeek: number;
    exercises: {
      id: string;
      name: string;
      type: string;
      duration: number;
      sets?: number;
      reps?: number;
      calories: number;
      videoUrl?: string;
      description: string;
      tips: string[];
    }[];
  }[];
  requirements: string[];
  benefits: string[];
}

export const ExercisePlanDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { data: plan, isLoading } = useQuery<ExercisePlanDetail>(
    ['exercisePlan', id],
    () => getExercisePlanDetail(id)
  );
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const startMutation = useMutation(startExercisePlan, {
    onSuccess: () => {
      navigation.navigate('ExerciseProgress', { planId: id });
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '开始计划失败，请重试');
      setShowAlert(true);
    }
  });

  const getDayName = (day: number) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[day];
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return level;
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: plan?.imageUrl }} style={styles.coverImage} />
      
      <View style={styles.header}>
        <Text style={styles.title}>{plan?.title}</Text>
        <View style={styles.tags}>
          <View style={styles.levelTag}>
            <Text style={styles.levelText}>{getLevelText(plan?.level || '')}</Text>
          </View>
          {plan?.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Icon name="clock" size={20} color="#666" />
            <Text style={styles.statText}>{plan?.duration}分钟/天</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="activity" size={20} color="#666" />
            <Text style={styles.statText}>{plan?.calories}千卡/天</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.statText}>{plan?.schedule.length}天/周</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>计划介绍</Text>
        <Text style={styles.description}>{plan?.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>训练计划</Text>
        {plan?.schedule.map((day) => (
          <View key={day.dayOfWeek} style={styles.daySchedule}>
            <Text style={styles.dayTitle}>{getDayName(day.dayOfWeek)}</Text>
            {day.exercises.map((exercise, index) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseItem}
                onPress={() => navigation.navigate('ExerciseDetail', { id: exercise.id })}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetail}>
                    {exercise.duration}分钟 · {exercise.calories}千卡
                    {exercise.sets && ` · ${exercise.sets}组${exercise.reps}次`}
                  </Text>
                </View>
                {exercise.videoUrl && (
                  <Icon name="play-circle" size={24} color="#2E7D32" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>训练要求</Text>
        {plan?.requirements.map((req, index) => (
          <View key={index} style={styles.listItem}>
            <Icon name="check-circle" size={16} color="#2E7D32" style={styles.listIcon} />
            <Text style={styles.listText}>{req}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>训练效果</Text>
        {plan?.benefits.map((benefit, index) => (
          <View key={index} style={styles.listItem}>
            <Icon name="target" size={16} color="#2E7D32" style={styles.listIcon} />
            <Text style={styles.listText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => startMutation.mutate(id)}
      >
        <Text style={styles.startButtonText}>开始训练</Text>
      </TouchableOpacity>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />

      {startMutation.isLoading && <LoadingSpinner />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  levelTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8
  },
  levelText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    fontSize: 12,
    color: '#666'
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0'
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5
  },
  section: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22
  },
  daySchedule: {
    marginBottom: 20
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0'
  },
  exerciseInfo: {
    flex: 1
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  exerciseDetail: {
    fontSize: 12,
    color: '#666'
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10
  },
  listIcon: {
    marginRight: 10,
    marginTop: 2
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  startButton: {
    margin: 20,
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 