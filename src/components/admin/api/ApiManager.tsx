import React, { useState } from 'react';

import {
  ApiDashboard,
  ApiDocumentation,
  ApiMonitor,
  ApiTesting,
  ApiVersioning,
  ApiSecurity,
} from './components';
import { useApiManagement } from '../../../hooks/useApiManagement';

export 
const ApiManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { apiData, operations, loading } = useApiManagement();

  return (
    <div className="api-manager">
      <div className="api-header">
        <h2>API</h2>
        <div className="api-status">
          <span className={status {apiDatastatustoLowerCase}}>{apiDatastatus}</span>
          <span className="uptime"> {apiDatauptime}</span>
        </div>
      </div>

      <div className="api-nav">
        <button
          className={activeSection === dashboard  active  }
          onClick={ => setActiveSectiondashboard}
        >
          API
        </button>
        <button
          className={activeSection === documentation  active  }
          onClick={ => setActiveSectiondocumentation}
        >
          API
        </button>
        <button
          className={activeSection === monitor  active  }
          onClick={ => setActiveSectionmonitor}
        >
          API
        </button>
        <button
          className={activeSection === testing  active  }
          onClick={ => setActiveSectiontesting}
        >
          API
        </button>
        <button
          className={activeSection === versioning  active  }
          onClick={ => setActiveSectionversioning}
        >
          
        </button>
        <button
          className={activeSection === security  active  }
          onClick={ => setActiveSectionsecurity}
        >
          
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
          <ApiMonitor monitoring={apiData.monitoring} onAction={operations.handleMonitorAction} />
        )}
        {activeSection === 'testing' && (
          <ApiTesting tests={apiData.tests} onAction={operations.handleTestingAction} />
        )}
        {activeSection === 'versioning' && (
          <ApiVersioning versions={apiData.versions} onAction={operations.handleVersioningAction} />
        )}
        {activeSection === 'security' && (
          <ApiSecurity security={apiData.security} onAction={operations.handleSecurityAction} />
        )}
      </div>
    </div>
  );
};
