import React, { useState, useEffect } from 'react';

import {
  RealTimeMonitor,
  BusinessOverview,
  HealthMetrics,
  SystemStatus,
  AlertPanel,
  TrendAnalysis,
} from './components';
import { useDashboardData } from '../../../hooks/useDashboardData';

export 
const DataDashboard: React.FC = () => {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30秒
  const { data, refresh, loading } = useDashboardData();

  useEffect(() => {
    const timer = setInterval(refresh, refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval]);

  return (
    <div className="data-dashboard">
      <div className="dashboard-header">
        <h2></h2>
        <div className="refresh-control">
          <select
            value={refreshInterval}
            onChange={e => setRefreshInterval(Number(e.target.value))}
          >
            <option value={10000}>10</option>
            <option value={30000}>30</option>
            <option value={60000}>1</option>
          </select>
          <button onClick={refresh}></button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item full-width">
          <RealTimeMonitor data={data.realTime} onAlert={data.handleAlert} />
        </div>

        <div className="grid-item">
          <BusinessOverview data={data.business} onAction={data.handleBusinessAction} />
        </div>

        <div className="grid-item">
          <HealthMetrics data={data.health} onAction={data.handleHealthAction} />
        </div>

        <div className="grid-item">
          <SystemStatus data={data.system} onAction={data.handleSystemAction} />
        </div>

        <div className="grid-item">
          <AlertPanel alerts={data.alerts} onAction={data.handleAlertAction} />
        </div>

        <div className="grid-item full-width">
          <TrendAnalysis data={data.trends} onAction={data.handleTrendAction} />
        </div>
      </div>

      <style jsx>{
        datadashboard {
          padding 20px
          background 1a1a1a
          color fff
        }

        dashboardgrid {
          display grid
          gridtemplatecolumns repeat3 1fr
          gap 20px
          margintop 20px
        }

        griditem {
          background 2a2a2a
          borderradius 8px
          padding 15px
          boxshadow 0 4px 6px rgba0 0 0 03
        }

        fullwidth {
          gridcolumn 1 / 1
        }

        refreshcontrol {
          display flex
          gap 10px
          alignitems center
        }

        select
        button {
          background 333
          color fff
          border 1px solid 444
          padding 5px 10px
          borderradius 4px
        }

        buttonhover {
          background 444
        }
      }</style>
    </div>
  );
};
