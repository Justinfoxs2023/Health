import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getExerciseRecommendations } from '../../api/exercise';
import { LoadingSpinner, Icon } from '../../components';

interface ExercisePlan {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  category: string;
  imageUrl: string;
  tags: string[];
  exercises: {
    id: string;
    name: string;
    duration: number;
    sets?: number;
    reps?: number;
  }[];
}

export const ExerciseRecommendScreen = ({ navigation }) => {
  const { data: recommendations, isLoading } = useQuery<ExercisePlan[]>(
    'exerciseRecommendations',
    getExerciseRecommendations
  );

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

  const renderPlanCard = (plan: ExercisePlan) => (
    <TouchableOpacity
      key={plan.id}
      style={styles.planCard}
      onPress={() => navigation.navigate('ExercisePlanDetail', { id: plan.id })}
    >
      <Image source={{ uri: plan.imageUrl }} style={styles.planImage} />
      <View style={styles.planContent}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{getLevelText(plan.level)}</Text>
          </View>
        </View>
        
        <Text style={styles.planDescription} numberOfLines={2}>
          {plan.description}
        </Text>

        <View style={styles.planStats}>
          <View style={styles.statItem}>
            <Icon name="clock" size={16} color="#666" />
            <Text style={styles.statText}>{plan.duration}分钟</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="activity" size={16} color="#666" />
            <Text style={styles.statText}>{plan.calories}千卡</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="list" size={16} color="#666" />
            <Text style={styles.statText}>{plan.exercises.length}个动作</Text>
          </View>
        </View>

        <View style={styles.tagContainer}>
          {plan.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>推荐计划</Text>
        <Text style={styles.headerDesc}>
          根据您的运动水平和目标，为您精选以下运动计划
        </Text>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>全部</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>减脂</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>增肌</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>塑形</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>康复</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.planList}>
        {recommendations?.map(renderPlanCard)}
      </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  headerDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0'
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f5f5f5'
  },
  activeFilter: {
    backgroundColor: '#E8F5E9'
  },
  filterText: {
    fontSize: 14,
    color: '#666'
  },
  activeFilterText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  planList: {
    padding: 15
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden'
  },
  planImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0'
  },
  planContent: {
    padding: 15
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9'
  },
  levelText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },
  planStats: {
    flexDirection: 'row',
    marginBottom: 12
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    fontSize: 12,
    color: '#666'
  }
}); 