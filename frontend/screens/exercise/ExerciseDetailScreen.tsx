import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getExerciseDetail } from '../../api/exercise';
import { LoadingSpinner, Icon, VideoPlayer } from '../../components';

interface ExerciseDetail {
  id: string;
  name: string;
  type: string;
  description: string;
  duration: number;
  calories: number;
  sets?: number;
  reps?: number;
  videoUrl?: string;
  steps: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  tips: string[];
  targetMuscles: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export const ExerciseDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { data: exercise, isLoading } = useQuery<ExerciseDetail>(
    ['exerciseDetail', id],
    () => getExerciseDetail(id)
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: exercise?.name || '运动详情'
    });
  }, [navigation, exercise?.name]);

  if (isLoading) return <LoadingSpinner />;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FFA000';
      case 'hard':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {exercise?.videoUrl && (
        <VideoPlayer
          url={exercise.videoUrl}
          style={styles.video}
        />
      )}

      <View style={styles.header}>
        <View style={styles.basicInfo}>
          <View style={styles.infoItem}>
            <Icon name="clock" size={20} color="#666" />
            <Text style={styles.infoText}>{exercise?.duration}分钟</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="activity" size={20} color="#666" />
            <Text style={styles.infoText}>{exercise?.calories}千卡</Text>
          </View>
          {exercise?.sets && (
            <View style={styles.infoItem}>
              <Icon name="repeat" size={20} color="#666" />
              <Text style={styles.infoText}>{exercise.sets}组{exercise.reps}次</Text>
            </View>
          )}
        </View>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: getDifficultyColor(exercise?.difficulty || '') + '20' }]}>
            <Text style={[styles.tagText, { color: getDifficultyColor(exercise?.difficulty || '') }]}>
              {exercise?.difficulty === 'easy' ? '初级' : exercise?.difficulty === 'medium' ? '中级' : '高级'}
            </Text>
          </View>
          {exercise?.targetMuscles.map((muscle, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{muscle}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>运动说明</Text>
        <Text style={styles.description}>{exercise?.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>动作步骤</Text>
        {exercise?.steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>
            {step.imageUrl && (
              <Image source={{ uri: step.imageUrl }} style={styles.stepImage} />
            )}
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>注意事项</Text>
        {exercise?.tips.map((tip, index) => (
          <View key={index} style={styles.tip}>
            <Icon name="alert-circle" size={16} color="#F57C00" style={styles.tipIcon} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9
  },
  header: {
    backgroundColor: '#fff',
    padding: 20
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    fontSize: 12,
    color: '#2E7D32'
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  step: {
    marginBottom: 20
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  stepNumberText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 10
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 2
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
}); 