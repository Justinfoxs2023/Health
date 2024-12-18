import React from 'react';

import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
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

interface IDailyNutrition {
  /** date 的描述 */
  date: string;
  /** calories 的描述 */
  calories: number;
  /** protein 的描述 */
  protein: number;
  /** carbs 的描述 */
  carbs: number;
  /** fat 的描述 */
  fat: number;
  /** fiber 的描述 */
  fiber: number;
  /** water 的描述 */
  water: number;
}

interface INutritionTrend {
  /** labels 的描述 */
  labels: string[];
  /** datasets 的描述 */
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

interface INutritionTrackerProps {
  /** goals 的描述 */
  goals: INutrientGoal[];
  /** dailyLog 的描述 */
  dailyLog: IDailyNutrition[];
  /** trends 的描述 */
  trends: INutritionTrend;
}

export const NutritionTracker = ({ goals, dailyLog, trends }: INutritionTrackerProps) => {
  const theme = useTheme();

  const getProgressColor = (progress: number) => {
    if (progress >= 1) return theme.colors.success;
    if (progress >= 0.7) return theme.colors.primary;
    return theme.colors.error;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>今日营养目标</Text>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalValue}>
                  {goal.current}/{goal.target} {goal.unit}
                </Text>
              </View>
              <ProgressBar
                progress={goal.current / goal.target}
                color={getProgressColor(goal.current / goal.target)}
                style={styles.progressBar}
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>营养趋势</Text>
          <LineChart
            data={{
              labels: trends.labels,
              datasets: trends.datasets,
            }}
            width={320}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.text,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.colors.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>最近饮食记录</Text>
          {dailyLog.map((day, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logDate}>{day.date}</Text>
              <View style={styles.nutrientGrid}>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>{day.calories}</Text>
                  <Text style={styles.nutrientLabel}>卡路里</Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>{day.protein}g</Text>
                  <Text style={styles.nutrientLabel}>蛋白质</Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>{day.carbs}g</Text>
                  <Text style={styles.nutrientLabel}>碳水</Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>{day.fat}g</Text>
                  <Text style={styles.nutrientLabel}>脂肪</Text>
                </View>
              </View>
              <View style={styles.extraNutrients}>
                <Text style={styles.extraNutrient}>膳食纤维: {day.fiber}g</Text>
                <Text style={styles.extraNutrient}>饮水量: {day.water}ml</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  logItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nutrientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  nutrientItem: {
    width: '25%',
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#666',
  },
  extraNutrients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extraNutrient: {
    fontSize: 14,
    color: '#666',
  },
});
