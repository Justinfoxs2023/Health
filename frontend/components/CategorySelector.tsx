import React from 'react';

import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ICategory {
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

export const CategorySelector: React.FC<IProps> = ({ categories, selectedCategory, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.category, selectedCategory === category.id && styles.selectedCategory]}
            onPress={() => onSelect(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#2E7D32',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});
