import React, { useState, useEffect, useCallback } from 'react';

import {
  ZoomInOutlined as ZoomIn,
  ZoomOutOutlined as ZoomOut,
  RotateLeftOutlined as RotateLeft,
  RotateRightOutlined as RotateRight,
  DownloadOutlined,
} from '@ant-design/icons';
import { ImageService } from '../../services/image';
import { Modal, Space, Button, Slider as AntSlider } from 'antd';
import { useGesture } from '@use-gesture/react';

interf
ace ImagePreviewProps {
  visible: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
  onDownload?: () => void;
  className?: string;
  style?: React.CSSProperties;
  initialScale?: number;
  maxScale?: number;
  minScale?: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  visible,
  src,
  alt = '',
  onClose,
  onDownload,
  className,
  style,
  initialScale = 1,
  maxScale = 3,
  minScale = 0.1,
}) => {
  const [scale, setScale] = useState(initialScale);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 重置状态
  useEffect(() => {
    if (visible) {
      setScale(initialScale);
      setRotate(0);
      setPosition({ x: 0, y: 0 });
      setError(null);
    }
  }, [visible, initialScale]);

  // 图片预加载
  useEffect(() => {
    if (visible && src) {
      setLoading(true);
      const img = new Image();
      img.onload = () => setLoading(false);
      img.onerror = () => {
        setError('图片加载失败');
        setLoading(false);
      };
      img.src = src;
    }
  }, [visible, src]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, maxScale));
  }, [maxScale]);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, minScale));
  }, [minScale]);

  const handleRotateLeft = useCallback(() => {
    setRotate(prev => prev - 90);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotate(prev => prev + 90);
  }, []);

  const handleDownload = console.error('Error in index.tsx:', async () => {
      if (onDownload) {
        onDownload();
      } else {
        try {
          const imageService = new ImageService();
          const optimizedImage = await imageService.optimizeForDownload(src);
          const link = document.createElement('a');
          link.href = optimizedImage;
          link.download = alt || 'image';
          link.click();
        } catch (err) {
          console.error('Error in index.tsx:', '下载失败:', err);
        }
      }
    }, [src, alt, onDownload]);

  const handleClose = useCallback(() => {
    setScale(initialScale);
    setRotate(0);
    setPosition({ x: 0, y: 0 });
    onClose();
  }, [initialScale, onClose]);

  // 手势控制
  const bind = useGesture({
    onDrag: ({ movement: [mx, my] }) => {
      setPosition({ x: mx, y: my });
    },
    onPinch: ({ offset: [d] }) => {
      const newScale = initialScale * d;
      if (newScale >= minScale && newScale <= maxScale) {
        setScale(newScale);
      }
    },
    onWheel: ({ delta: [, dy] }) => {
      if (dy < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
      width="80%"
      centered
      className={`image-preview-modal ${className || ''}`}
      style={style}
      bodyStyle={{ padding: 0 }}
    >
      <div
        style={{
          position: 'relative',
          height: 'calc(80vh - 100px)',
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
        {...bind()}
      >
        {loading ? (
          <div className="image-preview-loading">加载中...</div>
        ) : error ? (
          <div className="image-preview-error">{error}</div>
        ) : (
          <img
            src={src}
            alt={alt}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale}) rotate(${rotate}deg)`,
              maxWidth: '100%',
              maxHeight: '100%',
              transition: 'transform 0.3s ease-in-out',
              cursor: 'grab',
              userSelect: 'none',
            }}
            draggable={false}
          />
        )}
      </div>

      <div
        className="image-preview-controls"
        style={{
          padding: '16px',
          backgroundColor: '#fff',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
        }}
      >
        <Space size="middle">
          <Space>
            <Button icon={<ZoomOut />} onClick={handleZoomOut} disabled={scale <= minScale} />
            <AntSlider
              min={minScale}
              max={maxScale}
              step={0.1}
              value={scale}
              onChange={setScale}
              style={{ width: 100 }}
            />
            <Button icon={<ZoomIn />} onClick={handleZoomIn} disabled={scale >= maxScale} />
          </Space>

          <Space>
            <Button icon={<RotateLeft />} onClick={handleRotateLeft} />
            <Button icon={<RotateRight />} onClick={handleRotateRight} />
          </Space>

          <Button icon={<DownloadOutlined />} onClick={handleDownload} />
        </Space>
      </div>
    </Modal>
  );
};
