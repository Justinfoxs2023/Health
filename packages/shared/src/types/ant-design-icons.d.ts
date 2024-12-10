declare module '@ant-design/icons' {
  import React from 'react';

  interface IconProps {
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
  }

  export const WechatOutlined: React.FC<IconProps>;
  export const WeiboOutlined: React.FC<IconProps>;
  export const QqOutlined: React.FC<IconProps>;
  export const AlipayCircleOutlined: React.FC<IconProps>;
  export const DingtalkOutlined: React.FC<IconProps>;
  export const GoogleOutlined: React.FC<IconProps>;
  export const FacebookOutlined: React.FC<IconProps>;
  export const AppleOutlined: React.FC<IconProps>;
  export const GithubOutlined: React.FC<IconProps>;
  export const ShareAltOutlined: React.FC<IconProps>;
  export const ReloadOutlined: React.FC<IconProps>;
} 