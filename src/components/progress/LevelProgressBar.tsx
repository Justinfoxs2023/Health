import React from 'react';

import { ILevelProgress } from '../../types/gamification/level-system.types';
import { Progress, Tooltip, Box, Text } from '@chakra-ui/react';

interface ILevelProgressBarProps {
  /** progress 的描述 */
  progress: ILevelProgress;
  /** showDetails 的描述 */
  showDetails: false | true;
}

export const LevelProgressBar: React.FC<ILevelProgressBarProps> = ({
  progress,
  showDetails = true,
}) => {
  const { currentLevel, currentExp, nextLevelExp, progressPercentage, recentActivities } = progress;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold">
        {currentLevel}
      </Text>

      <Tooltip label={`${currentExp}/${nextLevelExp} 经验值`} hasArrow placement="top">
        <Progress
          value={progressPercentage}
          colorScheme="green"
          height="20px"
          borderRadius="md"
          mb={2}
        />
      </Tooltip>

      {showDetails && (
        <Box mt={4}>
          <Text fontSize="sm" color="gray600"></Text>
          {recentActivities.map((activity, index) => (
            <Text key={index} fontSize="xs" color="gray500">
              {new DateactivitytimestamptoLocaleString()}
              {activityactivity} {activityexpGained}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};
