import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from 'react-query';
import { getQuestionDetails } from '../../api/nutrition';
import { LoadingSpinner, UserInfo, Tag, ImageViewer } from '../../components';
import { useAuth } from '../../hooks/useAuth';

export const QuestionDetailScreen = ({ route }) => {
  const { currentUser } = useAuth();
  const { id } = route.params;
  
  const { data, isLoading } = useQuery(
    ['questionDetails', id],
    () => getQuestionDetails(id)
  );

  if (isLoading) return <LoadingSpinner />;

  const question = data?.data;

  const handleAcceptAnswer = async (answerId: string) => {
    // 实现采纳回答的逻辑
  };

  const getStatusType = (status: string) => {
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

  const renderAnswer = (answer) => (
    <View style={styles.answerCard} key={answer._id}>
      <View style={styles.answerHeader}>
        <UserInfo
          user={answer.nutritionistId}
          showRole
          timestamp={answer.createdAt}
        />
        {answer.isAccepted && (
          <Tag text="已采纳" type="success" />
        )}
      </View>
      <Text style={styles.answerContent}>{answer.content}</Text>
      {answer.images?.length > 0 && (
        <View style={styles.imageGrid}>
          {answer.images.map((image, index) => (
            <ImageViewer key={index} uri={image} />
          ))}
        </View>
      )}
      <View style={styles.answerFooter}>
        <TouchableOpacity style={styles.likeButton}>
          <Text>点赞 {answer.likes}</Text>
        </TouchableOpacity>
        {question.userId === currentUser?.id && !question.answers.find(a => a.isAccepted) && (
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={() => handleAcceptAnswer(answer._id)}
          >
            <Text style={styles.acceptButtonText}>采纳回答</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.questionCard}>
        <View style={styles.header}>
          <Text style={styles.title}>{question.title}</Text>
          <Tag text={question.status} type={getStatusType(question.status)} />
        </View>
        <UserInfo
          user={question.userId}
          timestamp={question.createdAt}
        />
        <Text style={styles.content}>{question.content}</Text>
        {question.images?.length > 0 && (
          <View style={styles.imageGrid}>
            {question.images.map((image, index) => (
              <ImageViewer key={index} uri={image} />
            ))}
          </View>
        )}
        <View style={styles.tags}>
          {question.tags.map((tag, index) => (
            <Tag key={index} text={tag} type="default" small />
          ))}
        </View>
        <View style={styles.stats}>
          <Text>浏览 {question.viewCount}</Text>
          <Text>回答 {question.answers.length}</Text>
        </View>
      </View>

      <View style={styles.answersSection}>
        <Text style={styles.sectionTitle}>全部回答</Text>
        {question.answers.map(renderAnswer)}
      </View>

      {currentUser?.role === 'nutritionist' && question.status !== '已关闭' && (
        <TouchableOpacity 
          style={styles.answerButton}
          onPress={() => navigation.navigate('AnswerQuestion', { questionId: id })}
        >
          <Text style={styles.answerButtonText}>写回答</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  questionCard: {
    padding: 15,
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 15
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10
  },
  stats: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  answersSection: {
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  answerCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  answerContent: {
    fontSize: 15,
    lineHeight: 22
  },
  answerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  likeButton: {
    padding: 8
  },
  acceptButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14
  },
  answerButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5
  },
  answerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 