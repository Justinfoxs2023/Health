import React from 'react';

import { LoadingSpinner, Icon, EmptyState } from '../../components';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getHelpCategoryDetail } from '../../api/help';
import { useQuery } from '@tanstack/react-query';

interface IHelpArticle {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** viewCount 的描述 */
  viewCount: number;
  /** helpfulCount 的描述 */
  helpfulCount: number;
  /** updatedAt 的描述 */
  updatedAt: string;
}

interface ISubcategory {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** articleCount 的描述 */
  articleCount: number;
  /** description 的描述 */
  description: string;
}

interface ICategoryDetail {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** articles 的描述 */
  articles: IHelpArticle[];
  /** subcategories 的描述 */
  subcategories: ISubcategory[];
}

export const HelpCategoryScreen = ({ route, navigation }) => {
  const { id, name } = route.params;
  const { data, isLoading } = useQuery<ICategoryDetail>(['helpCategory', id], () =>
    getHelpCategoryDetail(id),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  const renderArticle = ({ item }: { item: IHelpArticle }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate('HelpDetail', { id: item.id })}
    >
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.articleMeta}>
          <Text style={styles.viewCount}>
            <Icon name="eye" size={14} color="#999" /> {item.viewCount}
          </Text>
          <Text style={styles.helpfulCount}>
            <Icon name="thumbs-up" size={14} color="#999" /> {item.helpfulCount}
          </Text>
          <Text style={styles.updateTime}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  const { articles = [], subcategories = [] } = data || {};

  return (
    <View style={styles.container}>
      {subcategories.length > 0 && (
        <View style={styles.subcategories}>
          {subcategories.map(subcategory => (
            <TouchableOpacity
              key={subcategory.id}
              style={styles.subcategoryItem}
              onPress={() =>
                navigation.push('HelpCategory', {
                  id: subcategory.id,
                  name: subcategory.name,
                })
              }
            >
              <View style={styles.subcategoryContent}>
                <Text style={styles.subcategoryName}>{subcategory.name}</Text>
                <Text style={styles.articleCount}>{subcategory.articleCount}篇文章</Text>
                <Text style={styles.subcategoryDesc} numberOfLines={2}>
                  {subcategory.description}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState icon="file-text" title="暂无文章" description="该分类下暂时没有帮助文章" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  subcategories: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  subcategoryContent: {
    flex: 1,
    marginRight: 10,
  },
  subcategoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  articleCount: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 4,
  },
  subcategoryDesc: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 15,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  articleContent: {
    flex: 1,
    marginRight: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  articleDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCount: {
    fontSize: 12,
    color: '#999',
    marginRight: 15,
  },
  helpfulCount: {
    fontSize: 12,
    color: '#999',
    marginRight: 15,
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 10,
  },
});
