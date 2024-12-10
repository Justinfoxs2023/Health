import React, { useState, useEffect } from 'react';
import { Card, Avatar, Space, Tag, Button, message, Divider } from 'antd';
import { LikeOutlined, StarOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { PostService } from '@/services/PostService';
import { Post } from '@/types/community';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';

interface PostDetailProps {
  postId: string;
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await PostService.getPostById(postId);
      setPost(response.data);
    } catch (error) {
      message.error(t('posts.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      await PostService.likePost(post.id);
      setPost(prev => prev ? {
        ...prev,
        metrics: {
          ...prev.metrics,
          likes: prev.metrics.likes + 1
        }
      } : null);
      message.success(t('posts.likeSuccess'));
    } catch (error) {
      message.error(t('posts.likeError'));
    }
  };

  const handleFavorite = async () => {
    if (!post) return;
    try {
      await PostService.favoritePost(post.id);
      message.success(t('posts.favoriteSuccess'));
    } catch (error) {
      message.error(t('posts.favoriteError'));
    }
  };

  const handleShare = async () => {
    if (!post) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success(t('posts.shareSuccess'));
    } catch (error) {
      message.error(t('posts.shareError'));
    }
  };

  const handleCommentSubmit = async (content: string) => {
    if (!post) return;
    try {
      await PostService.createComment(post.id, { content });
      message.success(t('comments.submitSuccess'));
      loadPost(); // 重新加载帖子和评论
    } catch (error) {
      message.error(t('comments.submitError'));
    }
  };

  if (!post) {
    return null;
  }

  return (
    <div className="post-detail">
      <Card
        loading={loading}
        actions={[
          <Button type="text" onClick={handleLike}>
            <Space>
              <LikeOutlined />
              {post.metrics.likes}
            </Space>
          </Button>,
          <Button type="text" onClick={handleFavorite}>
            <Space>
              <StarOutlined />
              {post.metrics.favorites}
            </Space>
          </Button>,
          <Button type="text" onClick={handleShare}>
            <Space>
              <ShareAltOutlined />
              {t('posts.share')}
            </Space>
          </Button>
        ]}
      >
        <Card.Meta
          avatar={<Avatar src={post.author.avatar} />}
          title={
            <Space>
              <span className="post-title">{post.title}</span>
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
                  addSuffix: true
                })}
              </span>
            </Space>
          }
        />
        <div className="post-content">
          {post.content}
        </div>
        {post.media?.map((media, index) => (
          <div key={index} className="post-media">
            {media.type === 'image' ? (
              <img src={media.url} alt={`post-media-${index}`} />
            ) : media.type === 'video' ? (
              <video src={media.url} controls />
            ) : null}
          </div>
        ))}
      </Card>

      <Divider orientation="left">{t('comments.title')}</Divider>
      
      <CommentForm onSubmit={handleCommentSubmit} />
      
      <CommentList postId={post.id} />
    </div>
  );
}; 