import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const CategoryFilter: React.FC<Props> = ({
  categories,
  selectedId,
  onChange
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.category,
            selectedId === category.id && styles.selectedCategory
          ]}
          onPress={() => onChange(category.id)}
        >
          <Text style={[
            styles.categoryText,
            selectedId === category.id && styles.selectedText
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8
  },
  selectedCategory: {
    backgroundColor: '#2E7D32'
  },
  categoryText: {
    fontSize: 14,
    color: '#666'
  },
  selectedText: {
    color: '#fff'
  }
}); 