import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPostDetail, likePost, createComment } from '../../api/community';
import { LoadingSpinner, Icon, VideoPlayer, AlertDialog } from '../../components';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

interface PostDetail {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  media: {
    type: 'image' | 'video';
    uri: string;
    thumbnailUri?: string;
  }[];
  likes: number;
  comments: Comment[];
  tags: string[];
  createdAt: string;
  type: 'experience' | 'question' | 'challenge';
  liked: boolean;
}

export const PostDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [comment, setComment] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const { data: post, isLoading, refetch } = useQuery<PostDetail>(
    ['postDetail', id],
    () => getPostDetail(id)
  );

  const likeMutation = useMutation(likePost, {
    onSuccess: () => refetch()
  });

  const commentMutation = useMutation(createComment, {
    onSuccess: () => {
      setComment('');
      refetch();
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '评论失败，请重试');
      setShowAlert(true);
    }
  });

  const handleLike = () => {
    likeMutation.mutate(id);
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      setAlertMessage('请输入评论内容');
      setShowAlert(true);
      return;
    }
    commentMutation.mutate({ postId: id, content: comment });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image source={{ uri: post?.userAvatar }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{post?.userName}</Text>
              <Text style={styles.postTime}>
                {format(new Date(post?.createdAt || ''), 'MM月dd日 HH:mm', { locale: zhCN })}
              </Text>
            </View>
          </View>
          {post?.type === 'experience' && (
            <View style={[styles.tag, styles.experienceTag]}>
              <Text style={styles.tagText}>经验分享</Text>
            </View>
          )}
          {post?.type === 'question' && (
            <View style={[styles.tag, styles.questionTag]}>
              <Text style={styles.tagText}>健康问答</Text>
            </View>
          )}
          {post?.type === 'challenge' && (
            <View style={[styles.tag, styles.challengeTag]}>
              <Text style={styles.tagText}>团队挑战</Text>
            </View>
          )}
        </View>

        <Text style={styles.content}>{post?.content}</Text>

        {post?.media && post.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {post.media.map((item, index) => (
              item.type === 'video' ? (
                <VideoPlayer
                  key={index}
                  url={item.uri}
                  style={styles.video}
                  thumbnailUrl={item.thumbnailUri}
                />
              ) : (
                <Image
                  key={index}
                  source={{ uri: item.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Icon
              name={post?.liked ? 'heart' : 'heart-outline'}
              size={24}
              color={post?.liked ? '#F44336' : '#666'}
            />
            <Text style={styles.actionText}>{post?.likes || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="message-circle" size={24} color="#666" />
            <Text style={styles.actionText}>{post?.comments.length || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share-2" size={24} color="#666" />
            <Text style={styles.actionText}>分享</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>评论 ({post?.comments.length || 0})</Text>
          {post?.comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <Text style={styles.commentUserName}>{comment.userName}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <View style={styles.commentFooter}>
                  <Text style={styles.commentTime}>
                    {format(new Date(comment.createdAt), 'MM月dd日 HH:mm', { locale: zhCN })}
                  </Text>
                  <TouchableOpacity style={styles.commentLike}>
                    <Icon
                      name={comment.liked ? 'heart' : 'heart-outline'}
                      size={16}
                      color={comment.liked ? '#F44336' : '#999'}
                    />
                    <Text style={styles.commentLikeCount}>{comment.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.commentInput}>
        <TextInput
          style={styles.input}
          placeholder="写下你的评论..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]}
          onPress={handleSubmitComment}
          disabled={!comment.trim() || commentMutation.isLoading}
        >
          <Text style={styles.sendButtonText}>发送</Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />

      {commentMutation.isLoading && <LoadingSpinner />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  postTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  experienceTag: {
    backgroundColor: '#E8F5E9'
  },
  questionTag: {
    backgroundColor: '#E3F2FD'
  },
  challengeTag: {
    backgroundColor: '#FFF3E0'
  },
  tagText: {
    fontSize: 12,
    color: '#2E7D32'
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    padding: 15
  },
  mediaContainer: {
    padding: 15
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 10
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  commentsSection: {
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10
  },
  commentContent: {
    flex: 1
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentTime: {
    fontSize: 12,
    color: '#999'
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentLikeCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 14,
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
}); 