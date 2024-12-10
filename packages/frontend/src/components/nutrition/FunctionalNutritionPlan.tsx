import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, TabView } from '../common';
import { SupplementPlanPanel } from './SupplementPlanPanel';
import { TherapeuticDietPanel } from './TherapeuticDietPanel';
import { useFunctionalNutrition } from '../../hooks/nutrition';

export const FunctionalNutritionPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('supplements');
  const { supplementPlan, therapeuticDiet, loading } = useFunctionalNutrition();

  const tabs = [
    { key: 'supplements', title: '营养补充' },
    { key: 'therapeutic', title: '治疗饮食' }
  ];

  return (
    <View style={styles.container}>
      <TabView
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      <ScrollView>
        {activeTab === 'supplements' && (
          <SupplementPlanPanel plan={supplementPlan} />
        )}
        
        {activeTab === 'therapeutic' && (
          <TherapeuticDietPanel diet={therapeuticDiet} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
}); 