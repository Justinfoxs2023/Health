import React from 'react';

import { AuthorInfo } from '../AuthorInfo';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

interface IProps {
  /** article 的描述 */
  article: {
    id: string;
    title: string;
    summary: string;
    coverImage?: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    category: string;
    readCount: number;
    createdAt: string;
  };
  /** onPress 的描述 */
  onPress?: () => void;
}

export const ArticleCard: React.FC<IProps> = ({ article, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {article.coverImage && <Image source={{ uri: article.coverImage }} style={styles.cover} />}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {article.summary}
        </Text>
        <View style={styles.footer}>
          <AuthorInfo author={article.author} timestamp={article.createdAt} />
          <Text style={styles.readCount}>{article.readCount}阅读</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cover: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readCount: {
    fontSize: 12,
    color: '#999',
  },
});
