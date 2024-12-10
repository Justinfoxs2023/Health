import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DietaryIntakeCard } from './DietaryIntakeCard';

interface NutritionData {
  calories: number;
  goal: number;
  nutrients: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const DietPlanner = () => {
  const theme = useTheme();

  // 模拟数据，实际应从API获取
  const nutritionData: NutritionData = {
    calories: 1800,
    goal: 2000,
    nutrients: [
      { name: '蛋白质', value: 25, color: '#FF6B6B' },
      { name: '碳水化合物', value: 55, color: '#4ECDC4' },
      { name: '脂肪', value: 20, color: '#45B7D1' }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>营养摄入</Text>
      <DietaryIntakeCard
        calories={nutritionData.calories}
        nutrients={nutritionData.nutrients}
        goal={nutritionData.goal}
      />
      <View style={styles.recommendations}>
        <Text style={styles.subtitle}>今日建议</Text>
        <Text style={styles.tip}>• 增加蛋白质摄入，建议食用瘦肉、鱼类或豆制品</Text>
        <Text style={styles.tip}>• 控制碳水化合物摄入，减少精制糖的使用</Text>
        <Text style={styles.tip}>• 补充富含维生素的蔬菜水果</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recommendations: {
    marginTop: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tip: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
}); 