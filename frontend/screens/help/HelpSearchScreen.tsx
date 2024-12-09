import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchHelp } from '../../api/help';
import { LoadingSpinner, Icon, EmptyState } from '../../components';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  viewCount: number;
  matchedContent?: string;
}

export const HelpSearchScreen = ({ navigation, route }) => {
  const { initialKeyword = '' } = route.params || {};
  const [keyword, setKeyword] = React.useState(initialKeyword);
  const [debouncedKeyword, setDebouncedKeyword] = React.useState(initialKeyword);

  const { data, isLoading, refetch } = useQuery<SearchResult[]>(
    ['helpSearch', debouncedKeyword],
    () => searchHelp(debouncedKeyword),
    {
      enabled: debouncedKeyword.length > 0
    }
  );

  const debouncedSearch = React.useMemo(
    () => debounce((text: string) => setDebouncedKeyword(text), 500),
    []
  );

  const handleSearch = (text: string) => {
    setKeyword(text);
    debouncedSearch(text);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('HelpDetail', { id: item.id })}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        {item.matchedContent ? (
          <Text style={styles.matchedContent} numberOfLines={2}>
            {item.matchedContent}
          </Text>
        ) : (
          <Text style={styles.resultDesc} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.resultMeta}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.viewCount}>
            <Icon name="eye" size={14} color="#999" /> {item.viewCount}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索问题"
            value={keyword}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {keyword && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <Icon name="x" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderSearchResult}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          debouncedKeyword ? (
            <EmptyState
              icon="search"
              title="未找到相关内容"
              description={`没有找到与"${debouncedKeyword}"相关的内容\n换个关键词试试看`}
            />
          ) : null
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0'
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333'
  },
  clearButton: {
    padding: 5
  },
  cancelButton: {
    padding: 5
  },
  cancelText: {
    fontSize: 16,
    color: '#2E7D32'
  },
  list: {
    padding: 15
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
  },
  resultContent: {
    flex: 1,
    marginRight: 10
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  resultDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  matchedContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  category: {
    fontSize: 12,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10
  },
  viewCount: {
    fontSize: 12,
    color: '#999'
  },
  separator: {
    height: 10
  }
}); 