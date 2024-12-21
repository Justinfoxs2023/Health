import React, { useState, useEffect } from 'react';

import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { List, Card, Avatar, Space, Tag, Button, message } from 'antd';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { zhCN } from 'date-fns/locale';

import { Post } from '@/types/community';
import { PostService } from '@/services/PostService';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const PAGE_SIZE = 10;

export const PostList: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = async (page: number) => {
    try {
      setLoading(true);
      const response = await PostService.getPosts({
        page,
        pageSize: PAGE_SIZE,
        status: 'published',
      });

      const newPosts = response.data;
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(newPosts.length === PAGE_SIZE);
    } catch (error) {
      message.error(t('posts.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const { containerRef } = useInfiniteScroll(loadMorePosts, {
    threshold: 0.8,
    hasMore,
  });

  const handleLike = async (postId: string) => {
    try {
      await PostService.likePost(postId);
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, metrics: { ...post.metrics, likes: post.metrics.likes + 1 } }
            : post,
        ),
      );
    } catch (error) {
      message.error(t('posts.likeError'));
    }
  };

  const handleFavorite = async (postId: string) => {
    try {
      await PostService.favoritePost(postId);
      message.success(t('posts.favoriteSuccess'));
    } catch (error) {
      message.error(t('posts.favoriteError'));
    }
  };

  return (
    <div ref={containerRef} className="post-list">
      <List
        itemLayout="vertical"
        size="large"
        dataSource={posts}
        loading={loading}
        renderItem={post => (
          <List.Item
            key={post.id}
            actions={[
              <Space onClick={() => handleLike(post.id)}>
                <LikeOutlined />
                {post.metrics.likes}
              </Space>,
              <Space>
                <MessageOutlined />
                {post.metrics.comments}
              </Space>,
              <Space onClick={() => handleFavorite(post.id)}>
                <StarOutlined />
                {post.metrics.favorites}
              </Space>,
            ]}
            extra={
              post.media?.length > 0 && <img width={272} alt="post-image" src={post.media[0].url} />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={post.author.avatar} />}
              title={
                <Space>
                  <a href={`/posts/${post.id}`}>{post.title}</a>
                  {post.tags?.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              }
              description={
                <Space>
                  <span>{post.author.username}</span>
                  <span>
                    {formatDistance(new Date(post.created_at), new Date(), {
                      locale: zhCN,
                      addSuffix: true,
                    })}
                  </span>
                </Space>
              }
            />
            <div className="post-content">{post.content}</div>
          </List.Item>
        )}
      />
    </div>
  );
};
