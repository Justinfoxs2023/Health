import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  BarChart,
  PieChart,
  RadarChart 
} from '../charts';
import { HealthData, ChartConfig } from '../../../types/health';
import { useHealthData } from '../../../hooks/useHealthData';
import { DateRangePicker, FilterPanel } from '../common';

export const HealthDataViewer: React.FC<{
  userId: string;
  config: ChartConfig;
}> = ({ userId, config }) => {
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const [filters, setFilters] = useState([]);
  const { data, loading, error } = useHealthData(userId, timeRange, filters);

  const renderChart = (type: string, data: any) => {
    switch (type) {
      case 'line':
        return <LineChart data={data} config={config.line} />;
      case 'bar':
        return <BarChart data={data} config={config.bar} />;
      case 'pie':
        return <PieChart data={data} config={config.pie} />;
      case 'radar':
        return <RadarChart data={data} config={config.radar} />;
      default:
        return null;
    }
  };

  return (
    <div className="health-data-viewer">
      <div className="controls">
        <DateRangePicker 
          value={timeRange}
          onChange={setTimeRange}
        />
        <FilterPanel 
          filters={filters}
          onChange={setFilters}
        />
      </div>

      <div className="charts-grid">
        {config.charts.map(chart => (
          <div key={chart.id} className="chart-container">
            <h3>{chart.title}</h3>
            {renderChart(chart.type, data[chart.dataKey])}
          </div>
        ))}
      </div>

      <div className="insights">
        {data?.insights.map(insight => (
          <div key={insight.id} className="insight-card">
            <h4>{insight.title}</h4>
            <p>{insight.description}</p>
            {insight.recommendations && (
              <ul>
                {insight.recommendations.map(rec => (
                  <li key={rec.id}>{rec.text}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 