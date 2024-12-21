import React from 'react';

import { LoadingSpinner, Icon } from '../../components';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getHelpArticle, markArticleHelpful } from '../../api/help';
import { useQuery, useMutation } from '@tanstack/react-query';

interface IArticleSection {
  /** title 的描述 */
  title?: string;
  /** content 的描述 */
  content: string;
  /** tips 的描述 */
  tips?: string;
  /** imageUrl 的描述 */
  imageUrl?: string;
}

interface IHelpArticle {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** category 的描述 */
  category: string;
  /** content 的描述 */
  content: IArticleSection[];
  /** viewCount 的描述 */
  viewCount: number;
  /** helpfulCount 的描述 */
  helpfulCount: number;
  /** notHelpfulCount 的描述 */
  notHelpfulCount: number;
  /** updatedAt 的描述 */
  updatedAt: string;
  /** relatedQuestions 的描述 */
  relatedQuestions: {
    id: string;
    title: string;
  }[];
}

export const HelpDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { data: article, isLoading } = useQuery<IHelpArticle>(['helpArticle', id], () =>
    getHelpArticle(id),
  );

  const [feedbackGiven, setFeedbackGiven] = React.useState(false);

  const mutation = useMutation(markArticleHelpful);

  const handleFeedback = (isHelpful: boolean) => {
    if (!feedbackGiven) {
      mutation.mutate({ articleId: id, isHelpful });
      setFeedbackGiven(true);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: article?.category || '帮助详情',
    });
  }, [navigation, article?.category]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{article?.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.category}>{article?.category}</Text>
          <Text style={styles.date}>{new Date(article?.updatedAt || '').toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {article?.content.map((section, index) => (
          <View key={index} style={styles.section}>
            {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
            <Text style={styles.sectionContent}>{section.content}</Text>
            {section.tips && (
              <View style={styles.tips}>
                <Icon name="info" size={16} color="#1976D2" style={styles.tipsIcon} />
                <Text style={styles.tipsText}>{section.tips}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.relatedSection}>
        <Text style={styles.relatedTitle}>相关问题</Text>
        {article?.relatedQuestions.map(question => (
          <TouchableOpacity
            key={question.id}
            style={styles.relatedItem}
            onPress={() => navigation.push('HelpDetail', { id: question.id })}
          >
            <Text style={styles.relatedText}>{question.title}</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.feedback}>
        <Text style={styles.feedbackTitle}>这篇文章是否解决了您的问题？</Text>
        <View style={styles.feedbackButtons}>
          <TouchableOpacity
            style={[styles.feedbackButton, styles.helpfulButton]}
            onPress={() => handleFeedback(true)}
            disabled={feedbackGiven}
          >
            <Icon name="thumbs-up" size={20} color="#2E7D32" />
            <Text style={[styles.feedbackButtonText, styles.helpfulText]}>
              有帮助 ({article?.helpfulCount || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feedbackButton, styles.unhelpfulButton]}
            onPress={() => handleFeedback(false)}
            disabled={feedbackGiven}
          >
            <Icon name="thumbs-down" size={20} color="#D32F2F" />
            <Text style={[styles.feedbackButtonText, styles.unhelpfulText]}>
              没帮助 ({article?.notHelpfulCount || 0})
            </Text>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tips: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  tipsIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  relatedSection: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  relatedText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  feedback: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  helpfulButton: {
    backgroundColor: '#E8F5E9',
  },
  unhelpfulButton: {
    backgroundColor: '#FFEBEE',
  },
  feedbackButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
  helpfulText: {
    color: '#2E7D32',
  },
  unhelpfulText: {
    color: '#D32F2F',
  },
});
