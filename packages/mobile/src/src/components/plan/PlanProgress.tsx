import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';

interface PlanProgressProps {
  title: string;
  progress: number;
  target: number;
  unit: string;
}

export const PlanProgress = ({ title, progress, target, unit }: PlanProgressProps) => {
  const theme = useTheme();
  const percentage = Math.min(progress / target, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {progress} / {target} {unit}
        </Text>
      </View>
      <ProgressBar
        progress={percentage}
        color={theme.colors.primary}
        style={styles.progressBar}
      />
      <Text style={styles.percentage}>{Math.round(percentage * 100)}% 完成</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
}); 