import React, { useState } from 'react';
import {
  WorkflowDesigner,
  WorkflowList,
  WorkflowMonitor,
  WorkflowHistory,
  WorkflowAnalytics,
  WorkflowSettings
} from './components';
import { useWorkflowManagement } from '../../../hooks/useWorkflowManagement';

export const WorkflowManager: React.FC = () => {
  const [activeView, setActiveView] = useState('designer');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const { workflows, operations } = useWorkflowManagement();

  return (
    <div className="workflow-manager">
      <div className="workflow-header">
        <h2>工作流管理</h2>
        <div className="workflow-actions">
          <button onClick={() => setSelectedWorkflow(null)}>新建工作流</button>
          <button onClick={operations.handleWorkflowImport}>导入工作流</button>
          <button onClick={operations.handleWorkflowExport}>导出工作流</button>
        </div>
      </div>

      <div className="workflow-container">
        <div className="workflow-sidebar">
          <WorkflowList 
            workflows={workflows.list}
            selectedId={selectedWorkflow?.id}
            onSelect={setSelectedWorkflow}
            onAction={operations.handleWorkflowAction}
          />
        </div>

        <div className="workflow-main">
          <div className="view-tabs">
            <button onClick={() => setActiveView('designer')}>流程设计</button>
            <button onClick={() => setActiveView('monitor')}>流程监控</button>
            <button onClick={() => setActiveView('history')}>执行历史</button>
            <button onClick={() => setActiveView('analytics')}>流程分析</button>
            <button onClick={() => setActiveView('settings')}>流程设置</button>
          </div>

          <div className="view-content">
            {activeView === 'designer' && (
              <WorkflowDesigner 
                workflow={selectedWorkflow}
                onSave={operations.handleWorkflowSave}
                onPublish={operations.handleWorkflowPublish}
              />
            )}
            {activeView === 'monitor' && (
              <WorkflowMonitor 
                workflow={selectedWorkflow}
                instances={workflows.instances}
                onAction={operations.handleMonitorAction}
              />
            )}
            {activeView === 'history' && (
              <WorkflowHistory 
                workflow={selectedWorkflow}
                history={workflows.history}
                onAction={operations.handleHistoryAction}
              />
            )}
            {activeView === 'analytics' && (
              <WorkflowAnalytics 
                workflow={selectedWorkflow}
                analytics={workflows.analytics}
                onAction={operations.handleAnalyticsAction}
              />
            )}
            {activeView === 'settings' && (
              <WorkflowSettings 
                workflow={selectedWorkflow}
                settings={workflows.settings}
                onAction={operations.handleSettingsAction}
              />
            )}
          </div>
        </div>
      </div>

      <div className="workflow-footer">
        <div className="workflow-stats">
          <div className="stat-item">
            <span>总工作流</span>
            <strong>{workflows.stats.total}</strong>
          </div>
          <div className="stat-item">
            <span>运行中</span>
            <strong>{workflows.stats.running}</strong>
          </div>
          <div className="stat-item">
            <span>已完成</span>
            <strong>{workflows.stats.completed}</strong>
          </div>
          <div className="stat-item">
            <span>出错</span>
            <strong>{workflows.stats.error}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}; 