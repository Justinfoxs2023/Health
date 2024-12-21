import React from 'react';

import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface IHealthGoal {
  /** type 的描述 */
  type: 'steps' | 'calories' | 'sleep' | 'water' | 'exercise';
  /** target 的描述 */
  target: number;
  /** unit 的描述 */
  unit: string;
  /** frequency 的描述 */
  frequency: 'daily' | 'weekly' | 'monthly';
}

interface IHealthGoalSetterProps {
  /** goal 的描述 */
  goal: IHealthGoal;
  /** onGoalChange 的描述 */
  onGoalChange: (goal: IHealthGoal) => void;
}

export const HealthGoalSetter: React.FC<IHealthGoalSetterProps> = ({ goal, onGoalChange }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempValue, setTempValue] = React.useState(goal.target.toString());

  const getGoalIcon = () => {
    switch (goal.type) {
      case 'steps':
        return 'directions-walk';
      case 'calories':
        return 'local-fire-department';
      case 'sleep':
        return 'bedtime';
      case 'water':
        return 'local-drink';
      case 'exercise':
        return 'fitness-center';
    }
  };

  const handleSave = () => {
    const newTarget = parseInt(tempValue);
    if (!isNaN(newTarget)) {
      onGoalChange({
        ...goal,
        target: newTarget,
      });
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomIcon name={getGoalIcon()} size={24} color={DesignTokens.colors.brand.primary} />
        <Text style={styles.title}>
          {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} 目标
        </Text>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={tempValue}
              onChangeText={setTempValue}
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.unit}>{goal.unit}</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.valueContainer} onPress={() => setIsEditing(true)}>
            <Text style={styles.value}>{goal.target}</Text>
            <Text style={styles.unit}>{goal.unit}</Text>
            <CustomIcon name="edit" size={20} color={DesignTokens.colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.frequencyContainer}>
        <Text style={styles.frequencyLabel}>频率</Text>
        <View style={styles.frequencyButtons}>
          {['daily', 'weekly', 'monthly'].map(freq => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyButton,
                goal.frequency === freq && styles.activeFrequencyButton,
              ]}
              onPress={() => onGoalChange({ ...goal, frequency: freq as IHealthGoal['frequency'] })}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  goal.frequency === freq && styles.activeFrequencyButtonText,
                ]}
              >
                {freq === 'daily' ? '每日' : freq === 'weekly' ? '每周' : '每月'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  title: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
  },
  content: {
    marginBottom: DesignTokens.spacing.lg,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: DesignTokens.typography.sizes.xl,
    color: DesignTokens.colors.text.primary,
    padding: DesignTokens.spacing.sm,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
    borderRadius: DesignTokens.radius.md,
  },
  value: {
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.text.primary,
  },
  unit: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.secondary,
  },
  saveButton: {
    marginLeft: DesignTokens.spacing.md,
    backgroundColor: DesignTokens.colors.brand.primary,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.md,
  },
  saveButtonText: {
    color: DesignTokens.colors.neutral.white,
    fontWeight: String(DesignTokens.typography.weights.medium),
  },
  frequencyContainer: {
    marginTop: DesignTokens.spacing.md,
  },
  frequencyLabel: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary,
    marginBottom: DesignTokens.spacing.sm,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.border,
    alignItems: 'center',
  },
  activeFrequencyButton: {
    backgroundColor: DesignTokens.colors.brand.primary,
    borderColor: DesignTokens.colors.brand.primary,
  },
  frequencyButtonText: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.primary,
  },
  activeFrequencyButtonText: {
    color: DesignTokens.colors.neutral.white,
  },
});
