import React from 'react';

import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { Text } from '../common';
import { View, StyleSheet, Dimensions } from 'react-native';

interface IPieChartData {
  /** name 的描述 */
  name: string;
  /** value 的描述 */
  value: number;
  /** color 的描述 */
  color: string;
  /** legendFontColor 的描述 */
  legendFontColor?: string;
}

interface IProps {
  /** data 的描述 */
  data: IPieChartData[];
  /** title 的描述 */
  title?: string;
  /** width 的描述 */
  width?: number;
  /** height 的描述 */
  height?: number;
}

export const PieChart: React.FC<IProps> = ({
  data,
  title,
  width = Dimensions.get('window').width - 40,
  height = 220,
}) => {
  const chartData = data.map(item => ({
    name: item.name,
    population: item.value,
    color: item.color,
    legendFontColor: item.legendFontColor || '#666',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNPieChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
});
