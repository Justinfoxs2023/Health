import React from 'react';

import { SearchBar, FilterBar, LoadingSpinner, NutritionistCard } from '../../components';
import { View, FlatList, StyleSheet } from 'react-native';
import { getNutritionists } from '../../api/nutritionist';
import { useQuery } from 'react-query';

export const NutritionistListScreen = ({ navigation }) => {
  const [searchText, setSearchText] = React.useState('');
  const [filters, setFilters] = React.useState({
    specialties: [],
    rating: 0,
    availability: false,
  });

  const { data, isLoading, refetch } = useQuery(['nutritionists', searchText, filters], () =>
    getNutritionists({ search: searchText, ...filters }),
  );

  const handleFilter = newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <View style={styles.container}>
      <SearchBar value={searchText} onChangeText={setSearchText} placeholder="搜索营养师..." />
      <FilterBar
        filters={filters}
        onFilter={handleFilter}
        options={{
          specialties: ['减重', '增肌', '孕产', '慢病', '儿童', '运动营养'],
          rating: [4, 4.5, 4.8],
          availability: true,
        }}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data?.data}
          renderItem={({ item }) => (
            <NutritionistCard
              nutritionist={item}
              onPress={() => navigation.navigate('NutritionistDetail', { id: item._id })}
            />
          )}
          keyExtractor={item => item._id}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
