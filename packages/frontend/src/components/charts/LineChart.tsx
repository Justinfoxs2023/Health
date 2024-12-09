import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { Text } from '../common';

interface DataPoint {
  x: string | number;
  y: number;
}

interface Props {
  data: DataPoint[];
  title?: string;
  color?: string;
  width?: number;
  height?: number;
}

export const LineChart: React.FC<Props> = ({
  data,
  title,
  color = '#2E7D32',
  width = Dimensions.get('window').width - 40,
  height = 220
}) => {
  const chartData = {
    labels: data.map(point => point.x.toString()),
    datasets: [{
      data: data.map(point => point.y)
    }]
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: () => color,
    labelColor: () => '#666',
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: color
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNLineChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
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
  }
}); 