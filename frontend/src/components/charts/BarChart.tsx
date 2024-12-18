import React from 'react';

import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { Text } from '../common';
import { View, StyleSheet, Dimensions } from 'react-native';

interface IProps {
  /** data 的描述 */
  data: {
    labels: string[];
    datasets: {
      data: number[];
      colors?: string[];
    }[];
  };
  /** title 的描述 */
  title?: string;
  /** width 的描述 */
  width?: number;
  /** height 的描述 */
  height?: number;
}

export const BarChart: React.FC<IProps> = ({
  data,
  title,
  width = Dimensions.get('window').width - 40,
  height = 220,
}) => {
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: () => '#666',
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNBarChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
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
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
});
