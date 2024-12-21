import React from 'react';

import {
  LoginOutlined,
  UserOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
export const activityIcons: Record<string, React.ReactNode> = {
  login: <LoginOutlined />,
  complete_profile: <UserOutlined />,
  health_record: <HeartOutlined />,
  exercise: <ThunderboltOutlined />,
  diet_record: <CoffeeOutlined />,
};

export function getActivityIcon(type: string): React.ReactNode {
  return activityIcons[type] || <UserOutlined />;
}
