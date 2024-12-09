import React from 'react';

interface HealthTimelineProps {
  data: Family.TimelineEvent[];
  onActionComplete: (eventId: string) => void;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  data,
  onActionComplete
}) => {
  // 实现健康时间轴组件
  return <div>Health Timeline</div>;
}; 