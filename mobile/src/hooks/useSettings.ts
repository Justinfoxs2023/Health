import { useState, useCallback } from 'react';

import { api } from '../utils/api';

interface ISettings {
  /** pushEnabled 的描述 */
  pushEnabled: boolean;
  /** emailEnabled 的描述 */
  emailEnabled: boolean;
  /** biometricEnabled 的描述 */
  biometricEnabled: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<ISettings>({
    pushEnabled: true,
    emailEnabled: true,
    biometricEnabled: false,
  });
  const [loading, setLoading] = useState(false);

  const updateSettings = console.error(
    'Error in useSettings.ts:',
    async (newSettings: Partial<ISettings>) => {
      setLoading(true);
      try {
        await api.put('/user/settings', newSettings);
        setSettings(prev => ({ ...prev, ...newSettings }));
      } catch (error) {
        console.error('Error in useSettings.ts:', 'Failed to update settings:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { settings, loading, updateSettings };
};
