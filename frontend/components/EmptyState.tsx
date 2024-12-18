import React from 'react';

import { Icon } from './Icon';
import { View, Text, StyleSheet } from 'react-native';

interface IProps {
  /** icon 的描述 */
  icon?: keyof typeof MaterialIcons.glyphMap;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description?: string;
}

export const EmptyState: React.FC<IProps> = ({ icon = 'inbox', title, description }) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={48} color="#999" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
