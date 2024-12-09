import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { api } from '../utils/api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: string[];
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const refresh = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await api.get('/user/profile');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setLoading(true);
    try {
      const response = await api.put('/user/profile', data);
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/user/avatar', formData);
      setUser(prev => prev ? { ...prev, avatar: response.data.data.url } : null);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, refresh, updateProfile, uploadAvatar };
}; 