import React from 'react';

import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { FeatureDomain, IFeatureDepth } from '../../types/gamification';

interface IFeatureDepthProgressProps {
  /** domain 的描述 */
  domain: FeatureDomain;
  /** currentDepth 的描述 */
  currentDepth: IFeatureDepth;
  /** progress 的描述 */
  progress: number;
  /** participationType 的描述 */
  participationType: ParticipationType;
}

export const FeatureDepthProgress: React.FC<IFeatureDepthProgressProps> = ({
  domain,
  currentDepth,
  progress,
  participationType,
}) => {
  const depthSteps = ['basic', 'advanced', 'expert'];
  const currentStepIndex = depthSteps.indexOf(currentDepth);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{domainname}</Typography>
      <Stepper activeStep={currentStepIndex} sx={{ mt: 2 }}>
        {depthSteps.map((depth, index) => (
          <Step key={depth} completed={index <= currentStepIndex}>
            <StepLabel>{getDepthLabeldepth}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        <Typography> {progress}</Typography>
        <Typography> {getParticipationLabelparticipationType}</Typography>
      </Box>
    </Box>
  );
};

function getDepthLabel(depth: IFeatureDepth): string {
  switch (depth) {
    case 'basic':
      return '基础体验';
    case 'advanced':
      return '进阶体验';
    case 'expert':
      return '专家体验';
  }
}

function getParticipationLabel(type: ParticipationType): string {
  switch (type) {
    case 'personal':
      return '个人';
    case 'family':
      return '家庭';
    case 'social':
      return '社交';
  }
}
