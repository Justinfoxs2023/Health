import React from 'react';

interface IHealthTimelineProps {
  /** data 的描述 */
    data: FamilyTimelineEvent;
  /** onActionComplete 的描述 */
    onActionComplete: eventId: string  void;
}

export const HealthTimeline: React.FC<IHealthTimelineProps> = ({ data, onActionComplete }) => {
  // 实现健康时间轴组件
  return <div>Health Timeline</div>;
};
