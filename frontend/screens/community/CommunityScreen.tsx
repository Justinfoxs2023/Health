import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../api/community';
import { LoadingSpinner, Icon } from '../../components';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  type: 'experience' | 'question' | 'challenge';
}

export const CommunityScreen = ({ navigation }) => {
  const { data: posts, isLoading } = useQuery<Post[]>('communityPosts', getPosts);
  const [selectedTab, setSelectedTab] = React.useState<'all' | 'experience' | 'question' | 'challenge'>('all');

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'experience', label: '经验分享' },
    { key: 'question', label: '健康问答' },
    { key: 'challenge', label: '团队挑战' }
  ];

  const filteredPosts = posts?.filter(post => 
    selectedTab === 'all' || post.type === selectedTab
  );

  const renderPost = ({ item: post }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { id: post.id })}
    >
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.postTime}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {post.type === 'experience' && (
          <View style={[styles.tag, styles.experienceTag]}>
            <Text style={styles.tagText}>经验分享</Text>
          </View>
        )}
        {post.type === 'question' && (
          <View style={[styles.tag, styles.questionTag]}>
            <Text style={styles.tagText}>健康问答</Text>
          </View>
        )}
        {post.type === 'challenge' && (
          <View style={[styles.tag, styles.challengeTag]}>
            <Text style={styles.tagText}>团队挑战</Text>
          </View>
        )}
      </View>

      <Text style={styles.content} numberOfLines={3}>{post.content}</Text>

      {post.images && post.images.length > 0 && (
        <View style={styles.imageGrid}>
          {post.images.slice(0, 3).map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.postImage} />
          ))}
        </View>
      )}

      <View style={styles.postFooter}>
        <View style={styles.footerItem}>
          <Icon name="heart" size={16} color="#666" />
          <Text style={styles.footerText}>{post.likes}</Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="message-circle" size={16} color="#666" />
          <Text style={styles.footerText}>{post.comments}</Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="share-2" size={16} color="#666" />
          <Text style={styles.footerText}>分享</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>健康社区</Text>
        <TouchableOpacity 
          style={styles.postButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.postButtonText}>发帖</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText
            ]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0'
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center'
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32'
  },
  tabText: {
    fontSize: 14,
    color: '#666'
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  list: {
    padding: 15
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
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
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10
  },
  imageGrid: {
    flexDirection: 'row',
    marginBottom: 10
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
    paddingTop: 10
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  separator: {
    height: 10
  }
}); 