import React from 'react';

import { Box, Typography, Avatar, AvatarGroup, LinearProgress } from '@mui/material';
import { FamilyAchievement } from '../../types/gamification';

interface IFamilyCollaborationProps {
  /** achievement 的描述 */
  achievement: FamilyAchievement;
  /** familyMembers 的描述 */
  familyMembers: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export const FamilyCollaboration: React.FC<IFamilyCollaborationProps> = ({
  achievement,
  familyMembers,
}) => {
  const totalProgress = (achievement.currentProgress / achievement.familyGoal) * 100;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6"></Typography>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <AvatarGroup max={4}>
          {familyMembers.map(member => (
            <Avatar key={member.id} src={member.avatar} alt={member.name} />
          ))}
        </AvatarGroup>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1">{achievementname}</Typography>
          <LinearProgress variant="determinate" value={totalProgress} sx={{ mt: 1 }} />
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {achievement.memberContributions.map(contribution => {
          const member = familyMembers.find(m => m.id === contribution.memberId);
          return (
            <Box key={contribution.memberId} sx={{ mt: 1 }}>
              <Typography variant="body2">
                {membername} {contributioncontribution}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
