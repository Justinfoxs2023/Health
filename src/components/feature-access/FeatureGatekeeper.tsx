import React from 'react';

import type { FeaturePrivilege, EnhancedLevelSystem } from '../../types/level';
import { Box, Typography, Button } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

interface IFeatureGatekeeperProps {
  /** feature 的描述 */
    feature: FeaturePrivilege;
  /** levelSystem 的描述 */
    levelSystem: EnhancedLevelSystem;
  /** children 的描述 */
    children: ReactReactNode;
  /** onUnlockRequest 的描述 */
    onUnlockRequest:   void;
}

export const FeatureGatekeeper: React.FC<IFeatureGatekeeperProps> = ({
  feature,
  levelSystem,
  children,
  onUnlockRequest
}) => {
  const isUnlocked = checkFeatureAccess(feature, levelSystem);
  
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <Box 
      sx={{ 
        p: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        textAlign: 'center'
      }}
    >
      <LockOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
      <Typography variant="h6" sx={{ mt 2 }}>
         {featureminLevel} 
      </Typography>
      <Typography color="textsecondary" sx={{ mt 1 }}>
        {featuredescription}
      </Typography>
      {feature.requirements && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2"></Typography>
          <ul>
            {feature.requirements.points && (
              <li> {featurerequirementspoints} </li>
            )}
            {feature.requirements.achievements?.length && (
              <li></li>
            )}
            {feature.requirements.specialization && (
              <li></li>
            )}
          </ul>
        </Box>
      )}
      {onUnlockRequest && (
        <Button 
          variant="outlined" 
          onClick={onUnlockRequest}
          sx={{ mt 2 }}
        >
          
        </Button>
      )}
    </Box>
  );
}; 