import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';

interface ExerciseData {
  type: string;
  duration: number;
  calories: number;
  distance?: number;
  heartRate?: {
    avg: number;
    max: number;
    min: number;
  };
  steps?: number;
  pace?: number;
}

interface ExerciseRecordProps {
  data: ExerciseData;
  date: Date;
  onEdit?: () => void;
  onShare?: () => void;
}

export const ExerciseRecord: React.FC<ExerciseRecordProps> = ({
  data,
  date,
  onEdit,
  onShare
}) => {
  const getExerciseIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'running':
        return 'directions-run';
      case 'cycling':
        return 'directions-bike';
      case 'swimming':
        return 'pool';
      case 'gym':
        return 'fitness-center';
      default:
        return 'sports';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}小时 ` : ''}${mins}分钟`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <CustomIcon 
            name={getExerciseIcon(data.type)} 
            size={24} 
            color={DesignTokens.colors.brand.primary} 
          />
          <Text style={styles.type}>{data.type}</Text>
        </View>
        <Text style={styles.date}>
          {date.toLocaleDateString('zh-CN', { 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <CustomIcon name="timer" size={20} color={DesignTokens.colors.text.secondary} />
          <Text style={styles.metricValue}>{formatDuration(data.duration)}</Text>
          <Text style={styles.metricLabel}>时长</Text>
        </View>

        <View style={styles.metricItem}>
          <CustomIcon name="local-fire-department" size={20} color={DesignTokens.colors.text.secondary} />
          <Text style={styles.metricValue}>{data.calories}</Text>
          <Text style={styles.metricLabel}>卡路里</Text>
        </View>

        {data.distance && (
          <View style={styles.metricItem}>
            <CustomIcon name="straighten" size={20} color={DesignTokens.colors.text.secondary} />
            <Text style={styles.metricValue}>{data.distance.toFixed(2)}km</Text>
            <Text style={styles.metricLabel}>距离</Text>
          </View>
        )}
      </View>

      {data.heartRate && (
        <View style={styles.heartRateContainer}>
          <Text style={styles.sectionTitle}>心率数据</Text>
          <View style={styles.heartRateMetrics}>
            <View style={styles.heartRateItem}>
              <Text style={styles.heartRateValue}>{data.heartRate.avg}</Text>
              <Text style={styles.heartRateLabel}>平均</Text>
            </View>
            <View style={styles.heartRateItem}>
              <Text style={styles.heartRateValue}>{data.heartRate.max}</Text>
              <Text style={styles.heartRateLabel}>最高</Text>
            </View>
            <View style={styles.heartRateItem}>
              <Text style={styles.heartRateValue}>{data.heartRate.min}</Text>
              <Text style={styles.heartRateLabel}>最低</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <CustomIcon name="edit" size={20} color={DesignTokens.colors.brand.primary} />
          <Text style={styles.actionText}>编辑</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <CustomIcon name="share" size={20} color={DesignTokens.colors.brand.primary} />
          <Text style={styles.actionText}>分享</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.background.paper,
    borderRadius: DesignTokens.radius.lg,
    padding: DesignTokens.spacing.lg,
    ...DesignTokens.shadows.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  type: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary
  },
  date: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: DesignTokens.spacing.xl
  },
  metricItem: {
    alignItems: 'center'
  },
  metricValue: {
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.text.primary,
    marginVertical: DesignTokens.spacing.xs
  },
  metricLabel: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  heartRateContainer: {
    marginBottom: DesignTokens.spacing.xl
  },
  sectionTitle: {
    fontSize: DesignTokens.typography.sizes.md,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.md
  },
  heartRateMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  heartRateItem: {
    alignItems: 'center'
  },
  heartRateValue: {
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.brand.primary
  },
  heartRateLabel: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
    marginTop: DesignTokens.spacing.xs
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.border,
    paddingTop: DesignTokens.spacing.md
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: DesignTokens.spacing.md
  },
  actionText: {
    marginLeft: DesignTokens.spacing.xs,
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.brand.primary
  }
}); 