import React, { useState }  from 'react';
import { Space, Tooltip, message } from 'antd';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography
  } from '@mui/material';
import { ShareAltOutlined } from '@ant-design/icons';
import { PlatformIcon } from './PlatformIcon';
import * as Social from '../../types/social';

interface SocialShareProps {
  config: Omit<Social.ShareConfig, 'platform'>;
  platforms?: Social.Platform[];
  onShare?: (platform: Social.Platform) => void;
  onError?: (error: Error) => void;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  config,
  platforms = ['wechat', 'weibo', 'qq'],
  onShare,
  onError
}) => {
    const [selectedPlatform, setSelectedPlatform] = useState<Social.Platform | null>(null);
    const [sharing, setSharing] = useState(false);

    const handleShare = async (platform: Social.Platform) => {
      try {
        const shareConfig: Social.ShareConfig = {
          ...config,
          platform
        };

        // 根据平台调用不同的分享API
        switch (platform) {
          case 'wechat':
            if (window.wx) {
              window.wx.ready(() => {
                window.wx.shareAppMessage({
                  title: config.title,
                  desc: config.description,
                  link: config.url,
                  imgUrl: config.image,
                  success: () => {
                    message.success('分享成功');
                    onShare?.(platform);
                  },
                  fail: (err: any) => {
                    throw new Error(err.errMsg);
                  }
                });
              });
            } else {
              throw new Error('微信 SDK 未加载');
            }
            break;

          case 'weibo':
            const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(config.url)}&title=${encodeURIComponent(config.title)}${config.image ? `&pic=${encodeURIComponent(config.image)}` : ''}`;
            window.open(weiboUrl, '_blank');
            onShare?.(platform);
            break;

          case 'qq':
            const qqUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(config.url)}&title=${encodeURIComponent(config.title)}&desc=${encodeURIComponent(config.description || '')}&pics=${encodeURIComponent(config.image || '')}`;
            window.open(qqUrl, '_blank');
            onShare?.(platform);
            break;

          default:
            throw new Error(`不支持的分享平台: ${platform}`);
        }
      } catch (error) {
        message.error('分享失败，请稍后重试');
        onError?.(error as Error);
      }
    };

    return (
      <Space size="middle" align="center">
        <ShareAltOutlined style={{ fontSize: 16 }} />
        {platforms.map(platform => (
          <Tooltip key={platform} title={`分享到${platform}`}>
            <PlatformIcon
              platform={platform}
              size={24}
              className="cursor-pointer hover:opacity-80"
              onClick={() => handleShare(platform)}
            />
          </Tooltip>
        ))}
      </Space>
    );
};

// 为微信SDK声明全局类型
declare global {
  interface Window {
    wx?: {
      ready: (callback: () => void) => void;
      shareAppMessage: (config: {
        title: string;
        desc?: string;
        link: string;
        imgUrl?: string;
        success?: () => void;
        fail?: (err: any) => void;
      }) => void;
    };
  }
} 

// 确保导出所有必要的成员
export default SocialShare;