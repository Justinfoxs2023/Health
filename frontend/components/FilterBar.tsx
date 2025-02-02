import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';

interface Filter {
  id: string;
  name: string;
  options: string[];
}

interface Props {
  filters: Filter[];
  selectedFilters: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
}

export const FilterBar: React.FC<Props> = ({
  filters,
  selectedFilters,
  onFilterChange
}) => {
  return (
    <View style={styles.container}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.id}
          style={styles.filterItem}
          onPress={() => {
            const currentIndex = filter.options.indexOf(selectedFilters[filter.id] || filter.options[0]);
            const nextIndex = (currentIndex + 1) % filter.options.length;
            onFilterChange(filter.id, filter.options[nextIndex]);
          }}
        >
          <Text style={styles.filterText}>
            {filter.name}: {selectedFilters[filter.id] || filter.options[0]}
          </Text>
          <Icon name="arrow-drop-down" size={20} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4
  }
}); 