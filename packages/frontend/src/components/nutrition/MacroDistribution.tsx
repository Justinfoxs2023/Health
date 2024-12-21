import React from 'react';

import { Card, Text } from '../common';
import { PieChart } from 'react-native-chart-kit';
import { View, StyleSheet } from 'react-native';

interface IProps {
  /** data 的描述 */
  data: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const MacroDistribution: React.FC<IProps> = ({ data }) => {
  const chartData = [
    {
      name: '蛋白质',
      value: data.protein,
      color: '#FF6B6B',
      legendFontColor: '#333',
    },
    {
      name: '碳水',
      value: data.carbs,
      color: '#4ECDC4',
      legendFontColor: '#333',
    },
    {
      name: '脂肪',
      value: data.fat,
      color: '#45B7D1',
      legendFontColor: '#333',
    },
  ];

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>宏量营养素分配</Text>
      <PieChart
        data={chartData}
        width={300}
        height={200}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
});
