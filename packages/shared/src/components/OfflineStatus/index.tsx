import React from 'react';

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import {
  SyncOutlined,
  CloudOutlined,
  CloudOffOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Badge, Button, Tooltip, Space, Typography, Progress, Alert } from 'antd';
dayjs.l;
ocale('zh-cn');

const { Text } = Typography;

interface IOfflineStatusProps {
  /** isOffline 的描述 */
  isOffline: boolean;
  /** isSyncing 的描述 */
  isSyncing: boolean;
  /** lastSyncTime 的描述 */
  lastSyncTime: Date | null;
  /** error 的描述 */
  error: Error | null;
  /** pendingChanges 的描述 */
  pendingChanges: number;
  /** syncProgress 的描述 */
  syncProgress?: number;
  /** onSync 的描述 */
  onSync?: () => void;
  /** onRetry 的描述 */
  onRetry?: () => void;
  /** className 的描述 */
  className?: string;
  /** style 的描述 */
  style?: React.CSSProperties;
}

export const OfflineStatus: React.FC<IOfflineStatusProps> = ({
  isOffline,
  isSyncing,
  lastSyncTime,
  error,
  pendingChanges,
  syncProgress,
  onSync,
  onRetry,
  className,
  style,
}) => {
  const getStatusIcon = () => {
    if (isOffline) {
      return <CloudOffOutlined style={{ color: '#ff4d4f' }} />;
    }
    if (error) {
      return <WarningOutlined style={{ color: '#faad14' }} />;
    }
    if (isSyncing) {
      return <LoadingOutlined style={{ color: '#1890ff' }} />;
    }
    if (pendingChanges > 0) {
      return <CloudOutlined style={{ color: '#faad14' }} />;
    }
    return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
  };

  const getStatusText = () => {
    if (isOffline) {
      return '离线模式';
    }
    if (error) {
      return '同步失败';
    }
    if (isSyncing) {
      return '正在同步';
    }
    if (pendingChanges > 0) {
      return `${pendingChanges}个更改待同步`;
    }
    return '已同步';
  };

  const getTooltipTitle = () => {
    const parts = [];

    if (isOffline) {
      parts.push('当前处于离线模式，数据将在恢复网络连接后自动同步');
    }

    if (error) {
      parts.push(`同步失败: ${error.message}`);
    }

    if (lastSyncTime) {
      parts.push(`上次同步: ${dayjs(lastSyncTime).fromNow()}`);
    }

    if (pendingChanges > 0) {
      parts.push(`待同步更改: ${pendingChanges}个`);
    }

    return parts.join('\n');
  };

  return (
    <div className={className} style={style}>
      {error && (
        <Alert
          message="同步失败"
          description={error.message}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={onRetry}>
              重试
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Badge count={pendingChanges > 0 ? pendingChanges : 0} size="small" offset={[-5, 5]}>
              {getStatusIcon()}
            </Badge>
            <Tooltip title={getTooltipTitle()}>
              <Text>{getStatusText()}</Text>
            </Tooltip>
          </Space>

          <Button
            type="link"
            icon={<SyncOutlined spin={isSyncing} />}
            onClick={onSync}
            disabled={isOffline || isSyncing}
            size="small"
          >
            {isSyncing ? '同步中' : '立即同步'}
          </Button>
        </Space>

        {isSyncing && typeof syncProgress === 'number' && (
          <Progress
            percent={syncProgress}
            size="small"
            status={error ? 'exception' : undefined}
            showInfo={false}
          />
        )}

        {lastSyncTime && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            上次同步: {dayjs(lastSyncTime).fromNow()}
          </Text>
        )}
      </Space>
    </div>
  );
};
