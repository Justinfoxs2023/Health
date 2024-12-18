import React from 'react';

import { LoadingSpinner, NutritionInfoCard, StepList, IngredientList } from '../../components';
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native';
import { getRecipeDetail } from '../../api/recipe';
import { useQuery } from 'react-query';

export const RecipeDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { data, isLoading } = useQuery(['recipe', id], () => getRecipeDetail(id));

  if (isLoading) return <LoadingSpinner />;

  const recipe = data?.data;

  return (
    <ScrollView style={styles.container}>
      {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>难度: {recipe.difficulty}</Text>
          <Text style={styles.metaText}>烹饪时间: {recipe.cookingTime}分钟</Text>
          <Text style={styles.metaText}>份量: {recipe.servings}人份</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>营养成分</Text>
          <NutritionInfoCard nutrition={recipe.nutrition} style={styles.nutritionCard} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>食材清单</Text>
          <IngredientList
            ingredients={recipe.ingredients}
            servings={recipe.servings}
            style={styles.ingredientList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>烹饪步骤</Text>
          <StepList steps={recipe.steps} style={styles.stepList} />
        </View>

        {recipe.tags?.length > 0 && (
          <View style={styles.tagContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metaText: {
    color: '#666',
    marginRight: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  nutritionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  ingredientList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  stepList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: '#2E7D32',
    fontSize: 14,
  },
});
