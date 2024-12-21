import React from 'react';

import { AnimationSystem } from '../../interaction/animations/AnimationSystem';
import { DesignTokens } from '../../tokens';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface IHealthProgressProps {
  /** title 的描述 */
  title: string;
  /** current 的描述 */
  current: number;
  /** target 的描述 */
  target: number;
  /** unit 的描述 */
  unit: string;
  /** type 的描述 */
  type?: 'steps' | 'calories' | 'water' | 'sleep';
}

export const HealthProgress: React.FC<IHealthProgressProps> = ({
  title,
  current,
  target,
  unit,
  type = 'steps',
}) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const percentage = Math.min((current / target) * 100, 100);

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const getProgressColor = () => {
    if (percentage >= 100) return DesignTokens.colors.functional.success;
    if (percentage >= 60) return DesignTokens.colors.brand.primary;
    return DesignTokens.colors.functional.warning;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.current}>
          {current} <Text style={styles.unit}>{unit}</Text>
        </Text>
        <Text style={styles.target}>
          目标: {target} {unit}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.background.paper,
    borderRadius: DesignTokens.radius.lg,
    padding: DesignTokens.spacing.lg,
    ...DesignTokens.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  title: {
    fontSize: DesignTokens.typography.sizes.md,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
  },
  percentage: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
  },
  progressContainer: {
    height: 8,
    backgroundColor: DesignTokens.colors.background.secondary,
    borderRadius: DesignTokens.radius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: DesignTokens.radius.full,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: DesignTokens.spacing.md,
  },
  current: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.text.primary,
  },
  unit: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
  },
  target: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
  },
});
