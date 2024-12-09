import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { getNutritionQuestions } from '../../api/nutrition';
import { CategoryFilter, SearchBar, LoadingSpinner, Tag } from '../../components';
import { Category } from '../../components/CategoryFilter/types';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../types/navigation';

export const QAScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');

  const { data: questions, isLoading, refetch } = useQuery(
    ['nutritionQuestions', { category, keyword }],
    () => getNutritionQuestions({ category, keyword })
  );

  const questionList = questions?.data || [];

  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity style={styles.questionCard}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Tag text={item.status} type={getStatusType(item.status)} />
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.footer}>
        <View style={styles.stats}>
          <Text>浏览 {item.viewCount}</Text>
          <Text>回答 {item.answers.length}</Text>
        </View>
        <View style={styles.tags}>
          {item.tags.map((tag, index) => (
            <Tag key={index} text={tag} type="default" small />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusType = (status) => {
    switch (status) {
      case '待回答':
        return 'warning';
      case '已回答':
        return 'success';
      case '已关闭':
        return 'default';
      default:
        return 'default';
    }
  };

  const categories: Category[] = [
    { id: 'all', name: '全部' },
    { id: 'consultation', name: '饮食咨询' },
    { id: 'plan', name: '营养方案' },
    { id: 'weight', name: '体重管理' },
    { id: 'disease', name: '疾饮食' },
    { id: 'sports', name: '运动营养' },
    { id: 'other', name: '其他' }
  ];

  return (
    <View style={styles.container}>
      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        placeholder="搜索营养咨询问题..."
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={category}
        onSelect={setCategory}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={questionList}
          renderItem={renderQuestionItem}
          keyExtractor={item => item._id}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
      <TouchableOpacity 
        style={styles.askButton}
        onPress={() => navigation.navigate('AskQuestion')}
      >
        <Text style={styles.askButtonText}>我要提问</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  questionCard: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  stats: {
    flexDirection: 'row',
    gap: 15
  },
  tags: {
    flexDirection: 'row',
    gap: 5
  },
  askButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5
  },
  askButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 