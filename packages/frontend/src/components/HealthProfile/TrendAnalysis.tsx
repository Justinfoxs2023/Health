import React from 'react';

import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getHealthTrends, IHealthTrend } from '../../services';
import { useQuery } from 'react-query';

export const TrendAnalysis: React.FC = () => {
  const { data: trends } = useQuery<IHealthTrend[]>('healthTrends', getHealthTrends);

  return (
    <Card title="健康趋势分析">
      <LineChart width={600} height={300} data={trends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="bmi" stroke="#8884d8" name="BMI指数" />
        <Line type="monotone" dataKey="healthScore" stroke="#82ca9d" name="健康评分" />
        <Line type="monotone" dataKey="exerciseScore" stroke="#ffc658" name="运动评分" />
      </LineChart>
    </Card>
  );
};
