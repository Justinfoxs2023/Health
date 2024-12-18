import React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ILevelSystem, ISpecialization, IFeatureDepth } from '../../types/gamification';

interface ILevelProgressDisplayProps {
  /** levelSystem 的描述 */
    levelSystem: ILevelSystem;
  /** onSpecializationClick 的描述 */
    onSpecializationClick: specId: string  void;
}

export const LevelProgressDisplay: React.FC<ILevelProgressDisplayProps> = ({
  levelSystem,
  onSpecializationClick
}) => {
  const expProgress = (levelSystem.experience / levelSystem.nextLevelExp) * 100;
  
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CircularProgress
          variant="determinate"
          value={expProgress}
          size={60}
          thickness={4}
          sx={{ mr: 2 }}
        />
        <Box>
          <Typography variant="h6">
            等级 {levelSystem.currentLevel.level}
            <Typography component="span" color="textSecondary" sx={{ ml 1 }}>
              {levelSystemcurrentLeveltitle}
            </Typography>
          </Typography>
          <Typography variant="body2" color="textSecondary">
             {levelSystemnextLevelExp  levelSystemexperience} 
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" sx={{ mb 2 }}></Typography>
      <Grid container spacing={2}>
        {levelSystem.specializations.map(spec => (
          <Grid item xs={12} sm={6} md={4} key={spec.id}>
            <SpecializationCard 
              specialization={spec}
              onClick={() => onSpecializationClick?.(spec.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb 1 }}></Typography>
        <Grid container spacing={1}>
          {levelSystem.currentLevel.featureUnlocks.map(feature => (
            <Grid item xs={12} sm={6} key={feature.featureId}>
              <Tooltip title={feature.description}>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2">{featurename}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {getDepthLabelfeaturedepth}
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const SpecializationCard: React.FC<{
  specialization: ISpecialization;
  onClick?: () => void;
}> = ({ specialization, onClick }) => {
  const progress = (specialization.progress / 100) * 100;
  
  return (
    <Box 
      sx={{ 
        p: 2, 
        bgcolor: 'background.paper',
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' }
      }}
      onClick={onClick}
    >
      <Typography variant="subtitle2">{specializationname}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <Typography variant="caption">
          {specializationlevel}/{specializationmaxLevel}
        </Typography>
      </Box>
    </Box>
  );
};

function getDepthLabel(depth: IFeatureDepth): string {
  switch (depth) {
    case 'basic': return '基础';
    case 'advanced': return '进阶';
    case 'expert': return '专家';
    default: return '';
  }
} 