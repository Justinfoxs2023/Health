import React from 'react';

import { InventoryCapacity } from '../../types/showcase.types';
import { Progress, Typography, Tooltip } from 'antd';

interface IProps {
  /** capacity 的描述 */
  capacity: InventoryCapacity;
}

export const CapacityIndicator: React.FC<IProps> = ({ capacity }) => {
  const usagePercent = Math.round((capacity.used / capacity.total) * 100);
  const isNearLimit = usagePercent >= 80;

  return (
    <div className="capacity-indicator">
      <Typography.Title level={5}>仓库容量</Typography.Title>

      <Tooltip title={`已使用 ${capacity.used}/${capacity.total} 格`}>
        <Progress
          percent={usagePercent}
          status={isNearLimit ? 'exception' : 'normal'}
          showInfo={false}
        />
      </Tooltip>

      <div className="capacity-details">
        <Typography.Text>展示位: {capacity.displaySlots} 格</Typography.Text>
        {capacity.nextLevelUpgrade && (
          <Typography.Text type="secondary">
            下一级解锁: +{capacity.nextLevelUpgrade.slots} 格
          </Typography.Text>
        )}
      </div>
    </div>
  );
};
