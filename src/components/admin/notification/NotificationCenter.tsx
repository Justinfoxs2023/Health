import React, { useState } from 'react';

import {
  NotificationList,
  NotificationTemplate,
  NotificationChannel,
  NotificationRules,
  NotificationStats,
  NotificationSettings,
} from './components';
import { useNotificationManagement } from '../../../hooks/useNotificationManagement';

export 
const NotificationCenter: React.FC = () => {
  const [activeSection, setActiveSection] = useState('list');
  const { notifications, templates, channels, operations } = useNotificationManagement();

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2></h2>
        <div className="notification-summary">
          <div className="summary-item">
            <span></span>
            <strong>{notificationsunread}</strong>
          </div>
          <div className="summary-item">
            <span></span>
            <strong>{notificationspending}</strong>
          </div>
          <div className="summary-item">
            <span></span>
            <strong>{notificationstodaySent}</strong>
          </div>
        </div>
      </div>

      <div className="notification-nav">
        <button onClick={ => setActiveSectionlist}></button>
        <button onClick={ => setActiveSectiontemplate}></button>
        <button onClick={ => setActiveSectionchannel}></button>
        <button onClick={ => setActiveSectionrules}></button>
        <button onClick={ => setActiveSectionstats}></button>
        <button onClick={ => setActiveSectionsettings}></button>
      </div>

      <div className="notification-content">
        {activeSection === 'list' && (
          <NotificationList
            notifications={notifications.list}
            onAction={operations.handleNotificationAction}
          />
        )}
        {activeSection === 'template' && (
          <NotificationTemplate templates={templates} onAction={operations.handleTemplateAction} />
        )}
        {activeSection === 'channel' && (
          <NotificationChannel channels={channels} onAction={operations.handleChannelAction} />
        )}
        {activeSection === 'rules' && (
          <NotificationRules rules={notifications.rules} onAction={operations.handleRuleAction} />
        )}
        {activeSection === 'stats' && (
          <NotificationStats stats={notifications.stats} onAction={operations.handleStatsAction} />
        )}
        {activeSection === 'settings' && (
          <NotificationSettings
            settings={notifications.settings}
            onAction={operations.handleSettingsAction}
          />
        )}
      </div>
    </div>
  );
};
