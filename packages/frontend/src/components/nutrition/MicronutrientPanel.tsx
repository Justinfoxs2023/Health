import React from 'react';

import { Card, Text, ProgressBar } from '../common';
import { View, StyleSheet, ScrollView } from 'react-native';

interface IProps {
  /** data 的描述 */
  data: Record<
    string,
    {
      current: number;
      target: number;
      unit: string;
    }
  >;
}

export const MicronutrientPanel: React.FC<IProps> = ({ data }) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>微量营养素</Text>
      <ScrollView>
        {Object.entries(data).map(([name, info]) => (
          <View key={name} style={styles.nutrientRow}>
            <Text style={styles.nutrientName}>{name}</Text>
            <View style={styles.progressContainer}>
              <ProgressBar progress={info.current / info.target} color="#2E7D32" />
              <Text style={styles.valueText}>
                {info.current}/{info.target} {info.unit}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nutrientName: {
    width: 100,
    fontSize: 14,
  },
  progressContainer: {
    flex: 1,
  },
  valueText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
