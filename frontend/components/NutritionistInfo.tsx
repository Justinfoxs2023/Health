import React from 'react';

import { Icon } from './Icon';
import { View, Image, Text, StyleSheet } from 'react-native';

interface IProps {
  /** nutritionist 的描述 */
  nutritionist: {
    id: string;
    avatar: string;
    name: string;
    title: string;
    hospital?: string;
    department?: string;
    experience: number;
    rating: number;
    consultCount: number;
  };
}

export const NutritionistInfo: React.FC<IProps> = ({ nutritionist }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: nutritionist.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{nutritionist.name}</Text>
          <Text style={styles.title}>{nutritionist.title}</Text>
          {nutritionist.hospital && (
            <Text style={styles.hospital}>
              {nutritionist.hospital} · {nutritionist.department}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Icon name="star" size={16} color="#F57C00" />
          <Text style={styles.statValue}>{nutritionist.rating}</Text>
          <Text style={styles.statLabel}>评分</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="history" size={16} color="#1976D2" />
          <Text style={styles.statValue}>{nutritionist.experience}年</Text>
          <Text style={styles.statLabel}>从业经验</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="people" size={16} color="#2E7D32" />
          <Text style={styles.statValue}>{nutritionist.consultCount}</Text>
          <Text style={styles.statLabel}>咨询人数</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hospital: {
    fontSize: 14,
    color: '#666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});
