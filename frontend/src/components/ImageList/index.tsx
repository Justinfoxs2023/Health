import React, { useState, useEffect } from 'react';
import { List, Card, Image, Space, Tag, Popconfirm, Button, message } from 'antd';
import { DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface ImageItem {
  _id: string;
  filename: string;
  status: string;
  optimized: boolean;
  optimizedUrl?: string;
  thumbnailUrl?: string;
  metadata: {
    uploadedAt: string;
    compression?: {
      originalSize: number;
      compressedSize: number;
      ratio: number;
    };
  };
}

interface ImageListProps {
  onDelete?: (imageId: string) => void;
  onRefresh?: () => void;
}

export const ImageList: React.FC<ImageListProps> = ({
  onDelete,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/images/list?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error('获取图片列表失败');
      }
      const data = await response.json();
      setImages(data.images);
      setTotal(data.total);
    } catch (error) {
      message.error(t('获取图片列表失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除图片失败');
      }

      message.success(t('删除成功'));
      onDelete?.(imageId);
      fetchImages();
    } catch (error) {
      message.error(t('删除失败'));
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatus = (status: string) => {
    const statusMap = {
      pending: { color: 'warning', text: '等待处理' },
      processing: { color: 'processing', text: '处理中' },
      ready: { color: 'success', text: '已完成' },
      error: { color: 'error', text: '处理失败' },
    };

    const { color, text } = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
    return <Tag color={color}>{t(text)}</Tag>;
  };

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      dataSource={images}
      loading={loading}
      pagination={{
        current: page,
        pageSize: 10,
        total,
        onChange: setPage,
      }}
      renderItem={(item) => (
        <List.Item>
          <Card
            hoverable
            cover={
              <Image
                alt={item.filename}
                src={item.thumbnailUrl || item.optimizedUrl}
                fallback="/images/fallback.png"
                style={{ objectFit: 'cover', height: 200 }}
              />
            }
            actions={[
              <Button
                key="view"
                type="text"
                icon={<EyeOutlined />}
                onClick={() => window.open(item.optimizedUrl || item.thumbnailUrl)}
              />,
              <Button
                key="download"
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(item.optimizedUrl || item.thumbnailUrl || '', item.filename)}
                disabled={!item.optimizedUrl}
              />,
              <Popconfirm
                key="delete"
                title={t('确定要删除这张图片吗？')}
                onConfirm={() => handleDelete(item._id)}
                okText={t('确定')}
                cancelText={t('取消')}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={item.filename}
              description={
                <Space direction="vertical" size="small">
                  {renderStatus(item.status)}
                  <span>{dayjs(item.metadata.uploadedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                  {item.metadata.compression && (
                    <span>
                      {t('压缩率')}: {Math.round(item.metadata.compression.ratio * 100)}%
                    </span>
                  )}
                </Space>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );
}; 