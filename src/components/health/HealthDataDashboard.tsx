import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Warning,
  Share
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { HealthRecord, HealthMetricType } from '../../types/health-devices';

interface HealthDataDashboardProps {
  userId: string;
  familyView?: boolean;
  onShare?: (recordType: HealthMetricType) => void;
}

export const HealthDataDashboard: React.FC<HealthDataDashboardProps> = ({
  userId,
  familyView,
  onShare
}) => {
  const [selectedMetric, setSelectedMetric] = useState<HealthMetricType>(
    HealthMetricType.BLOOD_PRESSURE
  );
  const [timeRange, setTimeRange] = useState('week');
  const [healthData, setHealthData] = useState<HealthRecord[]>([]);

  return (
    <Box className="health-dashboard">
      <Grid container spacing={3}>
        {/* 快速指标概览 */}
        <Grid item xs={12}>
          <Card className="metrics-overview">
            <Box className="metric-cards">
              <MetricCard
                title="血压"
                value="120/80"
                unit="mmHg"
                trend="+2%"
                status="normal"
              />
              <MetricCard
                title="血糖"
                value="5.6"
                unit="mmol/L"
                trend="-1%"
                status="warning"
              />
              <MetricCard
                title="体重"
                value="65.5"
                unit="kg"
                trend="-0.5%"
                status="normal"
              />
              <MetricCard
                title="步数"
                value="8,456"
                unit="步"
                trend="+12%"
                status="good"
              />
            </Box>
          </Card>
        </Grid>

        {/* 详细数据图表 */}
        <Grid item xs={12} md={8}>
          <Card className="data-chart">
            <Box className="chart-header">
              <Typography variant="h6">
                {getMetricTitle(selectedMetric)}趋势
              </Typography>
              <Box className="chart-actions">
                <TimeRangeSelector
                  value={timeRange}
                  onChange={setTimeRange}
                />
                {onShare && (
                  <IconButton onClick={() => onShare(selectedMetric)}>
                    <Share />
                  </IconButton>
                )}
              </Box>
            </Box>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* 设备状态和提醒 */}
        <Grid item xs={12} md={4}>
          <Card className="device-status">
            <Typography variant="h6">设备状态</Typography>
            <DeviceStatusList userId={userId} />
          </Card>
          
          <Card className="health-alerts" sx={{ mt: 2 }}>
            <Typography variant="h6">健康提醒</Typography>
            <HealthAlertsList userId={userId} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// 指标卡片组件
const MetricCard: React.FC<{
  title: string;
  value: string;
  unit: string;
  trend: string;
  status: 'normal' | 'warning' | 'good';
}> = ({ title, value, unit, trend, status }) => {
  return (
    <Card className={`metric-card ${status}`}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h4">
        {value}
        <span className="unit">{unit}</span>
      </Typography>
      <Box className="trend">
        <TrendingUp />
        <Typography variant="caption">{trend}</Typography>
      </Box>
    </Card>
  );
}; 