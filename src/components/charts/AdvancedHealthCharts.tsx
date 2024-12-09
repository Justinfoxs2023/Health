import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AdvancedChartProps {
  data: any[];
  metrics: MetricConfig[];
  type: 'line' | 'area' | 'bar';
  height?: number;
  interactive?: boolean;
}

export const AdvancedHealthChart: React.FC<AdvancedChartProps> = ({
  data,
  metrics,
  type,
  height = 300,
  interactive = true
}) => {
  const theme = useTheme();

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {metrics.map((metric, index) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                stroke={theme.palette[metric.color].main}
                activeDot={{ r: 8 }}
                dot={false}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {metrics.map((metric, index) => (
              <Area
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                fill={theme.palette[metric.color].light}
                stroke={theme.palette[metric.color].main}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {metrics.map((metric, index) => (
              <Bar
                key={metric.key}
                dataKey={metric.key}
                fill={theme.palette[metric.color].main}
              />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <Box className="advanced-chart">
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </Box>
  );
}; 