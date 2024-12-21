import React from 'react';

import { LoadingSpinner, AuthorInfo, LikeButton, ShareButton } from '../../components';
import { RichTextRenderer } from '../../components/RichTextRenderer';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import { getArticleDetails } from '../../api/nutrition';
import { useQuery } from 'react-query';

export const ArticleDetailScreen = ({ route }) => {
  const { id } = route.params;

  const { data, isLoading } = useQuery(['articleDetails', id], () => getArticleDetails(id));

  if (isLoading) return <LoadingSpinner />;

  const article = data?.data;

  return (
    <ScrollView style={styles.container}>
      {article.coverImage && (
        <Image source={{ uri: article.coverImage }} style={styles.coverImage} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <AuthorInfo author={article.author} date={article.publishedAt} />
        <View style={styles.stats}>
          <Text>阅读 {article.readCount}</Text>
          <Text>点赞 {article.likeCount}</Text>
          <Text>评论 {article.commentCount}</Text>
        </View>
        <RichTextRenderer content={article.content} />
        <View style={styles.tags}>
          {article.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <LikeButton
          count={article.likeCount}
          onPress={() => {
            /* 处理点赞 */
          }}
        />
        <ShareButton
          onPress={() => {
            /* 处理分享 */
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
  },
  tag: {
    color: '#2E7D32',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
