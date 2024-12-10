import React, { useState } from 'react';
import { Upload, message, Progress, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RcFile } from 'antd/lib/upload';
import { ImageProcessingStatus } from '../ImageProcessingStatus';

const { Dragger } = Upload;

interface ImageUploadProps {
  onSuccess?: (imageId: string) => void;
  maxSize?: number;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onSuccess,
  maxSize = 10 * 1024 * 1024, // 默认10MB
  accept = 'image/*',
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const beforeUpload = (file: RcFile) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      message.error(t('只能上传图片文件'));
      return false;
    }

    // 检查文件大小
    if (file.size > maxSize) {
      message.error(t('文件大小不能超过 {{size}}MB', { size: maxSize / 1024 / 1024 }));
      return false;
    }

    return true;
  };

  const customRequest = async (options: any) => {
    const { file, onError, onSuccess: onUploadSuccess } = options;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
        headers: {
          // 不设置Content-Type，让浏览器自动设置
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      message.success(t('图片上传成功'));
      onUploadSuccess(data);
      onSuccess?.(data.imageId);
    } catch (error) {
      message.error(t('图片上传失败'));
      onError(error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Dragger
        name="image"
        multiple={false}
        accept={accept}
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        disabled={uploading}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {t('点击或拖拽图片到此区域上传')}
        </p>
        <p className="ant-upload-hint">
          {t('支持单个图片上传，文件大小不超过 {{size}}MB', { size: maxSize / 1024 / 1024 })}
        </p>
      </Dragger>

      {uploading && (
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
      )}

      <ImageProcessingStatus />
    </Space>
  );
}; 