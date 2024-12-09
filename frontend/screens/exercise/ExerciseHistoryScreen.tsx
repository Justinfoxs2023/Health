import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getExerciseHistory } from '../../api/exercise';
import { LoadingSpinner, Icon, EmptyState } from '../../components';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ExerciseRecord {
  id: string;
  date: string;
  exercises: {
    id: string;
    name: string;
    type: string;
    duration: number;
    calories: number;
    sets?: number;
    reps?: number;
  }[];
  totalDuration: number;
  totalCalories: number;
  completed: boolean;
}

export const ExerciseHistoryScreen = ({ navigation }) => {
  const [timeRange, setTimeRange] = React.useState<'week' | 'month' | 'all'>('week');
  const { data: history, isLoading } = useQuery<ExerciseRecord[]>('exerciseHistory', getExerciseHistory);

  const filterRecords = (records: ExerciseRecord[] = []) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return records.filter(record => {
      const recordDate = new Date(record.date);
      switch (timeRange) {
        case 'week':
          return recordDate >= weekAgo;
        case 'month':
          return recordDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const renderExerciseRecord = ({ item }: { item: ExerciseRecord }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() => navigation.navigate('ExerciseDetail', { date: item.date })}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.date}>
          {format(new Date(item.date), 'M月d日 EEEE', { locale: zhCN })}
        </Text>
        {item.completed ? (
          <View style={styles.completedBadge}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.completedText}>已完成</Text>
          </View>
        ) : (
          <View style={styles.incompleteBadge}>
            <Icon name="x-circle" size={16} color="#F44336" />
            <Text style={styles.incompleteText}>未完成</Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Icon name="clock" size={20} color="#666" />
          <Text style={styles.statValue}>{Math.round(item.totalDuration)}分钟</Text>
          <Text style={styles.statLabel}>运动时长</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="activity" size={20} color="#666" />
          <Text style={styles.statValue}>{item.totalCalories}千卡</Text>
          <Text style={styles.statLabel}>消耗热量</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="list" size={20} color="#666" />
          <Text style={styles.statValue}>{item.exercises.length}个</Text>
          <Text style={styles.statLabel}>运动项目</Text>
        </View>
      </View>

      <View style={styles.exerciseList}>
        {item.exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetail}>
                {exercise.duration}分钟 · {exercise.calories}千卡
                {exercise.sets && ` · ${exercise.sets}组${exercise.reps}次`}
              </Text>
            </View>
            <Text style={styles.exerciseType}>{exercise.type}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  const filteredRecords = filterRecords(history);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>运动记录</Text>
        <View style={styles.timeRangeButtons}>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'week' && styles.activeTimeButton]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.timeButtonText, timeRange === 'week' && styles.activeTimeButtonText]}>
              本周
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'month' && styles.activeTimeButton]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.timeButtonText, timeRange === 'month' && styles.activeTimeButtonText]}>
              本月
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'all' && styles.activeTimeButton]}
            onPress={() => setTimeRange('all')}
          >
            <Text style={[styles.timeButtonText, timeRange === 'all' && styles.activeTimeButtonText]}>
              全部
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={renderExerciseRecord}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="calendar"
            title="暂无运动记录"
            description="开始您的运动计划，记录每一次进步"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 15,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  timeRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6
  },
  activeTimeButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  timeButtonText: {
    fontSize: 14,
    color: '#666'
  },
  activeTimeButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  list: {
    padding: 15
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
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
  incompleteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  incompleteText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 4
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#666'
  },
  exerciseList: {
    marginTop: 15
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  exerciseInfo: {
    flex: 1
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  exerciseDetail: {
    fontSize: 12,
    color: '#666'
  },
  exerciseType: {
    fontSize: 12,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10
  },
  separator: {
    height: 10
  }
}); 