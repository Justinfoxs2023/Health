import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getDietPlan, updatePlanStatus } from '../../api/diet';
import {
  DietPlanHeader,
  NutritionTargetCard,
  MealPlanList,
  LoadingSpinner,
  ConfirmDialog
} from '../../components';

export const DietPlanScreen = ({ navigation }) => {
  const [showStatusDialog, setShowStatusDialog] = React.useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('currentDietPlan', getDietPlan);

  const mutation = useMutation(updatePlanStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentDietPlan');
    }
  });

  if (isLoading) return <LoadingSpinner />;

  const plan = data?.data;

  const handleStatusChange = (status: string) => {
    mutation.mutate({
      planId: plan._id,
      status
    });
    setShowStatusDialog(false);
  };

  return (
    <ScrollView style={styles.container}>
      <DietPlanHeader
        name={plan.name}
        goal={plan.goal}
        status={plan.status}
        startDate={plan.startDate}
        endDate={plan.endDate}
        onStatusPress={() => setShowStatusDialog(true)}
      />

      <View style={styles.section}>
        <NutritionTargetCard
          dailyCalories={plan.dailyCalorieTarget}
          nutritionTargets={plan.nutritionTargets}
          style={styles.card}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>每周饮食计划</Text>
        <MealPlanList
          weeklyPlan={plan.weeklyPlan}
          onMealPress={(meal) => {
            navigation.navigate('RecipeDetail', { id: meal.recipe });
          }}
        />
      </View>

      {plan.restrictions?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>饮食限制</Text>
          <View style={styles.restrictionContainer}>
            {plan.restrictions.map((restriction, index) => (
              <View key={index} style={styles.restrictionTag}>
                <Text style={styles.restrictionText}>{restriction}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => navigation.navigate('GenerateDietPlan')}
      >
        <Text style={styles.generateButtonText}>生成新的饮食计划</Text>
      </TouchableOpacity>

      <ConfirmDialog
        visible={showStatusDialog}
        title="更改计划状态"
        options={[
          { label: '进行中', value: '进行中' },
          { label: '已完成', value: '已完成' },
          { label: '已暂停', value: '已暂停' }
        ]}
        onSelect={handleStatusChange}
        onCancel={() => setShowStatusDialog(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  section: {
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
  },
  restrictionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  restrictionTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4
  },
  restrictionText: {
    color: '#2E7D32',
    fontSize: 14
  },
  generateButton: {
    backgroundColor: '#2E7D32',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 