import React, { useState } from 'react';

import {
  SystemConfig,
  FeatureConfig,
  IntegrationConfig,
  NotificationConfig,
  StorageConfig,
  PerformanceConfig,
} from './components';
import { useConfigManagement } from '../../../hooks/useConfigManagement';

export 
const ConfigManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const { config, updateConfig, loading } = useConfigManagement();

  const handleConfigUpdate = async (section: string, data: any) => {
    try {
      await updateConfig(section, data);
    } catch (error) {
      console.error('Error in ConfigManager.tsx:', '配置更新失败:', error);
    }
  };

  return (
    <div className="config-manager">
      <div className="config-header">
        <h2></h2>
        <div className="config-actions">
          <button onClick={ => handleConfigUpdateall config}></button>
          <button onClick={ => windowlocationreload}></button>
        </div>
      </div>

      <div className="config-nav">
        <button
          className={activeTab === system  active  }
          onClick={ => setActiveTabsystem}
        >
          
        </button>
        <button
          className={activeTab === features  active  }
          onClick={ => setActiveTabfeatures}
        >
          
        </button>
        <button
          className={activeTab === integrations  active  }
          onClick={ => setActiveTabintegrations}
        >
          
        </button>
        <button
          className={activeTab === notifications  active  }
          onClick={ => setActiveTabnotifications}
        >
          
        </button>
        <button
          className={activeTab === storage  active  }
          onClick={ => setActiveTabstorage}
        >
          
        </button>
        <button
          className={activeTab === performance  active  }
          onClick={ => setActiveTabperformance}
        >
          
        </button>
      </div>

      <div className="config-content">
        {loading ? (
          <div></div>
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
