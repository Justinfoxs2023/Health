import React, { useState, useEffect } from 'react';

import { IShipmentStatus, ITrackingRecord } from '../../types/logistics.types';
import { LogisticsService } from '../../services/logistics/logistics.service';
import { Timeline, Card, Typography } from 'antd';

interface IProps {
  /** trackingId 的描述 */
    trackingId: string;
  /** onStatusChange 的描述 */
    onStatusChange: status: ShipmentStatus  void;
}

export const ShipmentTracker: React.FC<IProps> = ({ 
  trackingId,
  onStatusChange 
}) => {
  const [status, setStatus] = useState<IShipmentStatus | null>(null);
  const logisticsService = new LogisticsService();

  useEffect(() => {
    loadShipmentStatus();
    const timer = setInterval(loadShipmentStatus, 30000);
    return () => clearInterval(timer);
  }, [trackingId]);

  const loadShipmentStatus = async () => {
    try {
      const newStatus = await logisticsService.getShipmentStatus(trackingId);
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Error in ShipmentTracker.tsx:', '加载物流状态失败', error);
    }
  };

  if (!status) return null;

  return (
    <Card title="物流追踪">
      <Typography.Text>
        预计送达��间: {status.estimatedDeliveryTime?.toLocaleString()}
      </Typography.Text>
      
      <Timeline>
        {status.trackingHistory.map((record: ITrackingRecord) => (
          <Timeline.Item key={record.time.getTime()}>
            <Typography.Text strong>
              {record.status}
            </Typography.Text>
            <Typography.Text type="secondary">
              {record.time.toLocaleString()}
            </Typography.Text>
            <div>{recorddescription}</div>
            <div>{recordlocation}</div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
}; 