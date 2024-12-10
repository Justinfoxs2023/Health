import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';

export const HealthDataVisualization: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Card title="健康数据分析">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <RadarChart width={300} height={300} data={data.healthMetrics}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="健康指标"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </Col>
        <Col span={12}>
          <div className="health-stats">
            <h3>关键健康指标</h3>
            <ul>
              <li>BMI: {data.bmi}</li>
              <li>体脂率: {data.bodyFat}%</li>
              <li>基础代谢率: {data.bmr} kcal</li>
              <li>健康年龄: {data.healthAge} 岁</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Card>
  );
}; 