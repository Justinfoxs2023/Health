import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useUserInteraction } from '../../hooks/useUserInteraction';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialIsFollowing = false,
  onFollowChange,
  size = 'middle',
  className,
  style
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { followUser, unfollowUser, checkFollowStatus } = useUserInteraction();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const status = await checkFollowStatus(userId);
        setIsFollowing(status);
        setError(null);
      } catch (err) {
        setError('检查关注���态失败');
        console.error('Failed to check follow status:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!initialIsFollowing) {
      checkStatus();
    }
  }, [userId, initialIsFollowing, checkFollowStatus]);

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isFollowing) {
        await unfollowUser(userId);
        message.success('已取消关注');
      } else {
        await followUser(userId);
        message.success('关注成功');
      }

      setIsFollowing(!isFollowing);
      onFollowChange?.(!isFollowing);
    } catch (err) {
      const errorMessage = isFollowing ? '取消关注失败' : '关注失败';
      setError(errorMessage);
      message.error(`${errorMessage}，请重试`);
      console.error('Follow operation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const buttonType = isFollowing ? 'default' : 'primary';
  const buttonText = isFollowing ? '已关注' : '关注';
  const icon = loading ? <LoadingOutlined /> : <UserOutlined />;

  return (
    <Button
      type={buttonType}
      icon={icon}
      onClick={handleClick}
      loading={loading}
      size={size}
      className={className}
      style={style}
      disabled={!!error}
      title={error || undefined}
    >
      {buttonText}
    </Button>
  );
}; 