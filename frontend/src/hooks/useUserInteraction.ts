import { useState, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useUserInteraction = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // 关注用户
  const followUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const response = await api.post(`/user-interaction/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Follow user failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 取消关注
  const unfollowUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/user-interaction/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Unfollow user failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 检查关注状态
  const checkFollowStatus = useCallback(async (userId: string) => {
    try {
      const response = await api.get(`/user-interaction/follow-status/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Check follow status failed:', error);
      throw error;
    }
  }, [api]);

  // 获取关注列表
  const getFollowings = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await api.get('/user-interaction/following', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get followings failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取粉丝列表
  const getFollowers = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await api.get('/user-interaction/followers', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get followers failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 添加收藏
  const addFavorite = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const response = await api.post('/user-interaction/favorite', data);
      return response.data;
    } catch (error) {
      console.error('Add favorite failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 取消收藏
  const removeFavorite = useCallback(async (favoriteId: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/user-interaction/favorite/${favoriteId}`);
      return response.data;
    } catch (error) {
      console.error('Remove favorite failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取收藏列表
  const getFavorites = useCallback(async (folder?: string, page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await api.get('/user-interaction/favorites', {
        params: { folder, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get favorites failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取用户动态时间线
  const getTimeline = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await api.get('/user-interaction/timeline', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get timeline failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取互动统计
  const getInteractionStats = useCallback(async () => {
    try {
      const response = await api.get('/user-interaction/stats');
      return response.data;
    } catch (error) {
      console.error('Get interaction stats failed:', error);
      throw error;
    }
  }, [api]);

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
    getInteractionStats
  };
}; 