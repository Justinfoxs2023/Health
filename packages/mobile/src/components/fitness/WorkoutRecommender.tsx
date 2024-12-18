import React, { useState } from 'react';

import { Card, Text, Button, Chip, useTheme, ProgressBar } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';

interface IUserProfile {
  /** fitnessLevel 的描述 */
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  /** goals 的描述 */
  goals: string[];
  /** restrictions 的描述 */
  restrictions: string[];
  /** preferredTime 的描述 */
  preferredTime: number; // 单位：分钟
  /** availableEquipment 的描述 */
  availableEquipment: string[];
  /** recentWorkouts 的描述 */
  recentWorkouts: Array<{
    type: string;
    intensity: number;
    date: string;
  }>;
}

interface IExercise {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: 'strength' | 'cardio' | 'flexibility';
  /** targetMuscles 的描述 */
  targetMuscles: string[];
  /** equipment 的描述 */
  equipment: string[];
  /** difficulty 的描述 */
  difficulty: number;
  /** recommendedSets 的描述 */
  recommendedSets: number;
  /** recommendedReps 的描述 */
  recommendedReps: number;
  /** restTime 的描述 */
  restTime: number;
  /** calories 的描述 */
  calories: number;
}

interface IWorkoutRecommenderProps {
  /** userProfile 的描述 */
  userProfile: IUserProfile;
  /** onSelectWorkout 的描述 */
  onSelectWorkout: (workout: IRecommendedWorkout) => void;
}

interface IRecommendedWorkout {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** exercises 的描述 */
  exercises: IExercise[];
  /** duration 的描述 */
  duration: number;
  /** intensity 的描述 */
  intensity: number;
  /** targetAreas 的描述 */
  targetAreas: string[];
  /** estimatedCalories 的描述 */
  estimatedCalories: number;
  /** matchScore 的描述 */
  matchScore: number;
}

export const WorkoutRecommender = ({ userProfile, onSelectWorkout }: IWorkoutRecommenderProps) => {
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState<IRecommendedWorkout[]>([]);
  const [loading, setLoading] = useState(false);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // 这里实现推荐算法逻辑
      const workouts = await generateWorkoutPlans(userProfile);
      setRecommendations(workouts);
    } catch (error) {
      console.error('Error in WorkoutRecommender.tsx:', '生成推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>训练偏好</Text>
          <View style={styles.chipContainer}>
            {userProfile.goals.map(goal => (
              <Chip key={goal} style={styles.chip}>
                {goal}
              </Chip>
            ))}
          </View>

          <Text style={styles.label}>健身水平</Text>
          <Text style={styles.value}>{userProfile.fitnessLevel}</Text>

          <Text style={styles.label}>可用时间</Text>
          <Text style={styles.value}>{userProfile.preferredTime} 分钟</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={generateRecommendations}
        loading={loading}
        style={styles.generateButton}
      >
        生成个性化训练计划
      </Button>

      {recommendations.map(workout => (
        <Card key={workout.id} style={styles.workoutCard} onPress={() => onSelectWorkout(workout)}>
          <Card.Content>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutTitle}>{workout.name}</Text>
              <View style={styles.matchScore}>
                <Text style={styles.matchText}>匹配度</Text>
                <Text style={styles.scoreValue}>{Math.round(workout.matchScore * 100)}%</Text>
              </View>
            </View>

            <View style={styles.workoutDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>时长</Text>
                <Text style={styles.detailValue}>{workout.duration}分钟</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>强度</Text>
                <ProgressBar
                  progress={workout.intensity / 5}
                  color={theme.colors.primary}
                  style={styles.intensityBar}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>预计消耗</Text>
                <Text style={styles.detailValue}>{workout.estimatedCalories}千卡</Text>
              </View>
            </View>

            <View style={styles.targetAreas}>
              <Text style={styles.detailLabel}>目标部位</Text>
              <View style={styles.chipContainer}>
                {workout.targetAreas.map(area => (
                  <Chip key={area} style={styles.smallChip}>
                    {area}
                  </Chip>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
  },
  smallChip: {
    margin: 2,
    height: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  generateButton: {
    marginBottom: 16,
  },
  workoutCard: {
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchScore: {
    alignItems: 'center',
  },
  matchText: {
    fontSize: 12,
    color: '#666',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  workoutDetails: {
    marginBottom: 12,
  },
  detailItem: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  intensityBar: {
    height: 6,
    borderRadius: 3,
  },
  targetAreas: {
    marginTop: 8,
  },
});

// 推荐算法实现
async function generateWorkoutPlans(userProfile: IUserProfile): Promise<IRecommendedWorkout[]> {
  try {
    // 这里实现基于用户画像的训练计划生成算法
    // 可以考虑:
    // 1. 用户的健身水平
    // 2. 训练目标
    // 3. 可用设备
    // 4. 时间限制
    // 5. 最近的训练记录
    // 6. 身体状况和限制

    // 示例实现
    return [
      {
        id: '1',
        name: '全身力量训练',
        exercises: [],
        duration: 45,
        intensity: 3,
        targetAreas: ['胸部', '背部', '腿部'],
        estimatedCalories: 300,
        matchScore: 0.95,
      },
      // ... 更多推荐
    ];
  } catch (error) {
    console.error('Error in generateWorkoutPlans:', error);
    throw error;
  }
}
