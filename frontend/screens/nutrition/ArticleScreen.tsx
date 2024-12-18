import React from 'react';

import { CategoryFilter, SearchBar, LoadingSpinner } from '../../components';
import { ICategory } from '../../components/CategoryFilter/types';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getNutritionArticles } from '../../api/nutrition';
import { useQuery } from 'react-query';

export const ArticleScreen = () => {
  const [category, setCategory] = React.useState('');
  const [searchText, setSearchText] = React.useState('');

  const { data, isLoading, refetch } = useQuery(['nutritionArticles', category, searchText], () =>
    getNutritionArticles({ category, search: searchText }),
  );

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity style={styles.articleCard}>
      {item.coverImage && <Image source={{ uri: item.coverImage }} style={styles.coverImage} />}
      <View style={styles.articleInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
        <View style={styles.stats}>
          <Text>阅读 {item.readCount}</Text>
          <Text>点赞 {item.likeCount}</Text>
          <Text>评论 {item.commentCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="搜索营养知识文章..."
      />
      <CategoryFilter
        categories={[
          { id: 'all', name: '全部' },
          { id: 'knowledge', name: '营养知识' },
          { id: 'health', name: '健康饮食' },
          { id: 'disease', name: '疾病饮食' },
          { id: 'sports', name: '运动营养' },
          { id: 'special', name: '特殊人群' },
          { id: 'safety', name: '食品安全' },
        ]}
        selectedCategory={category}
        onSelect={setCategory}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data?.data}
          renderItem={renderArticleItem}
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
  articleCard: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  articleInfo: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
