import React from 'react';
import { View, StyleSheet, Share, Platform } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { captureRef } from 'react-native-view-shot';

interface WorkoutShareData {
  id: string;
  date: string;
  duration: number;
  caloriesBurned: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }>;
  achievements?: Array<{
    title: string;
    description: string;
  }>;
}

interface ShareWorkoutProps {
  workout: WorkoutShareData;
  onShare?: () => void;
}

export const ShareWorkout = ({ workout, onShare }: ShareWorkoutProps) => {
  const theme = useTheme();
  const shareRef = React.useRef(null);

  const handleShare = async () => {
    try {
      // 捕获分享卡片的截图
      const uri = await captureRef(shareRef, {
        format: 'png',
        quality: 0.8,
      });

      // 准备分享文本
      const shareText = `
我完成了一次训练! 💪
时长: ${Math.round(workout.duration / 60)}分钟
消耗: ${workout.caloriesBurned}千卡
${workout.achievements?.length ? '\n获得成就:' : ''}
${workout.achievements?.map(a => `- ${a.title}`).join('\n')}

#健康生活 #运动健身
      `.trim();

      // 分享内容
      const result = await Share.share({
        message: shareText,
        url: Platform.OS === 'ios' ? uri : undefined,
        title: '分享训练记录',
      });

      if (result.action === Share.sharedAction) {
        onShare?.();
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card ref={shareRef} style={styles.shareCard}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.title}>训练完成!</Text>
            <Text style={styles.date}>{workout.date}</Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(workout.duration / 60)}
              </Text>
              <Text style={styles.statLabel}>分钟</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {workout.caloriesBurned}
              </Text>
              <Text style={styles.statLabel}>千卡</Text>
            </View>
          </View>

          <View style={styles.exercises}>
            {workout.exercises.map((exercise, index) => (
              <Text key={index} style={styles.exercise}>
                {exercise.name}: {exercise.sets}组 × {exercise.reps}次
                {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
              </Text>
            ))}
          </View>

          {workout.achievements?.length > 0 && (
            <View style={styles.achievements}>
              <Text style={styles.achievementsTitle}>获得成就</Text>
              {workout.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievement}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDesc}>
                    {achievement.description}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleShare}
        style={styles.shareButton}
        icon="share"
      >
        分享到社交平台
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  shareCard: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  exercises: {
    marginBottom: 16,
  },
  exercise: {
    fontSize: 16,
    marginBottom: 8,
  },
  achievements: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  achievement: {
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    marginTop: 8,
  },
}); 