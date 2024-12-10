import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';

interface NutrientData {
  name: string;
  value: number;
  color: string;
}

interface DietaryIntakeCardProps {
  calories: number;
  nutrients: NutrientData[];
  goal: number;
}

export const DietaryIntakeCard = ({ calories, nutrients, goal }: DietaryIntakeCardProps) => {
  const theme = useTheme();

  const chartData = nutrients.map(nutrient => ({
    name: nutrient.name,
    population: nutrient.value,
    color: nutrient.color,
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  }));

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>今日营养摄入</Text>
        <View style={styles.caloriesContainer}>
          <Text style={styles.calories}>{calories}</Text>
          <Text style={styles.unit}>千卡</Text>
          <Text style={styles.goal}>目标: {goal} 千卡</Text>
        </View>
        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  caloriesContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calories: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 14,
    color: '#666',
  },
  goal: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 