import React, { useState } from 'react';
import {
  IntegrationList,
  IntegrationConfig,
  IntegrationMonitor,
  IntegrationLogs,
  IntegrationAnalytics,
  IntegrationDocs
} from './components';
import { useIntegrationManagement } from '../../../hooks/useIntegrationManagement';

export const IntegrationManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const { integrations, operations } = useIntegrationManagement();

  return (
    <div className="integration-manager">
      <div className="integration-header">
        <h2>集成管理</h2>
        <div className="integration-status">
          <div className="status-item">
            <span>已启用</span>
            <strong>{integrations.stats.enabled}</strong>
          </div>
          <div className="status-item">
            <span>已禁用</span>
            <strong>{integrations.stats.disabled}</strong>
          </div>
          <div className="status-item">
            <span>出错</span>
            <strong>{integrations.stats.error}</strong>
          </div>
        </div>
      </div>

      <div className="integration-content">
        <div className="integration-sidebar">
          <IntegrationList 
            integrations={integrations.list}
            selectedId={selectedIntegration?.id}
            onSelect={setSelectedIntegration}
            onAction={operations.handleIntegrationAction}
          />
        </div>

        <div className="integration-main">
          <div className="tab-nav">
            <button onClick={() => setActiveTab('config')}>配置</button>
            <button onClick={() => setActiveTab('monitor')}>监控</button>
            <button onClick={() => setActiveTab('logs')}>日志</button>
            <button onClick={() => setActiveTab('analytics')}>分析</button>
            <button onClick={() => setActiveTab('docs')}>文档</button>
          </div>

          <div className="tab-content">
            {activeTab === 'config' && (
              <IntegrationConfig 
                integration={selectedIntegration}
                onSave={operations.handleConfigSave}
              />
            )}
            {activeTab === 'monitor' && (
              <IntegrationMonitor 
                integration={selectedIntegration}
                metrics={integrations.metrics}
                onAction={operations.handleMonitorAction}
              />
            )}
            {activeTab === 'logs' && (
              <IntegrationLogs 
                integration={selectedIntegration}
                logs={integrations.logs}
                onAction={operations.handleLogAction}
              />
            )}
            {activeTab === 'analytics' && (
              <IntegrationAnalytics 
                integration={selectedIntegration}
                analytics={integrations.analytics}
                onAction={operations.handleAnalyticsAction}
              />
            )}
            {activeTab === 'docs' && (
              <IntegrationDocs 
                integration={selectedIntegration}
                docs={integrations.docs}
                onAction={operations.handleDocsAction}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 