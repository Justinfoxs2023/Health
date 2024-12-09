import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserInfo } from '../UserInfo';
import { Tag } from '../Tag';

interface Props {
  question: {
    id: string;
    title: string;
    content: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    tags: string[];
    answerCount: number;
    viewCount: number;
    createdAt: string;
  };
  onPress?: () => void;
}

export const QuestionCard: React.FC<Props> = ({ question, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title} numberOfLines={2}>
        {question.title}
      </Text>
      <Text style={styles.content} numberOfLines={2}>
        {question.content}
      </Text>
      <View style={styles.tags}>
        {question.tags.map((tag, index) => (
          <Tag key={index} text={tag} type="default" small />
        ))}
      </View>
      <View style={styles.footer}>
        <UserInfo user={question.user} timestamp={question.createdAt} />
        <View style={styles.stats}>
          <Text style={styles.stat}>{question.answerCount} 回答</Text>
          <Text style={styles.stat}>{question.viewCount} 浏览</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stats: {
    flexDirection: 'row'
  },
  stat: {
    fontSize: 12,
    color: '#999',
    marginLeft: 12
  }
}); 