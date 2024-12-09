import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { Text } from '../common';

interface Props {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  title?: string;
  showPercentage?: boolean;
}

export const ProgressChart: React.FC<Props> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = '#2E7D32',
  backgroundColor = '#E8F5E9',
  title,
  showPercentage = true
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <ProgressCircle
          style={{ height: size }}
          progress={progress}
          progressColor={color}
          backgroundColor={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {showPercentage && (
          <Text style={[styles.percentage, { color }]}>
            {Math.round(progress * 100)}%
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: '600',
  }
}); 