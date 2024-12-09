import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';

interface FoodItem {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  imageUrl?: string;
}

interface DietRecordProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: Date;
  foods: FoodItem[];
  totalCalories: number;
  imageUrl?: string;
  onEdit?: () => void;
  onAddFood?: () => void;
}

export const DietRecord: React.FC<DietRecordProps> = ({
  mealType,
  time,
  foods,
  totalCalories,
  imageUrl,
  onEdit,
  onAddFood
}) => {
  const getMealIcon = () => {
    switch (mealType) {
      case 'breakfast':
        return 'free-breakfast';
      case 'lunch':
        return 'restaurant';
      case 'dinner':
        return 'dinner-dining';
      case 'snack':
        return 'icecream';
    }
  };

  const getTotalNutrients = () => {
    return foods.reduce((acc, food) => ({
      protein: acc.protein + food.nutrients.protein,
      carbs: acc.carbs + food.nutrients.carbs,
      fat: acc.fat + food.nutrients.fat,
      fiber: acc.fiber + food.nutrients.fiber
    }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const totalNutrients = getTotalNutrients();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.mealInfo}>
          <CustomIcon 
            name={getMealIcon()} 
            size={24} 
            color={DesignTokens.colors.brand.primary} 
          />
          <Text style={styles.mealType}>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </Text>
          <Text style={styles.time}>
            {time.toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <TouchableOpacity onPress={onEdit}>
          <CustomIcon name="edit" size={20} color={DesignTokens.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }}
          style={styles.mealImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.nutritionSummary}>
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieValue}>{totalCalories}</Text>
          <Text style={styles.calorieLabel}>卡路里</Text>
        </View>
        <View style={styles.nutrientsContainer}>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientValue}>{totalNutrients.protein}g</Text>
            <Text style={styles.nutrientLabel}>蛋白质</Text>
          </View>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientValue}>{totalNutrients.carbs}g</Text>
            <Text style={styles.nutrientLabel}>碳水</Text>
          </View>
          <View style={styles.nutrientItem}>
            <Text style={styles.nutrientValue}>{totalNutrients.fat}g</Text>
            <Text style={styles.nutrientLabel}>脂肪</Text>
          </View>
        </View>
      </View>

      <View style={styles.foodList}>
        <Text style={styles.sectionTitle}>食物清单</Text>
        {foods.map((food, index) => (
          <View key={index} style={styles.foodItem}>
            {food.imageUrl && (
              <Image 
                source={{ uri: food.imageUrl }}
                style={styles.foodImage}
              />
            )}
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodAmount}>
                {food.amount} {food.unit} · {food.calories} 卡路里
              </Text>
            </View>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={onAddFood}
        >
          <CustomIcon name="add" size={20} color={DesignTokens.colors.brand.primary} />
          <Text style={styles.addButtonText}>添加食物</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignTokens.colors.background.paper,
    borderRadius: DesignTokens.radius.lg,
    ...DesignTokens.shadows.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DesignTokens.spacing.lg
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mealType: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.lg,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary
  },
  time: {
    marginLeft: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  mealImage: {
    width: '100%',
    height: 200
  },
  nutritionSummary: {
    padding: DesignTokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.border
  },
  calorieContainer: {
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md
  },
  calorieValue: {
    fontSize: DesignTokens.typography.sizes.xxl,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.text.primary
  },
  calorieLabel: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  nutrientItem: {
    alignItems: 'center'
  },
  nutrientValue: {
    fontSize: DesignTokens.typography.sizes.md,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary
  },
  nutrientLabel: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  foodList: {
    padding: DesignTokens.spacing.lg
  },
  sectionTitle: {
    fontSize: DesignTokens.typography.sizes.md,
    fontWeight: String(DesignTokens.typography.weights.semibold),
    color: DesignTokens.colors.text.primary,
    marginBottom: DesignTokens.spacing.md
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: DesignTokens.radius.md,
    marginRight: DesignTokens.spacing.md
  },
  foodInfo: {
    flex: 1
  },
  foodName: {
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.primary
  },
  foodAmount: {
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.brand.primary,
    marginTop: DesignTokens.spacing.md
  },
  addButtonText: {
    marginLeft: DesignTokens.spacing.xs,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.brand.primary
  }
}); 