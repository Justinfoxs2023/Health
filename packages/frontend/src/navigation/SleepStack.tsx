import React from 'react';

import { SleepAnalysis } from '../components/sleep/SleepAnalysis';
import { SleepHistory } from '../components/sleep/SleepHistory';
import { SleepMonitoring } from '../components/sleep/SleepMonitoring';
import { SleepOptimization } from '../components/sleep/SleepOptimization';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const SleepStack = () => {
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
        name="SleepMonitoring"
        component={SleepMonitoring}
        options={{ title: '睡眠监测' }}
      />
      <Stack.Screen
        name="SleepOptimization"
        component={SleepOptimization}
        options={{ title: '睡眠优化' }}
      />
      <Stack.Screen name="SleepHistory" component={SleepHistory} options={{ title: '睡眠历史' }} />
      <Stack.Screen
        name="SleepAnalysis"
        component={SleepAnalysis}
        options={{ title: '睡眠分析' }}
      />
    </Stack.Navigator>
  );
};
