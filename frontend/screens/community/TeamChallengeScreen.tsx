import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getChallenges } from '../../api/community';
import { LoadingSpinner, Icon, ProgressBar } from '../../components';

interface Challenge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  participants: {
    count: number;
    target: number;
  };
  progress: {
    current: number;
    target: number;
  };
  rewards: {
    type: string;
    value: string;
    icon: string;
  }[];
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const TeamChallengeScreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = React.useState<'upcoming' | 'ongoing' | 'completed'>('ongoing');
  const { data: challenges, isLoading } = useQuery<Challenge[]>('challenges', getChallenges);

  const filteredChallenges = challenges?.filter(
    challenge => challenge.status === selectedStatus
  );

  const renderChallenge = ({ item: challenge }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => navigation.navigate('ChallengeDetail', { id: challenge.id })}
    >
      <Image source={{ uri: challenge.imageUrl }} style={styles.challengeImage} />
      <View style={styles.challengeContent}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDesc} numberOfLines={2}>
          {challenge.description}
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>参与进度</Text>
            <Text style={styles.progressText}>
              {challenge.participants.count}/{challenge.participants.target}人参与
            </Text>
          </View>
          <ProgressBar
            progress={challenge.progress.current / challenge.progress.target}
            color="#2E7D32"
            style={styles.progressBar}
          />
          <Text style={styles.progressDetail}>
            已完成{Math.round(challenge.progress.current / challenge.progress.target * 100)}%
          </Text>
        </View>

        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>挑战奖励</Text>
          <View style={styles.rewardsList}>
            {challenge.rewards.map((reward, index) => (
              <View key={index} style={styles.rewardItem}>
                <Icon name={reward.icon} size={16} color="#F57C00" />
                <Text style={styles.rewardText}>{reward.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {challenge.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => navigation.navigate('JoinChallenge', { id: challenge.id })}
          >
            <Text style={styles.joinButtonText}>立即参与</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>团队挑战</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateChallenge')}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.createButtonText}>发起挑战</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'ongoing' && styles.activeTab]}
          onPress={() => setSelectedStatus('ongoing')}
        >
          <Text style={[styles.tabText, selectedStatus === 'ongoing' && styles.activeTabText]}>
            进行中
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedStatus('upcoming')}
        >
          <Text style={[styles.tabText, selectedStatus === 'upcoming' && styles.activeTabText]}>
            即将开始
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'completed' && styles.activeTab]}
          onPress={() => setSelectedStatus('completed')}
        >
          <Text style={[styles.tabText, selectedStatus === 'completed' && styles.activeTabText]}>
            已结束
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredChallenges}
        renderItem={renderChallenge}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0'
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
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden'
  },
  challengeImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0'
  },
  challengeContent: {
    padding: 15
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  challengeDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15
  },
  progressSection: {
    marginBottom: 15
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  progressText: {
    fontSize: 12,
    color: '#666'
  },
  progressBar: {
    marginBottom: 4
  },
  progressDetail: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right'
  },
  rewardsSection: {
    marginBottom: 15
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  rewardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8
  },
  rewardText: {
    fontSize: 12,
    color: '#F57C00',
    marginLeft: 4
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    fontSize: 12,
    color: '#666'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0'
  },
  dateText: {
    fontSize: 12,
    color: '#999'
  },
  joinButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  separator: {
    height: 15
  }
}); 