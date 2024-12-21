import React from 'react';

import { Card, Text, useTheme, Button } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';

interface INutrientGoal {
  /** name 的描述 */
  name: string;
  /** current 的描述 */
  current: number;
  /** target 的描述 */
  target: number;
  /** unit 的描述 */
  unit: string;
}

interface IMealSuggestion {
  /** type 的描述 */
  type: '早餐' | '午餐' | '晚餐' | '加餐';
  /** foods 的描述 */
  foods: Array<{
    name: string;
    portion: string;
    nutrients: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }>;
  /** totalCalories 的描述 */
  totalCalories: number;
}

interface IDietRecommendationProps {
  /** goals 的描述 */
  goals: INutrientGoal[];
  /** suggestions 的描述 */
  suggestions: IMealSuggestion[];
  /** onSaveMealPlan 的描述 */
  onSaveMealPlan: () => void;
}

export const DietRecommendation = ({
  goals,
  suggestions,
  onSaveMealPlan,
}: IDietRecommendationProps) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>营养目标</Text>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <Text style={styles.goalName}>{goal.name}</Text>
              <View style={styles.goalProgress}>
                <Text style={styles.goalValue}>
                  {goal.current}/{goal.target} {goal.unit}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {suggestions.map((meal, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text style={styles.mealTitle}>{meal.type}</Text>
            <Text style={styles.calories}>{meal.totalCalories} 千卡</Text>

            {meal.foods.map((food, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <View style={styles.foodHeader}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.portion}>{food.portion}</Text>
                </View>

                <View style={styles.nutrients}>
                  <Text style={styles.nutrientItem}>蛋白质: {food.nutrients.protein}g</Text>
                  <Text style={styles.nutrientItem}>碳水: {food.nutrients.carbs}g</Text>
                  <Text style={styles.nutrientItem}>脂肪: {food.nutrients.fat}g</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      ))}

      <Button mode="contained" onPress={onSaveMealPlan} style={styles.saveButton}>
        保存膳食计划
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalItem: {
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    marginBottom: 4,
  },
  goalProgress: {
    marginTop: 4,
  },
  goalValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  calories: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  foodItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
  },
  portion: {
    fontSize: 14,
    color: '#666',
  },
  nutrients: {
    flexDirection: 'row',
    marginTop: 4,
  },
  nutrientItem: {
    marginRight: 16,
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    marginVertical: 24,
  },
});
