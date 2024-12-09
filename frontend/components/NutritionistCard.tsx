import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  nutritionist: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    hospital: string;
    department: string;
    rating: number;
    consultCount: number;
    onlinePrice: number;
    offlinePrice: number;
  };
  onPress: () => void;
}

export const NutritionistCard: React.FC<Props> = ({ nutritionist, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: nutritionist.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{nutritionist.name}</Text>
          <Text style={styles.title}>{nutritionist.title}</Text>
        </View>
        <Text style={styles.hospital}>
          {nutritionist.hospital} · {nutritionist.department}
        </Text>
        <View style={styles.stats}>
          <Icon name="star" size={16} color="#FFC107" />
          <Text style={styles.rating}>{nutritionist.rating}</Text>
          <Text style={styles.consultCount}>
            {nutritionist.consultCount}次咨询
          </Text>
        </View>
        <View style={styles.prices}>
          <Text style={styles.price}>
            线上：¥{nutritionist.onlinePrice}/次
          </Text>
          <Text style={styles.price}>
            线下：¥{nutritionist.offlinePrice}/次
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16
  },
  content: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 8
  },
  title: {
    fontSize: 14,
    color: '#666'
  },
  hospital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    marginRight: 12
  },
  consultCount: {
    fontSize: 14,
    color: '#666'
  },
  prices: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  price: {
    fontSize: 14,
    color: '#2E7D32'
  }
}); 