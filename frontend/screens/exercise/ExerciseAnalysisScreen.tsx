import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getExerciseStats } from '../../api/exercise';
import { LoadingSpinner, Icon, LineChart, BarChart, ProgressRing } from '../../components';
import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ExerciseStats {
  weeklyStats: {
    date: string;
    duration: number;
    calories: number;
    completedExercises: number;
  }[];
  monthlyStats: {
    month: string;
    totalDuration: number;
    totalCalories: number;
    completedDays: number;
  }[];
  exerciseTypeStats: {
    type: string;
    duration: number;
    calories: number;
    count: number;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    achieved: boolean;
    achievedAt?: string;
  }[];
}

export const ExerciseAnalysisScreen = () => {
  const { data: stats, isLoading } = useQuery<ExerciseStats>('exerciseStats', getExerciseStats);
  const [selectedMetric, setSelectedMetric] = React.useState<'duration' | 'calories'>('duration');

  const getWeeklyData = () => {
    const startDate = startOfWeek(new Date(), { locale: zhCN });
    const weekDays = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, 6)
    });

    return weekDays.map(day => {
      const dayStats = stats?.weeklyStats.find(
        stat => new Date(stat.date).toDateString() === day.toDateString()
      ) || { duration: 0, calories: 0 };

      return {
        date: format(day, 'EEE', { locale: zhCN }),
        duration: Math.round(dayStats.duration / 60), // 转换为小时
        calories: dayStats.calories
      };
    });
  };

  const getCompletionRate = () => {
    const totalDays = stats?.weeklyStats.length || 0;
    const completedDays = stats?.weeklyStats.filter(day => day.completedExercises > 0).length || 0;
    return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      {/* 本周概览 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>本周概览</Text>
        <View style={styles.overviewStats}>
          <View style={styles.statCard}>
            <ProgressRing
              progress={getCompletionRate()}
              size={80}
              strokeWidth={8}
              color="#2E7D32"
            />
            <Text style={styles.statValue}>{Math.round(getCompletionRate())}%</Text>
            <Text style={styles.statLabel}>完成率</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="clock" size={24} color="#2E7D32" />
            <Text style={styles.statValue}>
              {Math.round(
                stats?.weeklyStats.reduce((sum, day) => sum + day.duration, 0) || 0
              )}分钟
            </Text>
            <Text style={styles.statLabel}>总时长</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="activity" size={24} color="#2E7D32" />
            <Text style={styles.statValue}>
              {stats?.weeklyStats.reduce((sum, day) => sum + day.calories, 0) || 0}千卡
            </Text>
            <Text style={styles.statLabel}>总消耗</Text>
          </View>
        </View>
      </View>

      {/* 趋势图表 */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>运动趋势</Text>
          <View style={styles.metricToggle}>
            <TouchableOpacity
              style={[styles.metricButton, selectedMetric === 'duration' && styles.activeMetricButton]}
              onPress={() => setSelectedMetric('duration')}
            >
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'duration' && styles.activeMetricButtonText
              ]}>时长</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.metricButton, selectedMetric === 'calories' && styles.activeMetricButton]}
              onPress={() => setSelectedMetric('calories')}
            >
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'calories' && styles.activeMetricButtonText
              ]}>卡路里</Text>
            </TouchableOpacity>
          </View>
        </View>
        <LineChart
          data={getWeeklyData()}
          height={200}
          xKey="date"
          yKey={selectedMetric}
          color="#2E7D32"
        />
      </View>

      {/* 运动类型分布 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>运动类型分布</Text>
        <BarChart
          data={stats?.exerciseTypeStats.map(type => ({
            label: type.type,
            value: type.duration,
            calories: type.calories
          }))}
          height={200}
          barColor="#2E7D32"
        />
      </View>

      {/* 成就系统 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>运动成就</Text>
        {stats?.achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              {achievement.achieved && (
                <Icon name="award" size={20} color="#FFA000" />
              )}
            </View>
            <Text style={styles.achievementDesc}>{achievement.description}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(achievement.progress / achievement.target) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {achievement.progress}/{achievement.target}
              {achievement.achieved && ` · ${format(new Date(achievement.achievedAt || ''), 'yyyy/MM/dd')}`}
            </Text>
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
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statCard: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#666'
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  metricToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4
  },
  metricButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  activeMetricButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  metricButtonText: {
    fontSize: 14,
    color: '#666'
  },
  activeMetricButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  achievementCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 5
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2
  },
  progressText: {
    fontSize: 12,
    color: '#666'
  }
}); 