import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getExerciseStats } from '../../api/exercise';
import { LoadingSpinner, Icon, LineChart, BarChart } from '../../components';

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

export const ExerciseStatsScreen = () => {
  const [timeRange, setTimeRange] = React.useState<'week' | 'month'>('week');
  const { data: stats, isLoading } = useQuery<ExerciseStats>('exerciseStats', getExerciseStats);

  if (isLoading) return <LoadingSpinner />;

  const weeklyData = stats?.weeklyStats.map(day => ({
    date: new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' }),
    calories: day.calories,
    duration: Math.round(day.duration / 60) // 转换为小时
  }));

  const monthlyData = stats?.monthlyStats.map(month => ({
    month: month.month,
    calories: month.totalCalories,
    duration: Math.round(month.totalDuration / 60)
  }));

  return (
    <ScrollView style={styles.container}>
      {/* 时间范围选择 */}
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === 'week' && styles.activeTimeRange]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'week' && styles.activeTimeRangeText]}>
            本周
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === 'month' && styles.activeTimeRange]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'month' && styles.activeTimeRangeText]}>
            本月
          </Text>
        </TouchableOpacity>
      </View>

      {/* 运动数据概览 */}
      <View style={styles.statsOverview}>
        <View style={styles.statCard}>
          <Icon name="activity" size={24} color="#2E7D32" />
          <Text style={styles.statValue}>
            {timeRange === 'week'
              ? stats?.weeklyStats.reduce((sum, day) => sum + day.calories, 0)
              : stats?.monthlyStats[0].totalCalories}
          </Text>
          <Text style={styles.statLabel}>消耗卡路里</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="clock" size={24} color="#2E7D32" />
          <Text style={styles.statValue}>
            {timeRange === 'week'
              ? Math.round(stats?.weeklyStats.reduce((sum, day) => sum + day.duration, 0) / 60)
              : Math.round(stats?.monthlyStats[0].totalDuration / 60)}
          </Text>
          <Text style={styles.statLabel}>运动时长(小时)</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color="#2E7D32" />
          <Text style={styles.statValue}>
            {timeRange === 'week'
              ? stats?.weeklyStats.filter(day => day.completedExercises > 0).length
              : stats?.monthlyStats[0].completedDays}
          </Text>
          <Text style={styles.statLabel}>完成天数</Text>
        </View>
      </View>

      {/* 趋势图表 */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>运动趋势</Text>
        <LineChart
          data={timeRange === 'week' ? weeklyData : monthlyData}
          height={200}
          xKey={timeRange === 'week' ? 'date' : 'month'}
          lines={[
            { key: 'calories', color: '#2E7D32', label: '卡路里' },
            { key: 'duration', color: '#1976D2', label: '时长' }
          ]}
        />
      </View>

      {/* 运动类型分布 */}
      <View style={styles.chartSection}>
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
      <View style={styles.achievementsSection}>
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
              {achievement.achieved && ` · ${new Date(achievement.achievedAt || '').toLocaleDateString()}`}
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
  timeRangeSelector: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff'
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center'
  },
  activeTimeRange: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32'
  },
  timeRangeText: {
    fontSize: 16,
    color: '#666'
  },
  activeTimeRangeText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  statsOverview: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10
  },
  statCard: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5
  },
  statLabel: {
    fontSize: 12,
    color: '#666'
  },
  chartSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  achievementsSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15
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