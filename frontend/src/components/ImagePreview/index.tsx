import React, { useState } from 'react';
import { Modal, Space, Button, Slider } from 'antd';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  RotateLeftOutlined, 
  RotateRightOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface ImagePreviewProps {
  url: string;
  visible: boolean;
  onClose: () => void;
  title?: string;
  onDownload?: () => void;
}

const ImageContainer = styled.div<{ scale: number; rotation: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  
  img {
    max-width: 100%;
    max-height: 70vh;
    transform: scale(${props => props.scale}) rotate(${props => props.rotation}deg);
    transition: transform 0.3s ease;
  }
`;

const ControlBar = styled(Space)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 20px;
  z-index: 1001;
`;

const ZoomSlider = styled(Slider)`
  width: 100px;
  margin: 0 10px;
  
  .ant-slider-rail {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .ant-slider-track {
    background-color: #1890ff;
  }
  
  .ant-slider-handle {
    border-color: #1890ff;
  }
`;

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  url,
  visible,
  onClose,
  title,
  onDownload,
}) => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleZoomChange = (value: number) => {
    setScale(value);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={title}
      footer={null}
      width="80%"
      centered
      destroyOnClose
      style={{ maxWidth: 1200 }}
    >
      <ImageContainer scale={scale} rotation={rotation}>
        <img src={url} alt={title} />
      </ImageContainer>

      <ControlBar>
        <Button
          type="text"
          icon={<ZoomOutOutlined />}
          onClick={handleZoomOut}
          style={{ color: 'white' }}
        />
        <ZoomSlider
          min={0.1}
          max={3}
          step={0.1}
          value={scale}
          onChange={handleZoomChange}
          tooltip={{
            formatter: value => `${Math.round(Number(value) * 100)}%`,
          }}
        />
        <Button
          type="text"
          icon={<ZoomInOutlined />}
          onClick={handleZoomIn}
          style={{ color: 'white' }}
        />
        <Button
          type="text"
          icon={<RotateLeftOutlined />}
          onClick={handleRotateLeft}
          style={{ color: 'white' }}
        />
        <Button
          type="text"
          icon={<RotateRightOutlined />}
          onClick={handleRotateRight}
          style={{ color: 'white' }}
        />
        {onDownload && (
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={onDownload}
            style={{ color: 'white' }}
          />
        )}
        <Button
          type="text"
          onClick={handleReset}
          style={{ color: 'white' }}
        >
          {t('重置')}
        </Button>
      </ControlBar>
    </Modal>
  );
}; 