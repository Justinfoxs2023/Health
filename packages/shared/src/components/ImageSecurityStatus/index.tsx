import React, { useEffect, useState } from 'react';

import {
  SafetyCertificateOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Card, List, Tag, Typography, Space } from 'antd';
import { ImageSecurityService } from '../../services/imageSecurity';
const { Text } = Typography;

interface ISecurityCheck {
  /** type 的描述 */
  type: string;
  /** status 的描述 */
  status: 'success' | 'error' | 'warning';
  /** message 的描述 */
  message: string;
  /** timestamp 的描述 */
  timestamp: number;
}

interface ImageSecurityStatusProps {
  /** imageSecurityService 的描述 */
  imageSecurityService: ImageSecurityService;
  /** className 的描述 */
  className?: string;
  /** style 的描述 */
  style?: React.CSSProperties;
}

export const ImageSecurityStatus: React.FC<ImageSecurityStatusProps> = ({
  imageSecurityService,
  className,
  style,
}) => {
  const [securityChecks, setSecurityChecks] = useState<ISecurityCheck[]>([]);

  useEffect(() => {
    const subscription = imageSecurityService.getState().subscribe(state => {
      setSecurityChecks(state.securityChecks);
    });

    return () => subscription.unsubscribe();
  }, [imageSecurityService]);

  const getStatusIcon = (status: ISecurityCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  const getStatusTag = (status: ISecurityCheck['status']) => {
    switch (status) {
      case 'success':
        return <Tag color="success">通过</Tag>;
      case 'error':
        return <Tag color="error">失败</Tag>;
      case 'warning':
        return <Tag color="warning">警告</Tag>;
      default:
        return null;
    }
  };

  return (
    <Card
      title={
        <Space>
          <SafetyCertificateOutlined />
          <span>图片安全状态</span>
        </Space>
      }
      className={className}
      style={style}
    >
      <List
        dataSource={securityChecks}
        renderItem={check => (
          <List.Item>
            <Space align="start">
              {getStatusIcon(check.status)}
              <div>
                <Text strong>{check.type}</Text>
                <br />
                <Text type={check.status === 'error' ? 'danger' : undefined}>{check.message}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {new Date(check.timestamp).toLocaleString()}
                </Text>
              </div>
              {getStatusTag(check.status)}
            </Space>
          </List.Item>
        )}
        locale={{
          emptyText: '暂无安全检查记录',
        }}
      />
    </Card>
  );
};
