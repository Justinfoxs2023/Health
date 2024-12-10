import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Chip, useTheme, ProgressBar } from 'react-native-paper';

interface UserDietProfile {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietaryRestrictions: string[];
  allergies: string[];
  preferences: {
    cuisineTypes: string[];
    mealTimes: string[];
    portions: 'small' | 'medium' | 'large';
  };
  goals: {
    type: 'weight_loss' | 'weight_gain' | 'maintenance' | 'muscle_gain';
    target: number;
    weeklyRate?: number;
  };
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  preparation: string;
  alternatives: Array<{
    name: string;
    reason: string;
  }>;
}

interface DietPlan {
  id: string;
  dailyCalories: number;
  macroDistribution: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Meal[];
  snacks: Meal[];
  hydrationGoal: number;
  supplementRecommendations?: Array<{
    name: string;
    dosage: string;
    reason: string;
  }>;
}

interface DietPlanGeneratorProps {
  userProfile: UserDietProfile;
  onGeneratePlan: (plan: DietPlan) => void;
}

export const DietPlanGenerator = ({ userProfile, onGeneratePlan }: DietPlanGeneratorProps) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<DietPlan | null>(null);

  const generatePlan = async () => {
    setLoading(true);
    try {
      // 调用AI饮食计划生成API
      const response = await fetch('YOUR_API_ENDPOINT/diet-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      const plan = await response.json();
      setCurrentPlan(plan);
      onGeneratePlan(plan);
    } catch (error) {
      console.error('生成饮食计划失败:', error);
      alert('生成计划失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>目标设定</Text>
          <View style={styles.goalInfo}>
            <Text style={styles.goalType}>
              {userProfile.goals.type === 'weight_loss' ? '减重' :
               userProfile.goals.type === 'weight_gain' ? '增重' :
               userProfile.goals.type === 'muscle_gain' ? '增肌' : '体重维持'}
            </Text>
            <Text style={styles.goalTarget}>
              目标: {userProfile.goals.target}kg
              {userProfile.goals.weeklyRate && ` (每周${userProfile.goals.weeklyRate}kg)`}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>饮食限制</Text>
          <View style={styles.chipContainer}>
            {userProfile.dietaryRestrictions.map(restriction => (
              <Chip key={restriction} style={styles.chip}>
                {restriction}
              </Chip>
            ))}
          </View>

          <Text style={styles.sectionTitle}>过敏源</Text>
          <View style={styles.chipContainer}>
            {userProfile.allergies.map(allergy => (
              <Chip key={allergy} style={[styles.chip, styles.allergyChip]}>
                {allergy}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={generatePlan}
        loading={loading}
        style={styles.generateButton}
      >
        生成个性化饮食计划
      </Button>

      {currentPlan && (
        <>
          <Card style={styles.planCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>每日营养目标</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {currentPlan.dailyCalories}
                  </Text>
                  <Text style={styles.nutritionLabel}>卡路里</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {currentPlan.macroDistribution.protein}g
                  </Text>
                  <Text style={styles.nutritionLabel}>蛋白质</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {currentPlan.macroDistribution.carbs}g
                  </Text>
                  <Text style={styles.nutritionLabel}>碳水</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {currentPlan.macroDistribution.fat}g
                  </Text>
                  <Text style={styles.nutritionLabel}>脂肪</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {currentPlan.meals.map(meal => (
            <Card key={meal.id} style={styles.mealCard}>
              <Card.Content>
                <Text style={styles.mealTitle}>{meal.name}</Text>
                <Text style={styles.mealType}>
                  {meal.type === 'breakfast' ? '早餐' :
                   meal.type === 'lunch' ? '午餐' :
                   meal.type === 'dinner' ? '晚餐' : '加餐'}
                </Text>

                <View style={styles.mealNutrition}>
                  <Text style={styles.nutritionInfo}>
                    {meal.nutrition.calories} 卡路里
                  </Text>
                  <Text style={styles.nutritionInfo}>
                    蛋白质 {meal.nutrition.protein}g
                  </Text>
                  <Text style={styles.nutritionInfo}>
                    碳水 {meal.nutrition.carbs}g
                  </Text>
                  <Text style={styles.nutritionInfo}>
                    脂肪 {meal.nutrition.fat}g
                  </Text>
                </View>

                <Text style={styles.ingredientsTitle}>食材</Text>
                {meal.ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredient}>
                    • {ingredient.name} {ingredient.amount}{ingredient.unit}
                  </Text>
                ))}

                <Text style={styles.preparationTitle}>准备方法</Text>
                <Text style={styles.preparation}>{meal.preparation}</Text>

                {meal.alternatives.length > 0 && (
                  <>
                    <Text style={styles.alternativesTitle}>替代选择</Text>
                    {meal.alternatives.map((alt, index) => (
                      <View key={index} style={styles.alternative}>
                        <Text style={styles.alternativeName}>{alt.name}</Text>
                        <Text style={styles.alternativeReason}>{alt.reason}</Text>
                      </View>
                    ))}
                  </>
                )}
              </Card.Content>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  goalInfo: {
    marginBottom: 16,
  },
  goalType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  goalTarget: {
    fontSize: 14,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
  },
  allergyChip: {
    backgroundColor: '#ffebee',
  },
  generateButton: {
    marginBottom: 16,
  },
  planCard: {
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  nutritionItem: {
    width: '25%',
    padding: 8,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mealCard: {
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  mealNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  nutritionInfo: {
    marginRight: 16,
    color: '#666',
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 14,
    marginBottom: 4,
  },
  preparationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  preparation: {
    fontSize: 14,
    lineHeight: 20,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  alternative: {
    marginBottom: 8,
  },
  alternativeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  alternativeReason: {
    fontSize: 12,
    color: '#666',
  },
}); 