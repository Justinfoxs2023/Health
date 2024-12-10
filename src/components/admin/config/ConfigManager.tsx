import React, { useState } from 'react';
import {
  SystemConfig,
  FeatureConfig,
  IntegrationConfig,
  NotificationConfig,
  StorageConfig,
  PerformanceConfig
} from './components';
import { useConfigManagement } from '../../../hooks/useConfigManagement';

export const ConfigManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const { config, updateConfig, loading } = useConfigManagement();

  const handleConfigUpdate = async (section: string, data: any) => {
    try {
      await updateConfig(section, data);
    } catch (error) {
      console.error('配置更新失败:', error);
    }
  };

  return (
    <div className="config-manager">
      <div className="config-header">
        <h2>系统配置</h2>
        <div className="config-actions">
          <button onClick={() => handleConfigUpdate('all', config)}>
            保存所有更改
          </button>
          <button onClick={() => window.location.reload()}>
            重新加载配置
          </button>
        </div>
      </div>

      <div className="config-nav">
        <button 
          className={activeTab === 'system' ? 'active' : ''}
          onClick={() => setActiveTab('system')}
        >
          系统设置
        </button>
        <button 
          className={activeTab === 'features' ? 'active' : ''}
          onClick={() => setActiveTab('features')}
        >
          功能配置
        </button>
        <button 
          className={activeTab === 'integrations' ? 'active' : ''}
          onClick={() => setActiveTab('integrations')}
        >
          集成配置
        </button>
        <button 
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          通知配置
        </button>
        <button 
          className={activeTab === 'storage' ? 'active' : ''}
          onClick={() => setActiveTab('storage')}
        >
          存储配置
        </button>
        <button 
          className={activeTab === 'performance' ? 'active' : ''}
          onClick={() => setActiveTab('performance')}
        >
          性能配置
        </button>
      </div>

      <div className="config-content">
        {loading ? (
          <div>加载中...</div>
        ) : (
          <>
            {activeTab === 'system' && (
              <SystemConfig 
                config={config.system}
                onChange={data => handleConfigUpdate('system', data)}
              />
            )}
            {activeTab === 'features' && (
              <FeatureConfig 
                config={config.features}
                onChange={data => handleConfigUpdate('features', data)}
              />
            )}
            {activeTab === 'integrations' && (
              <IntegrationConfig 
                config={config.integrations}
                onChange={data => handleConfigUpdate('integrations', data)}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationConfig 
                config={config.notifications}
                onChange={data => handleConfigUpdate('notifications', data)}
              />
            )}
            {activeTab === 'storage' && (
              <StorageConfig 
                config={config.storage}
                onChange={data => handleConfigUpdate('storage', data)}
              />
            )}
            {activeTab === 'performance' && (
              <PerformanceConfig 
                config={config.performance}
                onChange={data => handleConfigUpdate('performance', data)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}; 