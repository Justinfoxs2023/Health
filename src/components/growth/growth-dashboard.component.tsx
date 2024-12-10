import React from 'react';
import { Card, Progress, List, Avatar } from 'antd';
import { useGrowthMetrics } from '@/hooks/useGrowthMetrics';
import { GrowthMetrics } from '@/types/growth.types';

export const GrowthDashboard: React.FC = () => {
  const { metrics, loading } = useGrowthMetrics();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="growth-dashboard">
      <Card title="成长概览">
        <div className="metrics-overview">
          <div className="metric-item">
            <h4>总成长值</h4>
            <div className="value">{metrics.totalPoints}</div>
          </div>
          <div className="metric-item">
            <h4>当前等级</h4>
            <div className="value">Lv.{metrics.currentLevel}</div>
          </div>
        </div>
        <Progress 
          percent={calculateLevelProgress(metrics)} 
          status="active"
        />
      </Card>

      <Card title="最近活动" className="recent-activities">
        <List
          dataSource={metrics.recentActivities}
          renderItem={activity => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={getActivityIcon(activity.type)} />}
                title={getActivityTitle(activity.type)}
                description={`获得 ${activity.points} 成长值`}
              />
              <div>{formatTime(activity.timestamp)}</div>
            </List.Item>
          )}
        />
      </Card>

      <Card title="成就墙" className="achievements">
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={metrics.achievements}
          renderItem={achievement => (
            <List.Item>
              <Card>
                <Avatar size={64} src={achievement.icon} />
                <h4>{achievement.type}</h4>
                <p>{achievement.description}</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

// 辅助函数
function calculateLevelProgress(metrics: GrowthMetrics): number {
  const { totalPoints, currentLevel, nextLevelPoints } = metrics;
  const currentLevelPoints = getLevelThreshold(currentLevel - 1);
  const progress = ((totalPoints - currentLevelPoints) / 
    (nextLevelPoints - currentLevelPoints)) * 100;
  return Math.min(progress, 100);
}

function getLevelThreshold(level: number): number {
  const thresholds = [0, 100, 300, 600, 1000, 2000];
  return thresholds[level] || 0;
}

function getActivityIcon(type: string): React.ReactNode {
  // 实现活动图标映射
  return null;
}

function getActivityTitle(type: string): string {
  const titles = {
    login: '每日登录',
    complete_profile: '完善资料',
    health_record: '记录健康数据',
    exercise: '运动打卡',
    diet_record: '饮食记录'
  };
  return titles[type] || type;
}

function formatTime(timestamp: Date): string {
  return new Date(timestamp).toLocaleString();
} 