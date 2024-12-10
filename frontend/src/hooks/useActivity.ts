import { useState, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useActivity = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // 创建活动
  const createActivity = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const response = await api.post('/activities', data);
      return response.data;
    } catch (error) {
      console.error('Create activity failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 更新活动
  const updateActivity = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const response = await api.put(`/activities/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update activity failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取活动详情
  const getActivity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get activity failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取活动列表
  const getActivities = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/activities', { params });
      return response.data;
    } catch (error) {
      console.error('Get activities failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 参加活动
  const joinActivity = useCallback(async (activityId: string) => {
    try {
      setLoading(true);
      const response = await api.post(`/activities/${activityId}/join`);
      return response.data;
    } catch (error) {
      console.error('Join activity failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 更新活动进度
  const updateProgress = useCallback(async (activityId: string, progress: any) => {
    try {
      setLoading(true);
      const response = await api.post(`/activities/${activityId}/progress`, progress);
      return response.data;
    } catch (error) {
      console.error('Update progress failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取活动排行榜
  const getLeaderboard = useCallback(async (activityId: string, metric: string = 'points') => {
    try {
      setLoading(true);
      const response = await api.get(`/activities/${activityId}/leaderboard`, {
        params: { metric }
      });
      return response.data;
    } catch (error) {
      console.error('Get leaderboard failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取用户活动统计
  const getUserActivityStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/activities/user/stats');
      return response.data;
    } catch (error) {
      console.error('Get user activity stats failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取用户参与的活动
  const getUserParticipatedActivities = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/activities/user/participated', { params });
      return response.data;
    } catch (error) {
      console.error('Get user participated activities failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // 获取用户创建的活动
  const getUserCreatedActivities = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/activities/user/created', { params });
      return response.data;
    } catch (error) {
      console.error('Get user created activities failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return {
    loading,
    createActivity,
    updateActivity,
    getActivity,
    getActivities,
    joinActivity,
    updateProgress,
    getLeaderboard,
    getUserActivityStats,
    getUserParticipatedActivities,
    getUserCreatedActivities
  };
}; 