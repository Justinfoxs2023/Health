import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export const CategoryFilter: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelect
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.category,
            selectedCategory === category.id && styles.selectedCategory
          ]}
          onPress={() => onSelect(category.id)}
        >
          <Text
            style={[
              styles.text,
              selectedCategory === category.id && styles.selectedText
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff'
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
  text: {
    fontSize: 14,
    color: '#666'
  },
  selectedText: {
    color: '#fff'
  }
}); 