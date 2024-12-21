import { useState, useCallback } from 'react';

import axios from 'axios';
import { message } from 'antd';
import { useAuth } from './useAuth';

export const useUserInteraction = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 关注用户
  const followUser = console.error(
    'Error in useUserInteraction.ts:',
    async (userId: string) => {
      try {
        setLoading(true);
        const response = await api.post(`/user-interaction/follow/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Follow user failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 取消关注
  const unfollowUser = console.error(
    'Error in useUserInteraction.ts:',
    async (userId: string) => {
      try {
        setLoading(true);
        const response = await api.delete(`/user-interaction/follow/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Unfollow user failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 检查关注状态
  const checkFollowStatus = console.error(
    'Error in useUserInteraction.ts:',
    async (userId: string) => {
      try {
        const response = await api.get(`/user-interaction/follow-status/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Check follow status failed:', error);
        throw error;
      }
    },
    [api],
  );

  // 获取关注列表
  const getFollowings = console.error(
    'Error in useUserInteraction.ts:',
    async (page = 1, limit = 20) => {
      try {
        setLoading(true);
        const response = await api.get('/user-interaction/following', {
          params: { page, limit },
        });
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Get followings failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取粉丝列表
  const getFollowers = console.error(
    'Error in useUserInteraction.ts:',
    async (page = 1, limit = 20) => {
      try {
        setLoading(true);
        const response = await api.get('/user-interaction/followers', {
          params: { page, limit },
        });
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Get followers failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 添加收藏
  const addFavorite = console.error(
    'Error in useUserInteraction.ts:',
    async (data: any) => {
      try {
        setLoading(true);
        const response = await api.post('/user-interaction/favorite', data);
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Add favorite failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 取消收藏
  const removeFavorite = console.error(
    'Error in useUserInteraction.ts:',
    async (favoriteId: string) => {
      try {
        setLoading(true);
        const response = await api.delete(`/user-interaction/favorite/${favoriteId}`);
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Remove favorite failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取收藏列表
  const getFavorites = console.error(
    'Error in useUserInteraction.ts:',
    async (folder?: string, page = 1, limit = 20) => {
      try {
        setLoading(true);
        const response = await api.get('/user-interaction/favorites', {
          params: { folder, page, limit },
        });
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Get favorites failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取用户动态时间线
  const getTimeline = console.error(
    'Error in useUserInteraction.ts:',
    async (page = 1, limit = 20) => {
      try {
        setLoading(true);
        const response = await api.get('/user-interaction/timeline', {
          params: { page, limit },
        });
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Get timeline failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取互动统计
  const getInteractionStats = console.error(
    'Error in useUserInteraction.ts:',
    async () => {
      try {
        const response = await api.get('/user-interaction/stats');
        return response.data;
      } catch (error) {
        console.error('Error in useUserInteraction.ts:', 'Get interaction stats failed:', error);
        throw error;
      }
    },
    [api],
  );

  return {
    loading,
    followUser,
    unfollowUser,
    checkFollowStatus,
    getFollowings,
    getFollowers,
    addFavorite,
    removeFavorite,
    getFavorites,
    getTimeline,
    getInteractionStats,
  };
};
