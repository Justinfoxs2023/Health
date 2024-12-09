import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  image?: any;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<Props> = ({
  image,
  title,
  description
}) => {
  return (
    <View style={styles.container}>
      {image && <Image source={image} style={styles.image} />}
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
    padding: 32
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
}); 