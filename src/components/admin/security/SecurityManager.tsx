import React, { useState } from 'react';

import {
  SecurityDashboard,
  AccessControl,
  AuditLogs,
  SecurityAlerts,
  ComplianceChecker,
  SecuritySettings,
} from './components';
import { useSecurityManagement } from '../../../hooks/useSecurityManagement';

export 
const SecurityManager: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { security, operations, loading } = useSecurityManagement();

  return (
    <div className="security-manager">
      <div className="security-header">
        <h2></h2>
        <div className="security-alerts">
          {security.alerts.critical > 0 && (
            <span className="alert critical">{securityalertscritical} </span>
          )}
          {security.alerts.warning > 0 && (
            <span className="alert warning">{securityalertswarning} </span>
          )}
        </div>
      </div>

      <div className="security-nav">
        <button
          className={activeView === dashboard  active  }
          onClick={ => setActiveViewdashboard}
        >
          
        </button>
        <button
          className={activeView === access  active  }
          onClick={ => setActiveViewaccess}
        >
          
        </button>
        <button
          className={activeView === audit  active  }
          onClick={ => setActiveViewaudit}
        >
          
        </button>
        <button
          className={activeView === alerts  active  }
          onClick={ => setActiveViewalerts}
        >
          
        </button>
        <button
          className={activeView === compliance  active  }
          onClick={ => setActiveViewcompliance}
        >
          
        </button>
        <button
          className={activeView === settings  active  }
          onClick={ => setActiveViewsettings}
        >
          
        </button>
      </div>

      <div className="security-content">
        {activeView === 'dashboard' && (
          <SecurityDashboard
            metrics={security.metrics}
            threats={security.threats}
            onAction={operations.handleDashboardAction}
          />
        )}
        {activeView === 'access' && (
          <AccessControl
            policies={security.policies}
            sessions={security.sessions}
            onAction={operations.handleAccessAction}
          />
        )}
        {activeView === 'audit' && (
          <AuditLogs logs={security.auditLogs} onAction={operations.handleAuditAction} />
        )}
        {activeView === 'alerts' && (
          <SecurityAlerts
            alerts={security.detailedAlerts}
            onAction={operations.handleAlertAction}
          />
        )}
        {activeView === 'compliance' && (
          <ComplianceChecker
            rules={security.complianceRules}
            status={security.complianceStatus}
            onAction={operations.handleComplianceAction}
          />
        )}
        {activeView === 'settings' && (
          <SecuritySettings
            settings={security.settings}
            onAction={operations.handleSettingsAction}
          />
        )}
      </div>
    </div>
  );
};
