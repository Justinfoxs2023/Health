import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';

interface BehaviorInterventionManagerProps {
  userId: string;
  behaviorPlan: BehaviorPlan;
  progressData: BehaviorProgress;
  onUpdateProgress: (progress: BehaviorProgress) => Promise<void>;
}

export const BehaviorInterventionManager: React.FC<BehaviorInterventionManagerProps> = ({
  userId,
  behaviorPlan,
  progressData,
  onUpdateProgress
}) => {
  return (
    <Box className="behavior-intervention-manager">
      {/* 行为改变阶段追踪 */}
      <Card className="behavior-stage-tracker">
        <Typography variant="h6">行为改变进程</Typography>
        <Stepper activeStep={progressData.currentStage}>
          {behaviorPlan.stages.map((stage, index) => (
            <Step key={index}>
              <StepLabel>{stage.name}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      {/* 每日行为目标 */}
      <Card className="daily-behavior-goals">
        <Typography variant="h6">今日行为目标</Typography>
        <Grid container spacing={2}>
          {behaviorPlan.dailyGoals.map(goal => (
            <Grid item xs={12} md={4} key={goal.id}>
              <BehaviorGoalCard
                goal={goal}
                progress={progressData.goalProgress[goal.id]}
                onProgressUpdate={handleGoalProgress}
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* 情绪管理工具 */}
      <Card className="emotion-management">
        <Typography variant="h6">情绪管理工具</Typography>
        <EmotionTracker
          emotionalData={progressData.emotionalData}
          onEmotionLog={handleEmotionLog}
        />
        <CopingStrategies
          strategies={behaviorPlan.copingStrategies}
          onStrategyUse={handleStrategyUse}
        />
      </Card>

      {/* 习惯培养追踪 */}
      <Card className="habit-formation">
        <Typography variant="h6">健康习惯培养</Typography>
        <HabitTracker
          habits={behaviorPlan.targetHabits}
          progress={progressData.habitProgress}
          onHabitCheck={handleHabitCheck}
        />
      </Card>
    </Box>
  );
};

// 行为目标卡片
const BehaviorGoalCard: React.FC<{
  goal: BehaviorGoal;
  progress: number;
  onProgressUpdate: (goalId: string, progress: number) => void;
}> = ({ goal, progress, onProgressUpdate }) => {
  return (
    <Card className="behavior-goal-card">
      <Typography variant="subtitle1">{goal.description}</Typography>
      <Box className="goal-progress">
        <CircularProgress
          variant="determinate"
          value={progress}
          color={progress >= 100 ? "success" : "primary"}
        />
        <Typography variant="body2">
          {progress}% 完成
        </Typography>
      </Box>
      <Box className="goal-actions">
        {/* 目标相关的操作按钮 */}
      </Box>
    </Card>
  );
}; 