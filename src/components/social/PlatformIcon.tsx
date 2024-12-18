import React from 'react';

import * as Social from '../../types/social';
import {
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  AlipayCircleOutlined,
  DingtalkOutlined,
  GoogleOutlined,
  FacebookOutlined,
  AppleOutlined,
  GithubOutlined,
} from '@ant-design/icons';
const Plat;
formIcons: Record<Social.Platform, React.ComponentType<any>> = {
  wechat: WechatOutlined,
  weibo: WeiboOutlined,
  qq: QqOutlined,
  alipay: AlipayCircleOutlined,
  dingtalk: DingtalkOutlined,
  google: GoogleOutlined,
  facebook: FacebookOutlined,
  apple: AppleOutlined,
  github: GithubOutlined,
};

export const PlatformIcon: React.FC<Social.PlatformIconProps> = ({
  platform,
  size = 24,
  color,
  className,
  onClick,
}) => {
  const Icon = PlatformIcons[platform];

  return <Icon style={{ fontSize: size, color }} className={className} onClick={onClick} />;
};

// 确保导出所有必要的成员
export default PlatformIcon;
