import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { getMyCollections } from '../../api/collection';
import { ArticleCard, QuestionCard, LoadingSpinner, SegmentedControl } from '../../components';

export const MyCollectionsScreen = ({ navigation }) => {
  const [type, setType] = React.useState('文章');

  const { data, isLoading, refetch } = useQuery(
    ['myCollections', type],
    () => getMyCollections(type)
  );

  const renderItem = ({ item }) => {
    if (type === '文章') {
      return (
        <ArticleCard
          article={item}
          onPress={() => navigation.navigate('ArticleDetail', { id: item._id })}
        />
      );
    }
    return (
      <QuestionCard
        question={item}
        onPress={() => navigation.navigate('QuestionDetail', { id: item._id })}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SegmentedControl
        values={['文章', '问答']}
        selectedIndex={type === '文章' ? 0 : 1}
        onChange={(index) => setType(index === 0 ? '文章' : '问答')}
        style={styles.segmentedControl}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data?.data}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          onRefresh={refetch}
          refreshing={isLoading}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  segmentedControl: {
    margin: 15
  },
  list: {
    padding: 15
  }
}); 