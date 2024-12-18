import React, { useState, useEffect } from 'react';

import { HealthDataDashboard } from '../components/visualization/HealthDataDashboard';
import { HealthDataDetails } from '../components/visualization/HealthDataDetails';
import { IHealthData } from '../types';
import { generateMockHealthData } from '../utils/test-data-generator';

export const HealthMonitoring: React.FC = () => {
  const [healthData, setHealthData] = useState<IHealthData | null>(null);

  useEffect(() => {
    // 模拟数据加载
    const data = generateMockHealthData();
    setHealthData(data);
  }, []);

  if (!healthData) {
    return <div>Loading</div>;
  }

  return (
    <div className="health-monitoring">
      <h1></h1>
      
      <div className="content">
        <HealthDataDashboard data={healthData} />
        <HealthDataDetails data={healthData} />
      </div>

      <style jsx>{
        healthmonitoring {
          padding 20px
          maxwidth 1200px
          margin 0 auto
        }

        h1 {
          color 333
          marginbottom 30px
          textalign center
        }

        content {
          display grid
          gridtemplatecolumns 2fr 1fr
          gap 20px
        }

        media maxwidth 768px {
          content {
            gridtemplatecolumns 1fr
          }
        }
      }</style>
    </div>
  );
}; 