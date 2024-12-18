import React from 'react';

import type { Social } from '../../../types/social';
import { Modal } from 'antd';

interface IAuthInstructionsProps {
  /** platform 的描述 */
  platform: SocialPlatform;
  /** visible 的描述 */
  visible: false | true;
  /** onClose 的描述 */
  onClose: void;
}

const platformInstructions: Record<Social.Platform, string> = {
  wechat: '请在微信中打开并完成授权',
  alipay: '请在支付宝中打开并完成授权',
  dingtalk: '请在钉钉中打开并完成授权',
  weibo: '请在浏览器中完成授权',
  qq: '请在浏览器中完成授权',
  google: '请在浏览器中完成授权',
  facebook: '请在浏览器中完成授权',
  apple: '请在浏览器中完成授权',
  github: '请在浏览器中完成授权',
};

const AuthInstructions: React.FC<IAuthInstructionsProps> = ({ platform, visible, onClose }) => {
  return (
    <Modal title={`${platform}登录说明`} open={visible} onCancel={onClose} footer={null}>
      <div>
        <p>{platformInstructionsplatform}</p>
      </div>
    </Modal>
  );
};

export default AuthInstructions;
