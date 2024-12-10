import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Chip, useTheme } from 'react-native-paper';

interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
  equipment: string[];
  defaultSets: number;
  defaultReps: number;
  duration?: number; // 单位：分钟
}

interface WorkoutPlanGeneratorProps {
  userPreferences: {
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goals: string[];
    timeAvailable: number; // 单位：分钟
    equipment: string[];
  };
  onGeneratePlan: (plan: WorkoutPlan) => void;
}

interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  difficulty: string;
  targetAreas: string[];
}

export const WorkoutPlanGenerator = ({ userPreferences, onGeneratePlan }: WorkoutPlanGeneratorProps) => {
  const theme = useTheme();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(userPreferences.goals);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(userPreferences.equipment);

  const availableGoals = [
    '增肌', '减脂', '提高耐力', '改善柔韧性', '增强力量',
    '改善姿势', '康复训练', '提高运动表现'
  ];

  const availableEquipment = [
    '哑铃', '弹力带', '瑜伽垫', '跳绳', '健身球',
    '拉力器', '壶铃', '无器械'
  ];

  const handleGeneratePlan = () => {
    // 这里实现根据用户偏好生成训练计划的逻辑
    const plan: WorkoutPlan = {
      id: Date.now().toString(),
      name: '个性化训练计划',
      exercises: [], // 根据用户偏好选择合适的运动
      duration: userPreferences.timeAvailable,
      difficulty: userPreferences.fitnessLevel,
      targetAreas: selectedGoals
    };
    onGeneratePlan(plan);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>训练目标</Text>
          <View style={styles.chipContainer}>
            {availableGoals.map(goal => (
              <Chip
                key={goal}
                selected={selectedGoals.includes(goal)}
                onPress={() => {
                  if (selectedGoals.includes(goal)) {
                    setSelectedGoals(selectedGoals.filter(g => g !== goal));
                  } else {
                    setSelectedGoals([...selectedGoals, goal]);
                  }
                }}
                style={styles.chip}
              >
                {goal}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>可用器械</Text>
          <View style={styles.chipContainer}>
            {availableEquipment.map(equipment => (
              <Chip
                key={equipment}
                selected={selectedEquipment.includes(equipment)}
                onPress={() => {
                  if (selectedEquipment.includes(equipment)) {
                    setSelectedEquipment(selectedEquipment.filter(e => e !== equipment));
                  } else {
                    setSelectedEquipment([...selectedEquipment, equipment]);
                  }
                }}
                style={styles.chip}
              >
                {equipment}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleGeneratePlan}
        style={styles.generateButton}
      >
        生成训练计划
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    margin: 4,
  },
  generateButton: {
    marginTop: 8,
  },
}); 