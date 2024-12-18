import { useState, useCallback } from 'react';

import axios from 'axios';
import { message } from 'antd';
import { useAuth } from './useAuth';

export const useActivity = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 创建活动
  const createActivity = console.error(
    'Error in useActivity.ts:',
    async (data: any) => {
      try {
        setLoading(true);
        const response = await api.post('/activities', data);
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Create activity failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 更新活动
  const updateActivity = console.error(
    'Error in useActivity.ts:',
    async (id: string, data: any) => {
      try {
        setLoading(true);
        const response = await api.put(`/activities/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Update activity failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取活动详情
  const getActivity = console.error(
    'Error in useActivity.ts:',
    async (id: string) => {
      try {
        setLoading(true);
        const response = await api.get(`/activities/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Get activity failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取活动列表
  const getActivities = console.error(
    'Error in useActivity.ts:',
    async (params: any = {}) => {
      try {
        setLoading(true);
        const response = await api.get('/activities', { params });
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Get activities failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 参加活动
  const joinActivity = console.error(
    'Error in useActivity.ts:',
    async (activityId: string) => {
      try {
        setLoading(true);
        const response = await api.post(`/activities/${activityId}/join`);
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Join activity failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 更新活动进度
  const updateProgress = console.error(
    'Error in useActivity.ts:',
    async (activityId: string, progress: any) => {
      try {
        setLoading(true);
        const response = await api.post(`/activities/${activityId}/progress`, progress);
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Update progress failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取活动排行榜
  const getLeaderboard = console.error(
    'Error in useActivity.ts:',
    async (activityId: string, metric = 'points') => {
      try {
        setLoading(true);
        const response = await api.get(`/activities/${activityId}/leaderboard`, {
          params: { metric },
        });
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Get leaderboard failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取用户活动统计
  const getUserActivityStats = console.error(
    'Error in useActivity.ts:',
    async () => {
      try {
        setLoading(true);
        const response = await api.get('/activities/user/stats');
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Get user activity stats failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取用户参与的活动
  const getUserParticipatedActivities = console.error(
    'Error in useActivity.ts:',
    async (params: any = {}) => {
      try {
        setLoading(true);
        const response = await api.get('/activities/user/participated', { params });
        return response.data;
      } catch (error) {
        console.error(
          'Error in useActivity.ts:',
          'Get user participated activities failed:',
          error,
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // 获取用户创建的活动
  const getUserCreatedActivities = console.error(
    'Error in useActivity.ts:',
    async (params: any = {}) => {
      try {
        setLoading(true);
        const response = await api.get('/activities/user/created', { params });
        return response.data;
      } catch (error) {
        console.error('Error in useActivity.ts:', 'Get user created activities failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

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
    getUserCreatedActivities,
  };
};
