import React, { useState, useEffect } from 'react';

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { List, Badge, Button, Empty, Spin, Typography, Space, Dropdown, Menu, Modal } from 'antd';
dayjs.e;
xtend(relativeTime);
dayjs.locale('zh-cn');

const { Text, Title } = Typography;
const { confirm } = Modal;

interface INotification {
  /** _id 的描述 */
  _id: string;
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** status 的描述 */
  status: 'unread' | 'read' | 'archived';
  /** priority 的描述 */
  priority: 'low' | 'normal' | 'high' | 'urgent';
  /** sender 的描述 */
  sender?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  /** relatedType 的描述 */
  relatedType?: string;
  /** relatedId 的描述 */
  relatedId?: string;
  /** metadata 的描述 */
  metadata?: Record<string, any>;
  /** createdAt 的描述 */
  createdAt: string;
}

interface INotificationListProps {
  /** notifications 的描述 */
  notifications: INotification[];
  /** loading 的描述 */
  loading?: boolean;
  /** hasMore 的描述 */
  hasMore?: boolean;
  /** onLoadMore 的描述 */
  onLoadMore?: () => void;
  /** onMarkAsRead 的描述 */
  onMarkAsRead?: (notificationIds: string[]) => void;
  /** onArchive 的描述 */
  onArchive?: (notificationIds: string[]) => void;
  /** onDelete 的描述 */
  onDelete?: (notificationIds: string[]) => void;
  /** onFilterChange 的描述 */
  onFilterChange?: (filters: Record<string, any>) => void;
  /** onNotificationClick 的描述 */
  onNotificationClick?: (notification: INotification) => void;
  /** className 的描述 */
  className?: string;
  /** style 的描述 */
  style?: React.CSSProperties;
}

export const NotificationList: React.FC<INotificationListProps> = ({
  notifications,
  loading = false,
  hasMore = false,
  onLoadMore,
  onMarkAsRead,
  onArchive,
  onDelete,
  onFilterChange,
  onNotificationClick,
  className,
  style,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    priority: [],
    status: ['unread'],
  });

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  const handleMarkAsRead = () => {
    if (selectedItems.length > 0) {
      onMarkAsRead?.(selectedItems);
      setSelectedItems([]);
    }
  };

  const handleArchive = () => {
    if (selectedItems.length === 0) return;
    confirm({
      title: '确认归档',
      icon: <ExclamationCircleOutlined />,
      content: '确定要归档选中的通知吗？',
      onOk() {
        onArchive?.(selectedItems);
        setSelectedItems([]);
      },
    });
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) return;
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除选中的通知吗？此操作不可恢复。',
      okType: 'danger',
      onOk() {
        onDelete?.(selectedItems);
        setSelectedItems([]);
      },
    });
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const color = priority === 'urgent' ? 'red' : priority === 'high' ? 'orange' : '#1890ff';
    switch (type) {
      case 'mention':
        return <BellOutlined style={{ color }} />;
      case 'like':
        return <BellOutlined style={{ color }} />;
      case 'comment':
        return <BellOutlined style={{ color }} />;
      case 'follow':
        return <BellOutlined style={{ color }} />;
      case 'system':
        return <BellOutlined style={{ color }} />;
      default:
        return <BellOutlined style={{ color }} />;
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'mention':
        return '@提醒';
      case 'like':
        return '点赞';
      case 'comment':
        return '评论';
      case 'follow':
        return '关注';
      case 'system':
        return '系统通知';
      default:
        return type;
    }
  };

  const filterMenu = (
    <Menu>
      <Menu.SubMenu title="通知类型">
        {['mention', 'like', 'comment', 'follow', 'system'].map(type => (
          <Menu.Item key={type}>
            <Space>
              {filters.type.includes(type) && <CheckOutlined />}
              <span>{getNotificationTypeText(type)}</span>
            </Space>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title="优先级">
        {['low', 'normal', 'high', 'urgent'].map(priority => (
          <Menu.Item key={priority}>
            <Space>
              {filters.priority.includes(priority) && <CheckOutlined />}
              <span>{priority}</span>
            </Space>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title="状态">
        {['unread', 'read', 'archived'].map(status => (
          <Menu.Item key={status}>
            <Space>
              {filters.status.includes(status) && <CheckOutlined />}
              <span>{status}</span>
            </Space>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    </Menu>
  );

  const loadMore = hasMore ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button onClick={onLoadMore} loading={loading}>
        加载更多
      </Button>
    </div>
  ) : null;

  return (
    <div className={className} style={style}>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4}>通知中心</Title>
          <Space>
            <Dropdown
              overlay={filterMenu}
              trigger={['click']}
              visible={filterVisible}
              onVisibleChange={setFilterVisible}
            >
              <Button icon={<FilterOutlined />}>筛选</Button>
            </Dropdown>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleMarkAsRead}
              disabled={selectedItems.length === 0}
            >
              标记已读
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleArchive}
              disabled={selectedItems.length === 0}
            >
              归档
            </Button>
          </Space>
        </Space>
      </div>

      <List
        itemLayout="vertical"
        loading={loading}
        dataSource={notifications}
        loadMore={loadMore}
        locale={{
          emptyText: <Empty description="暂无通知" />,
        }}
        renderItem={notification => {
          const menu = (
            <Menu>
              <Menu.Item
                key="read"
                icon={<CheckOutlined />}
                onClick={() => onMarkAsRead?.([notification._id])}
              >
                标记为已读
              </Menu.Item>
              <Menu.Item
                key="archive"
                icon={<DeleteOutlined />}
                onClick={() => onArchive?.([notification._id])}
              >
                归档
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                danger
                onClick={() => {
                  confirm({
                    title: '确认删除',
                    icon: <ExclamationCircleOutlined />,
                    content: '确定要删除这条通知吗？此操作不可恢复。',
                    okType: 'danger',
                    onOk() {
                      onDelete?.([notification._id]);
                    },
                  });
                }}
              >
                删除
              </Menu.Item>
            </Menu>
          );

          return (
            <List.Item
              key={notification._id}
              actions={[
                <Space key="actions">
                  <Text type="secondary">{dayjs(notification.createdAt).fromNow()}</Text>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </Space>,
              ]}
              onClick={() => onNotificationClick?.(notification)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={notification.status === 'unread'}>
                    {getNotificationIcon(notification.type, notification.priority)}
                  </Badge>
                }
                title={
                  <Space>
                    <Text strong>{notification.title}</Text>
                    {notification.priority === 'urgent' && <Badge color="red" text="紧急" />}
                    {notification.priority === 'high' && <Badge color="orange" text="重要" />}
                    <Tag>{getNotificationTypeText(notification.type)}</Tag>
                  </Space>
                }
                description={notification.content}
              />
              {notification.metadata && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">{JSON.stringify(notification.metadata)}</Text>
                </div>
              )}
            </List.Item>
          );
        }}
      />
    </div>
  );
};
