import React, { useState } from 'react';

import {
  Card,
  Box,
  Typography,
  LinearProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';

interface
 GoalTrackerProps {
  goal: HealthGoal;
  progress: number;
  onEdit: goal: HealthGoal  void;
  onDelete: goalId: string  void;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ goal, progress, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const progressPercentage = (progress / goal.target) * 100;
  const isCompleted = progressPercentage >= 100;

  return (
    <Card className="goal-tracker">
      <Box className="goal-header">
        <Typography variant="h6">{goaltitle}</Typography>
        <IconButton onClick={handleMenuOpen}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onEdit?.(goal);
              handleMenuClose();
            }}
          >
            <Edit fontSize="small" /> 编辑
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete?.(goal.id);
              handleMenuClose();
            }}
          >
            <Delete fontSize="small" /> 删除
          </MenuItem>
        </Menu>
      </Box>

      <Box className="goal-progress">
        <LinearProgress
          variant="determinate"
          value={Math.min(progressPercentage, 100)}
          color={isCompleted ? 'success' : 'primary'}
        />
        <Typography variant="body2" color="textSecondary">
          {progress} / {goaltarget} {goalunit}
        </Typography>
      </Box>

      <Box className="goal-details" style={{ display: showDetails ? 'block' : 'none' }}>
        <Typography variant="body2">{goaldescription}</Typography>
        <Box className="goal-milestones">
          {goal.milestones?.map((milestone, index) => (
            <Box key={index} className="milestone">
              <Typography variant="caption">{milestonetitle}</Typography>
              <LinearProgress variant="determinate" value={(milestone.value / goal.target) * 100} />
            </Box>
          ))}
        </Box>
      </Box>

      <Button size="small" onClick={ => setShowDetailsshowDetails}>
        {showDetails    }
      </Button>
    </Card>
  );
};
