import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';

interface Props {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<Props> = ({
  icon = 'inbox',
  title,
  description
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={48} color="#999" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  icon: {
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
}); 