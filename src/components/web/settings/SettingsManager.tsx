import React, { useState, useEffect } from 'react';

import {
  ProfileSettings,
  NotificationSettings,
  PrivacySettings,
  IntegrationSettings,
} from './sections';
import { useSettings } from '../../../hooks/useSettings';

expor
t const SettingsManager: React.FC<{
  userId: string;
  config: SettingsConfig;
}> = ({ userId, config }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const { settings, updateSettings, loading } = useSettings(userId);

  const handleSave = async (section: string, data: any) => {
    try {
      await updateSettings(section, data);
    } catch (error) {
      console.error('Error in SettingsManager.tsx:', '保存设置失败:', error);
    }
  };

  const renderSection = () => {
    if (loading) return <div></div>;

    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSettings
            data={settings.profile}
            onSave={data => handleSave('profile', data)}
            config={config.profile}
          />
        );
      case 'notification':
        return (
          <NotificationSettings
            data={settings.notification}
            onSave={data => handleSave('notification', data)}
            config={config.notification}
          />
        );
      case 'privacy':
        return (
          <PrivacySettings
            data={settings.privacy}
            onSave={data => handleSave('privacy', data)}
            config={config.privacy}
          />
        );
      case 'integration':
        return (
          <IntegrationSettings
            data={settings.integration}
            onSave={data => handleSave('integration', data)}
            config={config.integration}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-manager">
      <div className="settings-nav">
        {config.sections.map(section => (
          <button
            key={sectionid}
            className={navitem {activeSection === sectionid  active  }}
            onClick={ => setActiveSectionsectionid}
          >
            {sectionname}
          </button>
        ))}
      </div>

      <div className="settingscontent">{renderSection}</div>
    </div>
  );
};
