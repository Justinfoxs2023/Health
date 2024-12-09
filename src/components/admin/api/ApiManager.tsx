import React, { useState } from 'react';
import {
  ApiDashboard,
  ApiDocumentation,
  ApiMonitor,
  ApiTesting,
  ApiVersioning,
  ApiSecurity
} from './components';
import { useApiManagement } from '../../../hooks/useApiManagement';

export const ApiManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { apiData, operations, loading } = useApiManagement();

  return (
    <div className="api-manager">
      <div className="api-header">
        <h2>API管理</h2>
        <div className="api-status">
          <span className={`status ${apiData.status.toLowerCase()}`}>
            {apiData.status}
          </span>
          <span className="uptime">
            运行时间: {apiData.uptime}
          </span>
        </div>
      </div>

      <div className="api-nav">
        <button 
          className={activeSection === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveSection('dashboard')}
        >
          API概览
        </button>
        <button 
          className={activeSection === 'documentation' ? 'active' : ''}
          onClick={() => setActiveSection('documentation')}
        >
          API文档
        </button>
        <button 
          className={activeSection === 'monitor' ? 'active' : ''}
          onClick={() => setActiveSection('monitor')}
        >
          API监控
        </button>
        <button 
          className={activeSection === 'testing' ? 'active' : ''}
          onClick={() => setActiveSection('testing')}
        >
          API测试
        </button>
        <button 
          className={activeSection === 'versioning' ? 'active' : ''}
          onClick={() => setActiveSection('versioning')}
        >
          版本管理
        </button>
        <button 
          className={activeSection === 'security' ? 'active' : ''}
          onClick={() => setActiveSection('security')}
        >
          安全配置
        </button>
      </div>

      <div className="api-content">
        {activeSection === 'dashboard' && (
          <ApiDashboard 
            metrics={apiData.metrics}
            endpoints={apiData.endpoints}
            onAction={operations.handleDashboardAction}
          />
        )}
        {activeSection === 'documentation' && (
          <ApiDocumentation 
            docs={apiData.documentation}
            onAction={operations.handleDocumentationAction}
          />
        )}
        {activeSection === 'monitor' && (
          <ApiMonitor 
            monitoring={apiData.monitoring}
            onAction={operations.handleMonitorAction}
          />
        )}
        {activeSection === 'testing' && (
          <ApiTesting 
            tests={apiData.tests}
            onAction={operations.handleTestingAction}
          />
        )}
        {activeSection === 'versioning' && (
          <ApiVersioning 
            versions={apiData.versions}
            onAction={operations.handleVersioningAction}
          />
        )}
        {activeSection === 'security' && (
          <ApiSecurity 
            security={apiData.security}
            onAction={operations.handleSecurityAction}
          />
        )}
      </div>
    </div>
  );
}; 