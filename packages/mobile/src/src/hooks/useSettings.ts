import { useState, useCallback } from 'react';
import { api } from '../utils/api';

interface Settings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  biometricEnabled: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    pushEnabled: true,
    emailEnabled: true,
    biometricEnabled: false,
  });
  const [loading, setLoading] = useState(false);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    setLoading(true);
    try {
      await api.put('/user/settings', newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { settings, loading, updateSettings };
}; 