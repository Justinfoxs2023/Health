import React from 'react';

import { Card, Text, ProgressBar, useTheme, Avatar } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';

interface IAchievement {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** icon 的描述 */
  icon: string;
  /** progress 的描述 */
  progress: number;
  /** target 的描述 */
  target: number;
  /** completed 的描述 */
  completed: boolean;
  /** reward 的描述 */
  reward: {
    type: 'points' | 'badge' | 'level';
    value: number | string;
  };
}

interface IAchievementSystemProps {
  /** achievements 的描述 */
  achievements: IAchievement[];
  /** userLevel 的描述 */
  userLevel: number;
  /** totalPoints 的描述 */
  totalPoints: number;
  /** onClaimReward 的描述 */
  onClaimReward: (achievementId: string) => void;
}

export const AchievementSystem = ({
  achievements,
  userLevel,
  totalPoints,
  onClaimReward,
}: IAchievementSystemProps) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>等级</Text>
              <Text style={styles.statValue}>{userLevel}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>积分</Text>
              <Text style={styles.statValue}>{totalPoints}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {achievements.map(achievement => (
        <Card
          key={achievement.id}
          style={[styles.achievementCard, achievement.completed && styles.completedCard]}
        >
          <Card.Content>
            <View style={styles.achievementHeader}>
              <Avatar.Icon
                size={40}
                icon={achievement.icon}
                style={{
                  backgroundColor: achievement.completed
                    ? theme.colors.primary
                    : theme.colors.disabled,
                }}
              />
              <View style={styles.achievementTitles}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <ProgressBar
                progress={achievement.progress / achievement.target}
                color={achievement.completed ? theme.colors.primary : theme.colors.accent}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {achievement.progress} / {achievement.target}
              </Text>
            </View>

            {achievement.completed && (
              <View style={styles.rewardSection}>
                <Text style={styles.rewardText}>
                  奖励:{' '}
                  {achievement.reward.type === 'points'
                    ? `${achievement.reward.value} 积分`
                    : achievement.reward.type === 'badge'
                    ? `${achievement.reward.value} 徽章`
                    : `提升至 ${achievement.reward.value} 级`}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => onClaimReward(achievement.id)}
                  style={styles.claimButton}
                >
                  领取奖励
                </Button>
              </View>
            )}
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
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  achievementCard: {
    marginBottom: 12,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitles: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  rewardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  claimButton: {
    marginLeft: 8,
  },
});
