import React, { useState } from 'react';
import {
  QualityDashboard,
  QualityRules,
  QualityMonitor,
  QualityIssues,
  QualityReports,
  QualitySettings
} from './components';
import { useDataQuality } from '../../../hooks/useDataQuality';

export const DataQualityManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { quality, operations } = useDataQuality();

  return (
    <div className="quality-manager">
      <div className="quality-header">
        <h2>数据质量管理</h2>
        <div className="quality-summary">
          <div className="summary-item">
            <span>质量评分</span>
            <strong>{quality.score}/100</strong>
          </div>
          <div className="summary-item">
            <span>待处理问题</span>
            <strong>{quality.issues.length}</strong>
          </div>
          <div className="summary-item">
            <span>规则数量</span>
            <strong>{quality.rules.length}</strong>
          </div>
        </div>
      </div>

      <div className="quality-content">
        <div className="quality-nav">
          <button onClick={() => setActiveSection('dashboard')}>质量概览</button>
          <button onClick={() => setActiveSection('rules')}>质量规则</button>
          <button onClick={() => setActiveSection('monitor')}>质量监控</button>
          <button onClick={() => setActiveSection('issues')}>问题管理</button>
          <button onClick={() => setActiveSection('reports')}>质量报告</button>
          <button onClick={() => setActiveSection('settings')}>质量设置</button>
        </div>

        <div className="section-content">
          {activeSection === 'dashboard' && (
            <QualityDashboard 
              data={quality.dashboard}
              onAction={operations.handleDashboardAction}
            />
          )}
          {activeSection === 'rules' && (
            <QualityRules 
              rules={quality.rules}
              onAction={operations.handleRulesAction}
            />
          )}
          {activeSection === 'monitor' && (
            <QualityMonitor 
              monitoring={quality.monitoring}
              onAction={operations.handleMonitorAction}
            />
          )}
          {activeSection === 'issues' && (
            <QualityIssues 
              issues={quality.issues}
              onAction={operations.handleIssuesAction}
            />
          )}
          {activeSection === 'reports' && (
            <QualityReports 
              reports={quality.reports}
              onAction={operations.handleReportsAction}
            />
          )}
          {activeSection === 'settings' && (
            <QualitySettings 
              settings={quality.settings}
              onAction={operations.handleSettingsAction}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .quality-manager {
          padding: 20px;
        }

        .quality-summary {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .summary-item {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }

        .quality-content {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .quality-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 200px;
        }

        .section-content {
          flex: 1;
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}; 