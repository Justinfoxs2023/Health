import React, { useEffect, useState } from 'react';
import { Progress, Card, Typography, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export const ImageProcessingStatus: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<QueueStatus>({
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/image-processing/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('获取队列状态失败:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const total = status.waiting + status.active + status.completed + status.failed;
  const progress = total > 0 ? Math.round((status.completed / total) * 100) : 0;

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>{t('图片处理状态')}</Title>
        
        <Progress percent={progress} />
        
        <Space wrap>
          <Tag icon={<SyncOutlined spin />} color="processing">
            {t('等待中')}: {status.waiting}
          </Tag>
          <Tag icon={<SyncOutlined spin />} color="blue">
            {t('处理中')}: {status.active}
          </Tag>
          <Tag icon={<CheckCircleOutlined />} color="success">
            {t('已完成')}: {status.completed}
          </Tag>
          <Tag icon={<CloseCircleOutlined />} color="error">
            {t('失败')}: {status.failed}
          </Tag>
        </Space>

        <Text type="secondary">
          {t('总任务数')}: {total}
        </Text>
      </Space>
    </Card>
  );
}; 