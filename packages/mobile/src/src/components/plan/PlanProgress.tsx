import React from 'react';

import { ProgressBar, Text, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface IPlanProgressProps {
  /** title 的描述 */
  title: string;
  /** progress 的描述 */
  progress: number;
  /** target 的描述 */
  target: number;
  /** unit 的描述 */
  unit: string;
}

export const PlanProgress = ({ title, progress, target, unit }: IPlanProgressProps) => {
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
      <ProgressBar progress={percentage} color={theme.colors.primary} style={styles.progressBar} />
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
