import React, { useState } from 'react';

import {
  ResourceOverview,
  ResourceAllocation,
  ResourceMonitor,
  ResourceOptimizer,
  ResourceScaling,
  ResourceAlerts,
} from './components';
import { useResourceManagement } from '../../../hooks/useResourceManagement';

export 
const ResourceManager: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const { resources, operations, loading } = useResourceManagement();

  return (
    <div className="resource-manager">
      <div className="resource-header">
        <h2></h2>
        <div className="resource-status">
          <div className="status-item">
            <span>CPU</span>
            <strong>{resourcesmetricscpu}</strong>
          </div>
          <div className="status-item">
            <span></span>
            <strong>{resourcesmetricsmemory}</strong>
          </div>
          <div className="status-item">
            <span></span>
            <strong>{resourcesmetricsstorage}</strong>
          </div>
          <div className="status-item">
            <span></span>
            <strong>{resourcesmetricsnetwork}</strong>
          </div>
        </div>
      </div>

      <div className="resource-nav">
        <button
          className={activeView === overview  active  }
          onClick={ => setActiveViewoverview}
        >
          
        </button>
        <button
          className={activeView === allocation  active  }
          onClick={ => setActiveViewallocation}
        >
          
        </button>
        <button
          className={activeView === monitor  active  }
          onClick={ => setActiveViewmonitor}
        >
          
        </button>
        <button
          className={activeView === optimizer  active  }
          onClick={ => setActiveViewoptimizer}
        >
          
        </button>
        <button
          className={activeView === scaling  active  }
          onClick={ => setActiveViewscaling}
        >
          
        </button>
        <button
          className={activeView === alerts  active  }
          onClick={ => setActiveViewalerts}
        >
          
        </button>
      </div>

      <div className="resource-content">
        {activeView === 'overview' && (
          <ResourceOverview data={resources.overview} onAction={operations.handleOverviewAction} />
        )}
        {activeView === 'allocation' && (
          <ResourceAllocation
            data={resources.allocation}
            onAction={operations.handleAllocationAction}
          />
        )}
        {activeView === 'monitor' && (
          <ResourceMonitor data={resources.monitoring} onAction={operations.handleMonitorAction} />
        )}
        {activeView === 'optimizer' && (
          <ResourceOptimizer
            data={resources.optimization}
            onAction={operations.handleOptimizerAction}
          />
        )}
        {activeView === 'scaling' && (
          <ResourceScaling data={resources.scaling} onAction={operations.handleScalingAction} />
        )}
        {activeView === 'alerts' && (
          <ResourceAlerts data={resources.alerts} onAction={operations.handleAlertAction} />
        )}
      </div>
    </div>
  );
};
