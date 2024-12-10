import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Progress, Button, Space } from 'antd';
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { ImageCacheService } from '../../services/imageCache';

interface ImageCacheStatusProps {
  imageCacheService: ImageCacheService;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageCacheStatus: React.FC<ImageCacheStatusProps> = ({
  imageCacheService,
  className,
  style
}) => {
  const [stats, setStats] = useState({
    size: 0,
    entries: 0,
    hits: 0,
    misses: 0,
    hitRate: 0
  });

  useEffect(() => {
    const subscription = imageCacheService.getState().subscribe(() => {
      setStats(imageCacheService.getStats());
    });

    return () => subscription.unsubscribe();
  }, [imageCacheService]);

  const handleClear = () => {
    imageCacheService.clear();
  };

  return (
    <Card
      title="图片缓存状态"
      className={className}
      style={style}
      extra={
        <Space>
          <Button
            icon={<DeleteOutlined />}
            onClick={handleClear}
            disabled={stats.entries === 0}
          >
            清理缓存
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => setStats(imageCacheService.getStats())}
          >
            刷新
          </Button>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="缓存大小"
            value={stats.size.toFixed(2)}
            suffix="MB"
            prefix={<CloudUploadOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="缓存条目"
            value={stats.entries}
            prefix={<CloudDownloadOutlined />}
          />
        </Col>
        <Col span={24}>
          <div style={{ padding: '0 24px' }}>
            <Progress
              percent={Math.round(stats.hitRate * 100)}
              status="active"
              format={percent => `命中率 ${percent}%`}
            />
          </div>
        </Col>
        <Col span={12}>
          <Statistic
            title="缓存命中"
            value={stats.hits}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="缓存未命中"
            value={stats.misses}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>
    </Card>
  );
}; 