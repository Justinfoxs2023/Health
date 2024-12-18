import React, { useState, useEffect } from 'react';

import { Card, Text, Button, LoadingSpinner } from '../common';
import { ErrorMessage } from '../common/ErrorMessage';
import { MacroDistribution } from './MacroDistribution';
import { MealTimingSchedule } from './MealTimingSchedule';
import { MicronutrientPanel } from './MicronutrientPanel';
import { PortionGuide } from './PortionGuide';
import { View, ScrollView, StyleSheet } from 'react-native';
import { usePrecisionNutrition } from '../../hooks/nutrition';

export const PrecisionNutritionPlan: React.FC = () => {
  const [plan, setPlan] = useState(null);
  const { generatePlan, loading, error } = usePrecisionNutrition();

  useEffect(() => {
    loadNutritionPlan();
  }, []);

  const loadNutritionPlan = async () => {
    const newPlan = await generatePlan();
    if (newPlan) {
      setPlan(newPlan);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={loadNutritionPlan} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <Text style={styles.title}>精准营养方案</Text>
        <Text style={styles.subtitle}>基于您的个人特征定制的营养计划</Text>
        <Button title="更新方案" onPress={loadNutritionPlan} style={styles.updateButton} />
      </Card>

      {plan && (
        <>
          <MacroDistribution data={plan.macroDistribution} />
          <MicronutrientPanel data={plan.micronutrients} />
          <MealTimingSchedule data={plan.mealTiming} />
          <PortionGuide data={plan.portionGuide} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  updateButton: {
    marginTop: 15,
  },
});
