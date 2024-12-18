import React from 'react';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { ProgressAnimation } from './ProgressAnimation';

interface IExpertProgressProps {
  /** consultationCount 的描述 */
  consultationCount: number;
  /** targetCount 的描述 */
  targetCount: number;
  /** rating 的描述 */
  rating: number;
  /** successRate 的描述 */
  successRate: number;
}

export const ExpertProgress: React.FC<IExpertProgressProps> = ({
  consultationCount,
  targetCount,
  rating,
  successRate,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6"></Typography>
      <Box sx={{ mt: 2 }}>
        <Typography></Typography>
        <ProgressAnimation progress={consultationCount} target={targetCount} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography> {rating}/50</Typography>
        <Typography> {successRate}</Typography>
      </Box>
    </Box>
  );
};
