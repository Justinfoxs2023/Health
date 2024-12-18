import React from 'react';

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import {
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Card, Button, Tag, Progress, Space, Typography, Tooltip, Avatar } from 'antd';
dayjs.locale('zh-cn');

const { Title, Text, Paragraph } = Typography;

interface IActivityCardProps {
  /** activity 的描述 */
  activity: {
    _id: string;
    title: string;
    description: string;
    type: 'challenge' | 'event' | 'competition';
    category: string;
    startDate: string;
    endDate: string;
    status: 'draft' | 'active' | 'completed' | 'cancelled';
    participantLimit: number;
    currentParticipants: number;
    location?: string;
    organizer?: {
      _id: string;
      name: string;
      avatar?: string;
    };
    rewards: {
      points: number;
      badges: string[];
      achievements: string[];
      customRewards?: Record<string, any>;
    };
    rules?: string[];
    requirements?: string[];
    images?: string[];
  };
  /** onJoin 的描述 */
  onJoin?: () => void;
  /** onViewDetails 的描述 */
  onViewDetails?: () => void;
  /** loading 的描述 */
  loading?: boolean;
  /** participated 的描述 */
  participated?: boolean;
  /** className 的描述 */
  className?: string;
  /** style 的描述 */
  style?: React.CSSProperties;
}

export const ActivityCard: React.FC<IActivityCardProps> = ({
  activity,
  onJoin,
  onViewDetails,
  loading = false,
  participated = false,
  className,
  style,
}) => {
  const {
    title,
    description,
    type,
    category,
    startDate,
    endDate,
    status,
    participantLimit,
    currentParticipants,
    location,
    organizer,
    rewards,
    rules,
    requirements,
    images,
  } = activity;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge':
        return '🏆';
      case 'event':
        return '🎯';
      case 'competition':
        return '🎮';
      default:
        return '📌';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '未开始';
      case 'active':
        return '进行中';
      case 'completed':
        return '已结束';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const participationProgress = (currentParticipants / participantLimit) * 100;
  const isActive = status === 'active';
  const canJoin = isActive && currentParticipants < participantLimit && !participated;
  const now = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const isUpcoming = now.isBefore(start);
  const isOngoing = now.isAfter(start) && now.isBefore(end);
  const isEnded = now.isAfter(end);

  const getTimeStatus = () => {
    if (isUpcoming) {
      return `${start.fromNow()}开始`;
    }
    if (isOngoing) {
      return `${end.fromNow()}结束`;
    }
    if (isEnded) {
      return `已于${end.fromNow()}结束`;
    }
    return '';
  };

  return (
    <Card
      hoverable
      className={className}
      style={{ marginBottom: 16, ...style }}
      cover={
        images?.[0] && (
          <div style={{ height: 200, overflow: 'hidden' }}>
            <img
              alt={title}
              src={images[0]}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )
      }
      actions={[
        <Button key="join" type="primary" onClick={onJoin} loading={loading} disabled={!canJoin}>
          {participated ? '已参加' : '立即参加'}
        </Button>,
        <Button key="details" onClick={onViewDetails}>
          查看详情
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space align="start">
          <div style={{ fontSize: 24 }}>{getTypeIcon(type)}</div>
          <div style={{ flex: 1 }}>
            <Title level={4} style={{ marginBottom: 4 }}>
              {title}
            </Title>
            <Space size={[0, 8]} wrap>
              <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
              <Tag color="blue">{category}</Tag>
              <Tag icon={<TrophyOutlined />}>{rewards.points} 积分</Tag>
              <Tooltip title={getTimeStatus()}>
                <Tag icon={<ClockCircleOutlined />}>
                  {isUpcoming ? '即将开始' : isOngoing ? '进行中' : '已结束'}
                </Tag>
              </Tooltip>
            </Space>
          </div>
        </Space>

        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '展开' }} type="secondary">
          {description}
        </Paragraph>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space>
            <CalendarOutlined />
            <Text>
              {dayjs(startDate).format('YYYY-MM-DD HH:mm')} 至{' '}
              {dayjs(endDate).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Space>

          {location && (
            <Space>
              <EnvironmentOutlined />
              <Text>{location}</Text>
            </Space>
          )}

          <div>
            <Space align="center" style={{ marginBottom: 8 }}>
              <TeamOutlined />
              <Text>
                参与人数: {currentParticipants}/{participantLimit}
              </Text>
            </Space>
            <Progress
              percent={participationProgress}
              size="small"
              status={participationProgress >= 100 ? 'exception' : 'active'}
              showInfo={false}
            />
          </div>

          {organizer && (
            <Space>
              <Avatar size="small" src={organizer.avatar} />
              <Text type="secondary">主办方：{organizer.name}</Text>
            </Space>
          )}

          {rewards.badges && rewards.badges.length > 0 && (
            <div>
              <Text strong>可获得徽章：</Text>
              <Space size={[4, 8]} wrap>
                {rewards.badges.map((badge, index) => (
                  <Tag key={index} color="gold">
                    {badge}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {rules && rules.length > 0 && (
            <Tooltip
              title={
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              }
            >
              <Button type="link" size="small">
                活动规则
              </Button>
            </Tooltip>
          )}

          {requirements && requirements.length > 0 && (
            <Tooltip
              title={
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              }
            >
              <Button type="link" size="small">
                参与要求
              </Button>
            </Tooltip>
          )}
        </Space>
      </Space>
    </Card>
  );
};
