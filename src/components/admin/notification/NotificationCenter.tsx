import React, { useState } from 'react';
import {
  NotificationList,
  NotificationTemplate,
  NotificationChannel,
  NotificationRules,
  NotificationStats,
  NotificationSettings
} from './components';
import { useNotificationManagement } from '../../../hooks/useNotificationManagement';

export const NotificationCenter: React.FC = () => {
  const [activeSection, setActiveSection] = useState('list');
  const { notifications, templates, channels, operations } = useNotificationManagement();

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>消息通知中心</h2>
        <div className="notification-summary">
          <div className="summary-item">
            <span>未读消息</span>
            <strong>{notifications.unread}</strong>
          </div>
          <div className="summary-item">
            <span>待处理</span>
            <strong>{notifications.pending}</strong>
          </div>
          <div className="summary-item">
            <span>今日发送</span>
            <strong>{notifications.todaySent}</strong>
          </div>
        </div>
      </div>

      <div className="notification-nav">
        <button onClick={() => setActiveSection('list')}>消息列表</button>
        <button onClick={() => setActiveSection('template')}>通知模板</button>
        <button onClick={() => setActiveSection('channel')}>通知渠道</button>
        <button onClick={() => setActiveSection('rules')}>通知规则</button>
        <button onClick={() => setActiveSection('stats')}>通知统计</button>
        <button onClick={() => setActiveSection('settings')}>通知设置</button>
      </div>

      <div className="notification-content">
        {activeSection === 'list' && (
          <NotificationList 
            notifications={notifications.list}
            onAction={operations.handleNotificationAction}
          />
        )}
        {activeSection === 'template' && (
          <NotificationTemplate 
            templates={templates}
            onAction={operations.handleTemplateAction}
          />
        )}
        {activeSection === 'channel' && (
          <NotificationChannel 
            channels={channels}
            onAction={operations.handleChannelAction}
          />
        )}
        {activeSection === 'rules' && (
          <NotificationRules 
            rules={notifications.rules}
            onAction={operations.handleRuleAction}
          />
        )}
        {activeSection === 'stats' && (
          <NotificationStats 
            stats={notifications.stats}
            onAction={operations.handleStatsAction}
          />
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