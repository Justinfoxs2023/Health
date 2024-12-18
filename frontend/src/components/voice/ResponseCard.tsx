import React from 'react';

import { Card, Text, Icon } from '../common';
import { View, StyleSheet, Animated } from 'react-native';

interface IProps {
  /** type 的描述 */
  type: 'inquiry' | 'guidance' | 'emergency';
  /** text 的描述 */
  text: string;
  /** data 的描述 */
  data?: any;
}

export const ResponseCard: React.FC<IProps> = ({ type, text, data }) => {
  const getIcon = () => {
    switch (type) {
      case 'inquiry':
        return 'search';
      case 'guidance':
        return 'lightbulb';
      case 'emergency':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Icon name={getIcon()} size={24} color="#2E7D32" />
        <Text style={styles.title}>
          {type === 'inquiry' ? '查询结果' : type === 'guidance' ? '健康建议' : '紧急响应'}
        </Text>
      </View>

      <Text style={styles.text}>{text}</Text>

      {data && <View style={styles.dataContainer}>{/* 根据数据类型渲染不同的数据展示组件 */}</View>}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 300,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  dataContainer: {
    marginTop: 10,
  },
});
