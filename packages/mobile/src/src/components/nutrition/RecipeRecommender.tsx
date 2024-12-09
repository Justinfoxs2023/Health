import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Text, Chip, Button, useTheme, Divider } from 'react-native-paper';

interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  steps: string[];
  tags: string[];
  healthScore: number;
  suitableFor: string[];
}

interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  cuisinePreferences: string[];
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
  timeConstraint: number;
  nutritionGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface RecipeRecommenderProps {
  userPreferences: UserPreferences;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeRecommender = ({ userPreferences, onSelectRecipe }: RecipeRecommenderProps) => {
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // 调用AI食谱推荐API
      const response = await fetch('YOUR_API_ENDPOINT/recipe-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPreferences),
      });

      const recipes = await response.json();
      setRecommendations(recipes);
    } catch (error) {
      console.error('获取推荐食谱失败:', error);
      alert('获取推荐失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.preferencesCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>饮食偏好</Text>
          <View style={styles.chipContainer}>
            {userPreferences.dietaryRestrictions.map(restriction => (
              <Chip key={restriction} style={styles.chip}>
                {restriction}
              </Chip>
            ))}
          </View>

          <Text style={styles.label}>烹饪技能</Text>
          <Text style={styles.value}>{userPreferences.cookingSkill}</Text>

          <Text style={styles.label}>可用时间</Text>
          <Text style={styles.value}>{userPreferences.timeConstraint} 分钟</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={generateRecommendations}
        loading={loading}
        style={styles.generateButton}
      >
        生成个性化食谱推荐
      </Button>

      {recommendations.map(recipe => (
        <Card 
          key={recipe.id} 
          style={styles.recipeCard}
          onPress={() => onSelectRecipe(recipe)}
        >
          <Card.Cover source={{ uri: recipe.image }} style={styles.recipeImage} />
          <Card.Content>
            <View style={styles.recipeHeader}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={styles.healthScore}>
                <Text style={styles.scoreLabel}>健康指数</Text>
                <Text style={styles.scoreValue}>{recipe.healthScore}</Text>
              </View>
            </View>

            <View style={styles.tags}>
              {recipe.tags.map(tag => (
                <Chip key={tag} style={styles.tag}>
                  {tag}
                </Chip>
              ))}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{recipe.prepTime + recipe.cookTime}</Text>
                <Text style={styles.infoLabel}>总时间(分钟)</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{recipe.calories}</Text>
                <Text style={styles.infoLabel}>卡路里</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{recipe.difficulty}</Text>
                <Text style={styles.infoLabel}>难度</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>营养成分</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>蛋白质</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>碳水</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>脂肪</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.fiber}g</Text>
                <Text style={styles.nutritionLabel}>膳食纤维</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  preferencesCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  generateButton: {
    marginBottom: 16,
  },
  recipeCard: {
    marginBottom: 16,
  },
  recipeImage: {
    height: 200,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  healthScore: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    margin: 4,
  },
  divider: {
    marginVertical: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
}); 