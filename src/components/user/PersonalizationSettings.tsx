import React, { useState } from 'react';

import axios from 'axios';

const PersonalizationSettings: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
    updateUserSettings({ theme: event.target.value, notifications });
  };

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications(event.target.checked);
    updateUserSettings({ theme, notifications: event.target.checked });
  };

  const updateUserSettings = async (settings: { theme: string; notifications: boolean }) => {
    try {
      await axios.post('/api/user/settings', settings);
    } catch (error) {
      console.error('Error in PersonalizationSettings.tsx:', '更新设置失败', error);
    }
  };

  return (
    <div>
      <h2></h2>
      <div>
        <label></label>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light"></option>
          <option value="dark"></option>
        </select>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={notifications} onChange={handleNotificationChange} />
          启用通知
        </label>
      </div>
    </div>
  );
};

export default PersonalizationSettings;
