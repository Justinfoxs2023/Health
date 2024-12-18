import React from 'react';

import { Card, Text, useTheme } from 'react-native-paper';
import { PlanProgress } from './plan/PlanProgress';
import { View, StyleSheet } from 'react-native';

interface IUserStatsProps {
  /** userId 的描述 */
  userId: string;
}

export const UserStats = ({ userId }: IUserStatsProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>目标进度</Text>
      <PlanProgress title="每日步数" progress={8500} target={10000} unit="步" />
      <PlanProgress title="运动时长" progress={45} target={60} unit="分钟" />
      <PlanProgress title="睡眠时长" progress={7} target={8} unit="小时" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
