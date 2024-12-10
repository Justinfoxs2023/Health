import React, { useEffect, useState } from 'react';
import { Card, List, Tag, Typography, Space } from 'antd';
import {
  SafetyCertificateOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { ImageSecurityService } from '../../services/imageSecurity';

const { Text } = Typography;

interface SecurityCheck {
  type: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: number;
}

interface ImageSecurityStatusProps {
  imageSecurityService: ImageSecurityService;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageSecurityStatus: React.FC<ImageSecurityStatusProps> = ({
  imageSecurityService,
  className,
  style
}) => {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);

  useEffect(() => {
    const subscription = imageSecurityService.getState().subscribe(state => {
      setSecurityChecks(state.securityChecks);
    });

    return () => subscription.unsubscribe();
  }, [imageSecurityService]);

  const getStatusIcon = (status: SecurityCheck['status']) => {
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

  const getStatusTag = (status: SecurityCheck['status']) => {
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
        renderItem={(check) => (
          <List.Item>
            <Space align="start">
              {getStatusIcon(check.status)}
              <div>
                <Text strong>{check.type}</Text>
                <br />
                <Text type={check.status === 'error' ? 'danger' : undefined}>
                  {check.message}
                </Text>
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
          emptyText: '暂无安全检查记录'
        }}
      />
    </Card>
  );
}; 