import React from 'react';

import { Card, Progress, Timeline } from 'antd';
import { getGoalProgress } from '../../services/health.service';
import { useQuery } from 'react-query';

export const GoalTracking: React.FC = () => {
  const { data: goals } = useQuery('healthGoals', getGoalProgress);

  return (
    <Card title="目标达成进度">
      {goals?.map(goal => (
        <div key={goal.id} className="goal-item">
          <h4>{goal.name}</h4>
          <Progress percent={goal.progress} status={goal.progress >= 100 ? 'success' : 'active'} />
          <Timeline>
            {goal.milestones.map(milestone => (
              <Timeline.Item key={milestone.id} color={milestone.completed ? 'green' : 'gray'}>
                {milestone.description}
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      ))}
    </Card>
  );
};
