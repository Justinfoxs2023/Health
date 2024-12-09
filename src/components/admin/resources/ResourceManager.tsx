import React, { useState } from 'react';
import {
  ResourceOverview,
  ResourceAllocation,
  ResourceMonitor,
  ResourceOptimizer,
  ResourceScaling,
  ResourceAlerts
} from './components';
import { useResourceManagement } from '../../../hooks/useResourceManagement';

export const ResourceManager: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const { resources, operations, loading } = useResourceManagement();

  return (
    <div className="resource-manager">
      <div className="resource-header">
        <h2>资源管理</h2>
        <div className="resource-status">
          <div className="status-item">
            <span>CPU使用率</span>
            <strong>{resources.metrics.cpu}%</strong>
          </div>
          <div className="status-item">
            <span>内存使用率</span>
            <strong>{resources.metrics.memory}%</strong>
          </div>
          <div className="status-item">
            <span>存储使用率</span>
            <strong>{resources.metrics.storage}%</strong>
          </div>
          <div className="status-item">
            <span>网络负载</span>
            <strong>{resources.metrics.network}%</strong>
          </div>
        </div>
      </div>

      <div className="resource-nav">
        <button 
          className={activeView === 'overview' ? 'active' : ''}
          onClick={() => setActiveView('overview')}
        >
          资源概览
        </button>
        <button 
          className={activeView === 'allocation' ? 'active' : ''}
          onClick={() => setActiveView('allocation')}
        >
          资源分配
        </button>
        <button 
          className={activeView === 'monitor' ? 'active' : ''}
          onClick={() => setActiveView('monitor')}
        >
          资源监控
        </button>
        <button 
          className={activeView === 'optimizer' ? 'active' : ''}
          onClick={() => setActiveView('optimizer')}
        >
          资源优化
        </button>
        <button 
          className={activeView === 'scaling' ? 'active' : ''}
          onClick={() => setActiveView('scaling')}
        >
          弹性伸缩
        </button>
        <button 
          className={activeView === 'alerts' ? 'active' : ''}
          onClick={() => setActiveView('alerts')}
        >
          资源告警
        </button>
      </div>

      <div className="resource-content">
        {activeView === 'overview' && (
          <ResourceOverview 
            data={resources.overview}
            onAction={operations.handleOverviewAction}
          />
        )}
        {activeView === 'allocation' && (
          <ResourceAllocation 
            data={resources.allocation}
            onAction={operations.handleAllocationAction}
          />
        )}
        {activeView === 'monitor' && (
          <ResourceMonitor 
            data={resources.monitoring}
            onAction={operations.handleMonitorAction}
          />
        )}
        {activeView === 'optimizer' && (
          <ResourceOptimizer 
            data={resources.optimization}
            onAction={operations.handleOptimizerAction}
          />
        )}
        {activeView === 'scaling' && (
          <ResourceScaling 
            data={resources.scaling}
            onAction={operations.handleScalingAction}
          />
        )}
        {activeView === 'alerts' && (
          <ResourceAlerts 
            data={resources.alerts}
            onAction={operations.handleAlertAction}
          />
        )}
      </div>
    </div>
  );
}; 