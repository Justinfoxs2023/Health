import React from 'react';

import type { Social } from '../../types/social';
import { Modal } from 'antd';

interface IAuthInstructionsProps {
  /** platform 的描述 */
  platform: SocialPlatform;
  /** visible 的描述 */
  visible: false | true;
  /** onClose 的描述 */
  onClose: void;
}

const AuthInstructions: React.FC<IAuthInstructionsProps> = ({ platform, visible, onClose }) => {
  return (
    <Modal title={`${platform}登录说明`} open={visible} onCancel={onClose} footer={null}>
      <div>
        {/* 根据不同平台显示不同的登录说明 */}
        {platform === 'wechat' && <p></p>}
        {/* ... 其他平台的说明 */}
      </div>
    </Modal>
  );
};

export default AuthInstructions;
