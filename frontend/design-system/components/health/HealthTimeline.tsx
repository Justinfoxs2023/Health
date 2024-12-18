import React from 'react';

import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface ITimelineItem {
  /** id 的描述 */
  id: string;
  /** time 的描述 */
  time: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: 'exercise' | 'meal' | 'medication' | 'vitals';
  /** status 的描述 */
  status?: 'completed' | 'pending' | 'missed';
}

interface IHealthTimelineProps {
  /** items 的描述 */
  items: ITimelineItem[];
}

export const HealthTimeline: React.FC<IHealthTimelineProps> = ({ items }) => {
  const getIconByType = (type: ITimelineItem['type']) => {
    switch (type) {
      case 'exercise':
        return 'fitness';
      case 'meal':
        return 'restaurant';
      case 'medication':
        return 'pill';
      case 'vitals':
        return 'heartbeat';
      default:
        return 'circle';
    }
  };

  const getStatusColor = (status: ITimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return DesignTokens.colors.functional.success;
      case 'missed':
        return DesignTokens.colors.functional.error;
      default:
        return DesignTokens.colors.functional.warning;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.timeColumn}>
            <Text style={styles.time}>{item.time}</Text>
            {index !== items.length - 1 && <View style={styles.timeLine} />}
          </View>

          <View style={styles.contentContainer}>
            <View style={[styles.iconContainer, { backgroundColor: getStatusColor(item.status) }]}>
              <CustomIcon
                name={getIconByType(item.type)}
                size={20}
                color={DesignTokens.colors.neutral.white}
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: DesignTokens.spacing.lg,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
  },
  time: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
  },
  timeLine: {
    width: 2,
    flex: 1,
    backgroundColor: DesignTokens.colors.background.secondary,
    marginVertical: DesignTokens.spacing.sm,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DesignTokens.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: DesignTokens.typography.sizes.md,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.xs,
  },
  description: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
  },
});
