import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getAchievements } from '../../api/exercise';
import { LoadingSpinner, Icon, ProgressBar } from '../../components';

export const AchievementScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'exercise' | 'challenge' | 'social'>('all');
  const { data: achievements, isLoading } = useQuery<Achievement[]>('achievements', getAchievements);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      default:
        return '#666';
    }
  };

  const renderAchievement = ({ item: achievement }: { item: Achievement }) => (
    <View style={styles.achievementCard}>
      <View style={styles.header}>
        <Image source={{ uri: achievement.icon }} style={styles.icon} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{achievement.title}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(achievement.level) }]}>
            <Text style={styles.levelText}>{achievement.level}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{achievement.description}</Text>

      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={achievement.progress / achievement.target}
          color={getLevelColor(achievement.level)}
        />
        <Text style={styles.progressText}>
          {achievement.progress}/{achievement.target}
        </Text>
      </View>

      {achievement.achieved && (
        <View style={styles.rewardsContainer}>
          {achievement.rewards.map((reward, index) => (
            <View key={index} style={styles.rewardItem}>
              <Image source={{ uri: reward.icon }} style={styles.rewardIcon} />
              <Text style={styles.rewardValue}>{reward.value}</Text>
            </View>
          ))}
          <Text style={styles.achievedDate}>
            获得于 {new Date(achievement.achievedAt!).toLocaleDateString('zh-CN')}
          </Text>
        </View>
      )}
    </View>
  );

  if (isLoading) return <LoadingSpinner />;

  const filteredAchievements = achievements?.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedCategory === 'all' && styles.activeTab]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.tabText, selectedCategory === 'all' && styles.activeTabText]}>
            全部
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedCategory === 'exercise' && styles.activeTab]}
          onPress={() => setSelectedCategory('exercise')}
        >
          <Text style={[styles.tabText, selectedCategory === 'exercise' && styles.activeTabText]}>
            运动
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedCategory === 'challenge' && styles.activeTab]}
          onPress={() => setSelectedCategory('challenge')}
        >
          <Text style={[styles.tabText, selectedCategory === 'challenge' && styles.activeTabText]}>
            挑战
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedCategory === 'social' && styles.activeTab]}
          onPress={() => setSelectedCategory('social')}
        >
          <Text style={[styles.tabText, selectedCategory === 'social' && styles.activeTabText]}>
            社交
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAchievements}
        renderItem={renderAchievement}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32'
  },
  tabText: {
    fontSize: 14,
    color: '#666'
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  list: {
    padding: 15
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  titleContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  levelText: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'capitalize'
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  progressContainer: {
    marginBottom: 12
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4
  },
  rewardsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingTop: 12
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  rewardIcon: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  rewardValue: {
    fontSize: 14,
    color: '#F57C00'
  },
  achievedDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right'
  },
  separator: {
    height: 15
  }
}); 