import React, { useState } from 'react';
import { Tabs, Tooltip, message, Modal, Spin, Button } from 'antd';
import { PlatformIcon } from '../social/PlatformIcon';
import { SocialPlatform } from '../../utils/socialPlatform';
import { QRCode } from 'antd';
import { QrPollingService } from '../../services/qr-polling.service';
import { ReloadOutlined } from '@ant-design/icons';
import * as Social from '../../types/social';
import styles from './styles/SocialLogin.module.scss';
import { socialAuthConfig } from '../../config/socialAuthConfig';
import { AuthInstructions } from '../common/AuthInstructions';

interface SocialLoginProps {
  onSuccess?: (response: Social.LoginResponse) => void;
  onError?: (error: Error) => void;
}

const { TabPane } = Tabs;

const DOMESTIC_PLATFORMS: Social.Platform[] = ['wechat', 'weibo', 'qq'];
const INTERNATIONAL_PLATFORMS: Social.Platform[] = ['google', 'facebook', 'apple'];

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState<Social.Platform | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState<Social.Platform | null>(null);
  const [polling, setPolling] = useState<QrPollingService | null>(null);
  const [qrExpired, setQrExpired] = useState(false);
  const [showInstructions, setShowInstructions] = useState<Social.Platform | null>(null);

  const handleLogin = async (platform: Social.Platform) => {
    if (loading) return;
    
    setLoading(platform);
    try {
      await SocialPlatform.login(platform);
    } catch (error) {
      message.error('登录失败，请稍后重试');
      onError?.(error as Error);
    } finally {
      setLoading(null);
    }
  };

  const handleQrLogin = async (platform: Social.Platform) => {
    try {
      setCurrentPlatform(platform);
      const qrUrl = await SocialPlatform.getQrCode(platform);
      setQrUrl(qrUrl);
      setQrVisible(true);
      setQrExpired(false);

      // 启动轮询
      const pollingService = new QrPollingService(
        platform,
        qrUrl,
        (response) => {
          handleQrClose();
          onSuccess?.(response);
        },
        (error) => {
          handleQrClose();
          onError?.(error);
        },
        () => {
          setQrExpired(true);
          message.warning('二维码已过期，请点击刷新');
        }
      );
      setPolling(pollingService);
      pollingService.start();
    } catch (error) {
      message.error('获取二维码失败');
      handleQrClose();
    }
  };

  const handleQrClose = () => {
    setQrVisible(false);
    setQrUrl('');
    setCurrentPlatform(null);
    setLoading(null);
    setQrExpired(false);
    polling?.stop();
    setPolling(null);
  };

  const handleQrRefresh = async () => {
    if (!currentPlatform) return;
    polling?.stop();
    await handleQrLogin(currentPlatform);
  };

  const handlePlatformClick = (platform: Social.Platform) => {
    const config = socialAuthConfig[platform];
    
    if (config.authType === 'qrcode') {
      handleQrLogin(platform);
    } else {
      setShowInstructions(platform);
    }
  };

  const renderPlatformIcons = (platforms: Social.Platform[]) => (
    <div className={styles.platformGrid}>
      {platforms.map(platform => {
        const config = SocialPlatform.getConfig(platform);
        const isLoading = loading === platform;
        
        return (
          <Tooltip key={platform} title={`使用${config.name}登录`}>
            <div 
              className={`${styles.platformButton} ${isLoading ? styles.loading : ''}`}
              onClick={() => handlePlatformClick(platform)}
            >
              <PlatformIcon
                platform={platform}
                size={32}
                color={config.color}
                className={`${styles.platformIcon} ${styles[platform]}`}
              />
              <span className={styles.platformName}>{config.name}</span>
              {isLoading && (
                <div className={styles.loadingIndicator}>
                  <Spin size="small" />
                </div>
              )}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );

  return (
    <div className={styles.socialLoginContainer}>
      <h3 className={styles.title}>第三方账号登录</h3>
      
      <Tabs defaultActiveKey="domestic" centered className={styles.platformTabs}>
        <TabPane tab="国内平台" key="domestic">
          {renderPlatformIcons(DOMESTIC_PLATFORMS)}
        </TabPane>
        <TabPane tab="国际平台" key="international">
          {renderPlatformIcons(INTERNATIONAL_PLATFORMS)}
        </TabPane>
      </Tabs>

      <Modal
        title={`${currentPlatform ? SocialPlatform.getConfig(currentPlatform).name : ''}扫码登录`}
        open={qrVisible}
        onCancel={handleQrClose}
        footer={null}
        centered
        width={400}
      >
        <div className={styles.qrCodeContainer}>
          <div className={styles.qrWrapper}>
            <QRCode 
              value={qrUrl} 
              size={200}
              style={{ opacity: qrExpired ? 0.3 : 1 }}
            />
          </div>
          {!qrExpired ? (
            <p className={styles.qrTip}>
              请使用
              <span className={styles.platformName}>
                {currentPlatform ? SocialPlatform.getConfig(currentPlatform).name : ''}
              </span>
              扫描二维码登录
            </p>
          ) : (
            <div className={styles.qrExpired}>
              <p className={styles.expiredText}>二维码已过期</p>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleQrRefresh}
                className={styles.refreshButton}
              >
                刷新二维码
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {showInstructions && (
        <AuthInstructions
          platform={showInstructions}
          visible={true}
          onClose={() => {
            setShowInstructions(null);
            handleLogin(showInstructions);
          }}
        />
      )}
    </div>
  );
}; 