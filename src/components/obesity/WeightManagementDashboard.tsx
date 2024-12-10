import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  LinearProgress,
  Button,
  Dialog
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface WeightManagementDashboardProps {
  userId: string;
  weightManagement: ObesityManagement['weightManagement'];
  metabolicMetrics: ObesityManagement['metabolicMetrics'];
  interventionPlan: ObesityManagement['interventionPlan'];
}

export const WeightManagementDashboard: React.FC<WeightManagementDashboardProps> = ({
  userId,
  weightManagement,
  metabolicMetrics,
  interventionPlan
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  return (
    <Box className="weight-management-dashboard">
      {/* 进度概览 */}
      <Card className="progress-overview">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">减重进度</Typography>
            <Box className="weight-progress">
              <Typography variant="h4">
                {weightManagement.currentStats.weight} kg
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateWeightProgress(
                  weightManagement.currentStats,
                  weightManagement.targetStats
                )}
              />
              <Typography variant="body2">
                距离目标还有 {calculateRemainingWeight(
                  weightManagement.currentStats,
                  weightManagement.targetStats
                )} kg
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6">代谢健康</Typography>
            <Box className="metabolic-indicators">
              <MetabolicIndicator
                label="基础代谢率"
                value={metabolicMetrics.basalMetabolicRate}
                unit="kcal/day"
              />
              <MetabolicIndicator
                label="代谢年龄"
                value={metabolicMetrics.metabolicAge}
                unit="岁"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 体重趋势图 */}
      <Card className="weight-trend">
        <Box className="chart-header">
          <Typography variant="h6">体重变化趋势</Typography>
          <TimeRangeSelector
            value={selectedTimeRange}
            onChange={setSelectedTimeRange}
          />
        </Box>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightManagement.weightHistory}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 干预计划执行 */}
      <Card className="intervention-plan">
        <Typography variant="h6">今日计划</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <PlanCard
              title="饮食计划"
              plan={interventionPlan.dietaryPlan}
              progress={calculateDietProgress(interventionPlan.dietaryPlan)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PlanCard
              title="运动计划"
              plan={interventionPlan.exercisePlan}
              progress={calculateExerciseProgress(interventionPlan.exercisePlan)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PlanCard
              title="行为改善"
              plan={interventionPlan.behavioralTherapy}
              progress={calculateBehaviorProgress(interventionPlan.behavioralTherapy)}
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}; 