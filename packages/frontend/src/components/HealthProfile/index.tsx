import React from 'react';

import './styles.css';
import { Card, Tabs, Timeline } from 'antd';
import { HealthRecommendations } from './HealthRecommendations';
import { HealthReport } from './HealthReport';
import { SurveyHistory } from './SurveyHistory';

export const HealthProfile: React.FC = () => {
  return (
    <div className="health-profile-container">
      <Card title="个人健康档案">
        <Tabs
          defaultActiveKey="report"
          items={[
            {
              key: 'report',
              label: '健康报告',
              children: <HealthReport />,
            },
            {
              key: 'history',
              label: '调查历史',
              children: <SurveyHistory />,
            },
            {
              key: 'recommendations',
              label: '健康建议',
              children: <HealthRecommendations />,
            },
          ]}
        />
      </Card>
    </div>
  );
};
