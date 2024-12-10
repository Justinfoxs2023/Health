import React from 'react';
import { Card, Timeline, Tag, Space, Typography, Tooltip } from 'antd';
import { 
  SafetyCertificateOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Text } = Typography;

interface SecurityCheck {
  type: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: number;
}

interface ImageSecurityStatusProps {
  checks: SecurityCheck[];
}

export const ImageSecurityStatus: React.FC<ImageSecurityStatusProps> = ({
  checks,
}) => {
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCheckTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      file_type: '文件类型',
      file_size: '文件大小',
      integrity: '完整性',
      metadata: '元数据',
    };
    return typeMap[type] || type;
  };

  const isImageSafe = !checks.some(check => check.status === 'error');

  return (
    <Card
      title={
        <Space>
          <SafetyCertificateOutlined />
          {t('安全检查结果')}
          <Tag color={isImageSafe ? 'success' : 'error'}>
            {isImageSafe ? t('安全') : t('不安全')}
          </Tag>
        </Space>
      }
    >
      <Timeline>
        {checks.map((check, index) => (
          <Timeline.Item
            key={index}
            dot={getStatusIcon(check.status)}
            color={getStatusColor(check.status)}
          >
            <Space direction="vertical" size={0}>
              <Space>
                <Text strong>{t(getCheckTypeLabel(check.type))}</Text>
                <Tag color={getStatusColor(check.status)}>
                  {t(check.status === 'success' ? '通过' : check.status === 'warning' ? '警告' : '失败')}
                </Tag>
              </Space>
              <Tooltip title={dayjs(check.timestamp).format('YYYY-MM-DD HH:mm:ss')}>
                <Text type="secondary">
                  {check.message}
                </Text>
              </Tooltip>
            </Space>
          </Timeline.Item>
        ))}
      </Timeline>

      {checks.some(check => check.status === 'warning') && (
        <Text type="warning" style={{ marginTop: 16, display: 'block' }}>
          {t('注意：图片包含一些潜在的安全风险，但不影响使用。')}
        </Text>
      )}

      {checks.some(check => check.status === 'error') && (
        <Text type="danger" style={{ marginTop: 16, display: 'block' }}>
          {t('警告：图片未通过安全检查，不建议使用。')}
        </Text>
      )}
    </Card>
  );
}; 