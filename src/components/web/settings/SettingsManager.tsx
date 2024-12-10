import React, { useState, useEffect } from 'react';
import { 
  ProfileSettings,
  NotificationSettings,
  PrivacySettings,
  IntegrationSettings 
} from './sections';
import { useSettings } from '../../../hooks/useSettings';

export const SettingsManager: React.FC<{
  userId: string;
  config: SettingsConfig;
}> = ({ userId, config }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const { settings, updateSettings, loading } = useSettings(userId);

  const handleSave = async (section: string, data: any) => {
    try {
      await updateSettings(section, data);
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  };

  const renderSection = () => {
    if (loading) return <div>加载中...</div>;

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
            key={section.id}
            className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.name}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {renderSection()}
      </div>
    </div>
  );
}; 