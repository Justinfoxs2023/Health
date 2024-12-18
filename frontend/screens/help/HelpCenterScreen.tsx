import React from 'react';

import { LoadingSpinner, Icon } from '../../components';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { getHelpCategories } from '../../api/help';
import { useQuery } from '@tanstack/react-query';

interface IHelpCategory {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** icon 的描述 */
  icon: string;
  /** description 的描述 */
  description: string;
  /** articleCount 的描述 */
  articleCount: number;
}

interface ICommonQuestion {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** category 的描述 */
  category: string;
  /** isHot 的描述 */
  isHot?: boolean;
}

export const HelpCenterScreen = ({ navigation }) => {
  const { data: categories, isLoading } = useQuery<IHelpCategory[]>(
    'helpCategories',
    getHelpCategories,
  );

  const commonQuestions: ICommonQuestion[] = [
    {
      id: '1',
      title: '如何修改个人资料？',
      category: '账号设置',
      isHot: true,
    },
    {
      id: '2',
      title: '如何预约营养师？',
      category: '咨询服务',
      isHot: true,
    },
    {
      id: '3',
      title: '如何查看健康报告？',
      category: '健康管理',
    },
    {
      id: '4',
      title: '如何制定饮食计划？',
      category: '饮食管理',
    },
  ];

  const handleSearch = (text: string) => {
    if (text.trim()) {
      navigation.navigate('HelpSearch', { keyword: text });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBox}
          onPress={() => navigation.navigate('HelpSearch')}
        >
          <Icon name="search" size={20} color="#999" />
          <Text style={styles.searchPlaceholder}>搜索问题</Text>
        </TouchableOpacity>
      </View>

      {/* 常见问题 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>常见问题</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HelpList', { type: 'common' })}>
            <Text style={styles.moreText}>查看更多</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.questionList}>
          {commonQuestions.map(question => (
            <TouchableOpacity
              key={question.id}
              style={styles.questionItem}
              onPress={() => navigation.navigate('HelpDetail', { id: question.id })}
            >
              <View style={styles.questionContent}>
                <Text style={styles.questionTitle}>{question.title}</Text>
                <Text style={styles.questionCategory}>{question.category}</Text>
              </View>
              {question.isHot && (
                <View style={styles.hotTag}>
                  <Text style={styles.hotTagText}>热门</Text>
                </View>
              )}
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 问题分类 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>问题分类</Text>
        <View style={styles.categoryGrid}>
          {categories?.map(category => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate('HelpCategory', { id: category.id, name: category.name })
              }
            >
              <View style={styles.categoryIcon}>
                <Icon name={category.icon} size={24} color="#2E7D32" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.articleCount}>{category.articleCount}篇文章</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 联系我们 */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>联系我们</Text>
        <Text style={styles.contactDesc}>如果以上内容无法解决您的问题，您可以：</Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate('CustomerService')}
          >
            <Icon name="message-circle" size={24} color="#2E7D32" />
            <Text style={styles.contactButtonText}>在线客服</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate('Feedback')}
          >
            <Icon name="edit-3" size={24} color="#2E7D32" />
            <Text style={styles.contactButtonText}>意见反馈</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moreText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  questionList: {
    marginTop: 10,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  questionContent: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  questionCategory: {
    fontSize: 14,
    color: '#666',
  },
  hotTag: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  hotTagText: {
    fontSize: 12,
    color: '#D32F2F',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  categoryItem: {
    width: '33.33%',
    padding: 5,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  articleCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  contactSection: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
});
