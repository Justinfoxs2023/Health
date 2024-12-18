import React from 'react';

import type { IUserLevel } from '../../types/gamification';
import { Box, Typography, Grid } from '@mui/material';
import { HealthMetricCard } from '../ui/health-components';

interface IMerchantProgressProps {
  /** customerSatisfaction 的描述 */
  customerSatisfaction: number;
  /** productCount 的描述 */
  productCount: number;
  /** level 的描述 */
  level: IUserLevel;
}

export const MerchantProgress: React.FC<IMerchantProgressProps> = ({
  customerSatisfaction,
  productCount,
  level,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <HealthMetricCard
          title="顾客满意度"
          value={customerSatisfaction}
          unit="%"
          trend={0}
          status="normal"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HealthMetricCard
          title="商品数量"
          value={productCount}
          unit=""
          trend={1}
          status={productCount < level.specialPrivileges?.maxProducts! ? 'warning' : 'success'}
        />
      </Grid>
    </Grid>
  );
};
