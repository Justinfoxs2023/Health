import React, { useState } from 'react';

import { ImageService } from '../../services/image';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Upload, Button, Progress, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';

interface ImageUploadProps {
  /** value 的描述 */
  value?: string;
  /** onChange 的描述 */
  onChange?: (value: string) => void;
  /** maxSize 的描述 */
  maxSize?: number;
  /** accept 的描述 */
  accept?: string;
  /** imageService 的描述 */
  imageService?: ImageService;
  /** className 的描述 */
  className?: string;
  /** style 的描述 */
  style?: React.CSSProperties;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  maxSize = 5, // 默认最大5MB
  accept = 'image/*',
  imageService = new ImageService(),
  className,
  style,
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = async (file: RcFile) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 检查文件大小
    if (file.size / 1024 / 1024 > maxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB！`);
      return false;
    }

    try {
      setLoading(true);
      setProgress(0);

      // 订阅压缩进度
      const subscription = imageService.getState().subscribe(state => {
        setProgress(state.progress);
      });

      // 压缩图片
      const compressedFile = await imageService.compressImage(file);

      // 转换为WebP格式
      const webpFile = await imageService.convertToWebP(compressedFile);

      // 生成预览URL
      const url = URL.createObjectURL(webpFile);
      onChange?.(url);

      // 更新文件列表
      setFileList([
        {
          uid: '-1',
          name: webpFile.name,
          status: 'done',
          url,
          thumbUrl: url,
        },
      ]);

      subscription.unsubscribe();
      setLoading(false);
      setProgress(0);

      return false; // 阻止默认上传
    } catch (error) {
      message.error('图片处理失败，请重试！');
      setLoading(false);
      setProgress(0);
      return false;
    }
  };

  const handleRemove = () => {
    setFileList([]);
    onChange?.('');
  };

  const uploadProps: UploadProps = {
    accept,
    fileList,
    beforeUpload,
    onRemove: handleRemove,
    listType: 'picture',
    maxCount: 1,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  };

  return (
    <div className={className} style={style}>
      <Upload {...uploadProps}>
        <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />} disabled={loading}>
          {loading ? '处理中...' : '上传图片'}
        </Button>
      </Upload>
      {loading && progress > 0 && (
        <Progress
          percent={Math.round(progress)}
          size="small"
          status="active"
          style={{ marginTop: 8 }}
        />
      )}
      <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
        支持 jpg、png、gif 格式，最大 {maxSize}MB
      </div>
    </div>
  );
};
