import React, { useEffect, useState } from 'react';
import { Card, Progress, Space, Statistic, Typography, Button } from 'antd';
import { 
  DatabaseOutlined, 
  CloudUploadOutlined, 
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface CacheStats {
  size: number;
  itemCount: number;
  hitRate: number;
}

export const ImageCacheStatus: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<CacheStats>({
    size: 0,
    itemCount: 0,
    hitRate: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/images/cache/stats');
      if (!response.ok) {
        throw new Error('获取缓存统计失败');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('获取缓存统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 每30秒更新一次
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/images/cache/clear', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('清理缓存失败');
      }
      await fetchStats();
    } catch (error) {
      console.error('清理缓存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const maxSize = 1024 * 1024 * 1024; // 1GB
  const usagePercent = (stats.size / maxSize) * 100;

  return (
    <Card
      title={
        <Space>
          <DatabaseOutlined />
          {t('图片缓存状态')}
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchStats}
            loading={loading}
          >
            {t('刷新')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={handleClearCache}
            loading={loading}
            danger
          >
            {t('清理缓存')}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>{t('缓存使用情况')}</Title>
        <Progress
          percent={Number(usagePercent.toFixed(1))}
          status={usagePercent > 90 ? 'exception' : 'normal'}
          format={(percent) => `${formatSize(stats.size)} / ${formatSize(maxSize)}`}
        />

        <Space size={48}>
          <Statistic
            title={t('缓存项数')}
            value={stats.itemCount}
            prefix={<CloudUploadOutlined />}
          />
          <Statistic
            title={t('命中率')}
            value={stats.hitRate * 100}
            precision={2}
            suffix="%"
            valueStyle={{
              color: stats.hitRate > 0.8 ? '#3f8600' : stats.hitRate > 0.5 ? '#faad14' : '#cf1322',
            }}
          />
        </Space>
      </Space>
    </Card>
  );
}; 