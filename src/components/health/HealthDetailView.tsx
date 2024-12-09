import React, { useState, useEffect } from 'react';
import { Card, Box, Typography, Tabs, Tab, IconButton } from '@mui/material';
import { Share, Favorite, Timeline, Assessment } from '@mui/icons-material';

interface HealthDetailProps {
  data: HealthData;
  metrics: HealthMetric[];
  timeRange: string;
  onShare?: (data: HealthData) => void;
}

export const HealthDetailView: React.FC<HealthDetailProps> = ({
  data,
  metrics,
  timeRange,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [detailData, setDetailData] = useState<DetailedHealthData | null>(null);

  // 数据分析和处理
  useEffect(() => {
    const processData = async () => {
      const processed = await analyzeHealthData(data, metrics);
      setDetailData(processed);
    };
    processData();
  }, [data, metrics]);

  return (
    <Card className="health-detail-view">
      <Box className="detail-header">
        <Typography variant="h6">{data.title}</Typography>
        <Box className="header-actions">
          <IconButton onClick={() => onShare?.(data)}>
            <Share />
          </IconButton>
          <IconButton>
            <Favorite />
          </IconButton>
        </Box>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={(_, value) => setActiveTab(value)}
        className="detail-tabs"
      >
        <Tab label="概览" icon={<Assessment />} />
        <Tab label="趋势" icon={<Timeline />} />
        <Tab label="分析" icon={<Assessment />} />
      </Tabs>

      <Box className="detail-content">
        {activeTab === 0 && (
          <OverviewPanel data={detailData?.overview} />
        )}
        {activeTab === 1 && (
          <TrendPanel 
            data={detailData?.trends} 
            timeRange={timeRange} 
          />
        )}
        {activeTab === 2 && (
          <AnalysisPanel analysis={detailData?.analysis} />
        )}
      </Box>
    </Card>
  );
}; 