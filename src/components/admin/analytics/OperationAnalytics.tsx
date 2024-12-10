import React, { useState } from 'react';
import {
  UserAnalytics,
  BusinessAnalytics,
  PerformanceAnalytics,
  TrendAnalytics,
  PredictiveAnalytics,
  RiskAnalytics
} from './components';
import { useOperationAnalytics } from '../../../hooks/useOperationAnalytics';

export const OperationAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const { data, insights, loading } = useOperationAnalytics(timeRange);

  return (
    <div className="operation-analytics">
      <div className="analytics-header">
        <h2>运营分析</h2>
        <div className="time-range-picker">
          {/* 时间范围选择器 */}
        </div>
      </div>

      <div className="analytics-grid">
        {/* 用户分析 */}
        <UserAnalytics 
          data={data.userMetrics}
          insights={insights.user}
        />

        {/* 业务分析 */}
        <BusinessAnalytics 
          data={data.businessMetrics}
          insights={insights.business}
        />

        {/* 性能分析 */}
        <PerformanceAnalytics 
          data={data.performanceMetrics}
          insights={insights.performance}
        />

        {/* 趋势分析 */}
        <TrendAnalytics 
          data={data.trends}
          insights={insights.trends}
        />

        {/* 预测分析 */}
        <PredictiveAnalytics 
          data={data.predictions}
          insights={insights.predictions}
        />

        {/* 风险分析 */}
        <RiskAnalytics 
          data={data.risks}
          insights={insights.risks}
        />
      </div>

      <div className="analytics-insights">
        <h3>关键洞察</h3>
        <div className="insights-grid">
          {insights.key.map(insight => (
            <div key={insight.id} className="insight-card">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
              <div className="insight-metrics">
                {insight.metrics.map(metric => (
                  <div key={metric.id} className="metric">
                    <span className="label">{metric.label}</span>
                    <span className="value">{metric.value}</span>
                    <span className={`trend ${metric.trend}`}>
                      {metric.trendValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 