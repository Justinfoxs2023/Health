import React from 'react';

import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface ICategory {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
}

interface IProps {
  /** categories 的描述 */
  categories: ICategory[];
  /** selectedCategory 的描述 */
  selectedCategory: string;
  /** onSelect 的描述 */
  onSelect: (id: string) => void;
}

export const CategoryFilter: React.FC<IProps> = ({ categories, selectedCategory, onSelect }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[styles.category, selectedCategory === category.id && styles.selectedCategory]}
          onPress={() => onSelect(category.id)}
        >
          <Text style={[styles.text, selectedCategory === category.id && styles.selectedText]}>
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
    backgroundColor: '#fff',
  },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#2E7D32',
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
});
