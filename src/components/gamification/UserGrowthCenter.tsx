import React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { 
  IAchievement, 
  IUserLevel, 
  IChallenge 
} from '../../types/gamification';
import { ProgressAnimation } from './ProgressAnimation';

inte
rface UserGrowthCenterProps {
  achievements: Achievement;
  currentLevel: UserLevel;
  healthPoints: number;
  challenges: Challenge;
}

export const UserGrowthCenter: React.FC<UserGrowthCenterProps> = ({
  achievements,
  currentLevel,
  healthPoints,
  challenges
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="成就" />
        <Tab label="挑战" />
        <Tab label="等级特权" />
      </Tabs>
      
      <Box sx={{ p: 3 }}>
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6"></Typography>
            {/* 成就列表组件 */}
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6"></Typography>
            {/* 挑战列表组件 */}
          </Box>
        )}
        
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6"></Typography>
            {/* 特权列表组件 */}
          </Box>
        )}
      </Box>
    </Box>
  );
}; 