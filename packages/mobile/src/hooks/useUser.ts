import { useState, useCallback } from 'react';

import { api } from '../utils/api';
import { useAuth } from './useAuth';

export interface IUser {
  /** id 的描述 */
  id: string;
  /** username 的描述 */
  username: string;
  /** email 的描述 */
  email: string;
  /** avatar 的描述 */
  avatar?: string;
  /** roles 的描述 */
  roles: string[];
}

export const useUser = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const refresh = console.error(
    'Error in useUser.ts:',
    async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await api.get('/user/profile');
        setUser(response.data.data);
      } catch (error) {
        console.error('Error in useUser.ts:', 'Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateProfile = console.error(
    'Error in useUser.ts:',
    async (data: Partial<IUser>) => {
      setLoading(true);
      try {
        const response = await api.put('/user/profile', data);
        setUser(response.data.data);
      } catch (error) {
        console.error('Error in useUser.ts:', 'Failed to update profile:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const uploadAvatar = console.error(
    'Error in useUser.ts:',
    async (file: any) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await api.post('/user/avatar', formData);
        setUser(prev => (prev ? { ...prev, avatar: response.data.data.url } : null));
      } catch (error) {
        console.error('Error in useUser.ts:', 'Failed to upload avatar:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { user, loading, refresh, updateProfile, uploadAvatar };
};
