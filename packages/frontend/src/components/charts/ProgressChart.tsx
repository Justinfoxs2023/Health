import React from 'react';

import { ProgressCircle } from 'react-native-svg-charts';
import { Text } from '../common';
import { View, StyleSheet } from 'react-native';

interface IProps {
  /** progress 的描述 */
  progress: number; // 0-1
  /** size 的描述 */
  size?: number;
  /** strokeWidth 的描述 */
  strokeWidth?: number;
  /** color 的描述 */
  color?: string;
  /** backgroundColor 的描述 */
  backgroundColor?: string;
  /** title 的描述 */
  title?: string;
  /** showPercentage 的描述 */
  showPercentage?: boolean;
}

export const ProgressChart: React.FC<IProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = '#2E7D32',
  backgroundColor = '#E8F5E9',
  title,
  showPercentage = true,
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
          <Text style={[styles.percentage, { color }]}>{Math.round(progress * 100)}%</Text>
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
  },
});
