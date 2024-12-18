import React from 'react';

import { FunctionalNutritionPlan } from '../components/nutrition/FunctionalNutritionPlan';
import { PrecisionNutritionPlan } from '../components/nutrition/PrecisionNutritionPlan';
import { SupplementPlan } from '../components/nutrition/SupplementPlan';
import { TherapeuticDiet } from '../components/nutrition/TherapeuticDiet';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const NutritionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="PrecisionNutrition"
        component={PrecisionNutritionPlan}
        options={{ title: '精准营养方案' }}
      />
      <Stack.Screen
        name="FunctionalNutrition"
        component={FunctionalNutritionPlan}
        options={{ title: '功能性营养' }}
      />
      <Stack.Screen
        name="Supplements"
        component={SupplementPlan}
        options={{ title: '补充剂方案' }}
      />
      <Stack.Screen
        name="TherapeuticDiet"
        component={TherapeuticDiet}
        options={{ title: '治疗性饮食' }}
      />
    </Stack.Navigator>
  );
};
