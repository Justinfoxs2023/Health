import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChallenges, joinChallenge, quitChallenge } from '../../api/exercise';
import { LoadingSpinner, Icon, ProgressBar, AlertDialog } from '../../components';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const ChallengeScreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = React.useState<'upcoming' | 'ongoing' | 'completed'>('ongoing');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const queryClient = useQueryClient();

  const { data: challenges, isLoading } = useQuery<Challenge[]>('challenges', getChallenges);

  const joinMutation = useMutation(joinChallenge, {
    onSuccess: () => {
      queryClient.invalidateQueries('challenges');
      setAlertMessage('成功加入挑战!');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '加入失败，请重试');
      setShowAlert(true);
    }
  });

  const quitMutation = useMutation(quitChallenge, {
    onSuccess: () => {
      queryClient.invalidateQueries('challenges');
      setAlertMessage('已退出挑战');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '退出失败，请重试');
      setShowAlert(true);
    }
  });

  const handleJoin = (challengeId: string) => {
    joinMutation.mutate(challengeId);
  };

  const handleQuit = (challengeId: string) => {
    quitMutation.mutate(challengeId);
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'steps':
        return '步数';
      case 'distance':
        return '距离';
      case 'calories':
        return '消耗热量';
      case 'duration':
        return '运动时长';
      default:
        return type;
    }
  };

  const renderChallenge = ({ item: challenge }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => navigation.navigate('ChallengeDetail', { id: challenge.id })}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.participants}>
          <Icon name="users" size={16} color="#666" />
          <Text style={styles.participantCount}>{challenge.participants.count}人参与</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={styles.targetInfo}>
        <Text style={styles.targetLabel}>目标: {getTypeText(challenge.type)}</Text>
        <Text style={styles.targetValue}>{challenge.target}</Text>
      </View>

      <View style={styles.timeInfo}>
        <Icon name="calendar" size={16} color="#666" />
        <Text style={styles.timeText}>
          {format(new Date(challenge.startDate), 'MM.dd', { locale: zhCN })} - 
          {format(new Date(challenge.endDate), 'MM.dd', { locale: zhCN })}
        </Text>
      </View>

      <View style={styles.rewards}>
        {challenge.rewards.map((reward, index) => (
          <View key={index} style={styles.rewardItem}>
            <Image source={{ uri: reward.icon }} style={styles.rewardIcon} />
            <Text style={styles.rewardValue}>{reward.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          challenge.isJoined ? styles.quitButton : styles.joinButton
        ]}
        onPress={() => challenge.isJoined ? handleQuit(challenge.id) : handleJoin(challenge.id)}
      >
        <Text style={[
          styles.actionButtonText,
          challenge.isJoined ? styles.quitButtonText : styles.joinButtonText
        ]}>
          {challenge.isJoined ? '退出挑战' : '参与挑战'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  const filteredChallenges = challenges?.filter(
    challenge => challenge.status === selectedStatus
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedStatus('upcoming')}
        >
          <Text style={[styles.tabText, selectedStatus === 'upcoming' && styles.activeTabText]}>
            即将开始
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'ongoing' && styles.activeTab]}
          onPress={() => setSelectedStatus('ongoing')}
        >
          <Text style={[styles.tabText, selectedStatus === 'ongoing' && styles.activeTabText]}>
            进行中
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

      <AlertDialog
        visible={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
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
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  participantCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  targetLabel: {
    fontSize: 14,
    color: '#666'
  },
  targetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6
  },
  rewards: {
    flexDirection: 'row',
    marginBottom: 15
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8
  },
  rewardIcon: {
    width: 16,
    height: 16,
    marginRight: 4
  },
  rewardValue: {
    fontSize: 12,
    color: '#F57C00'
  },
  actionButton: {
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center'
  },
  joinButton: {
    backgroundColor: '#2E7D32'
  },
  quitButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E7D32'
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  joinButtonText: {
    color: '#fff'
  },
  quitButtonText: {
    color: '#2E7D32'
  },
  separator: {
    height: 15
  }
}); 