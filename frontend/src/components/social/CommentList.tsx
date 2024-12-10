import React, { useState, useEffect } from 'react';
import { List, Comment, Avatar, Tooltip, message } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CommentForm } from './CommentForm';
import { PostService } from '@/services/PostService';
import { Comment as CommentType } from '@/types/community';

interface CommentListProps {
  postId: string;
  comments: CommentType[];
  onCommentAdded?: () => void;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  comments,
  onCommentAdded
}) => {
  const { t } = useTranslation();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLikeComment = async (commentId: string) => {
    try {
      await PostService.likeComment(commentId);
      message.success(t('comments.likeSuccess'));
    } catch (error) {
      message.error(t('comments.likeError'));
    }
  };

  const handleReply = async (content: string) => {
    if (!replyTo) return;
    
    try {
      setLoading(true);
      await PostService.createComment(postId, {
        content,
        parent_id: replyTo
      });
      setReplyTo(null);
      onCommentAdded?.();
      message.success(t('comments.replySuccess'));
    } catch (error) {
      message.error(t('comments.replyError'));
    } finally {
      setLoading(false);
    }
  };

  const renderCommentActions = (comment: CommentType) => [
    <Tooltip key="like" title={t('comments.like')}>
      <span onClick={() => handleLikeComment(comment.id)}>
        {comment.liked ? <LikeFilled /> : <LikeOutlined />}
        <span className="comment-action">{comment.metrics.likes}</span>
      </span>
    </Tooltip>,
    <span
      key="reply"
      onClick={() => setReplyTo(comment.id)}
    >
      {t('comments.reply')}
    </span>
  ];

  return (
    <List
      className="comment-list"
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={comment => (
        <Comment
          actions={renderCommentActions(comment)}
          author={comment.author.username}
          avatar={<Avatar src={comment.author.avatar} alt={comment.author.username} />}
          content={comment.content}
          datetime={
            <Tooltip title={new Date(comment.created_at).toLocaleString()}>
              <span>
                {formatDistance(new Date(comment.created_at), new Date(), {
                  locale: zhCN,
                  addSuffix: true
                })}
              </span>
            </Tooltip>
          }
        >
          {comment.replies?.map(reply => (
            <Comment
              key={reply.id}
              actions={renderCommentActions(reply)}
              author={reply.author.username}
              avatar={<Avatar src={reply.author.avatar} alt={reply.author.username} />}
              content={reply.content}
              datetime={
                <Tooltip title={new Date(reply.created_at).toLocaleString()}>
                  <span>
                    {formatDistance(new Date(reply.created_at), new Date(), {
                      locale: zhCN,
                      addSuffix: true
                    })}
                  </span>
                </Tooltip>
              }
            />
          ))}
          {replyTo === comment.id && (
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setReplyTo(null)}
              placeholder={t('comments.replyPlaceholder', {
                username: comment.author.username
              })}
            />
          )}
        </Comment>
      )}
    />
  );
}; 