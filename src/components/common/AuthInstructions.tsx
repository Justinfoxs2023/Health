import React from 'react';
import { Modal } from 'antd';
import type { Social } from '../../types/social';

interface AuthInstructionsProps {
  platform: Social.Platform;
  visible: boolean;
  onClose: () => void;
}

const AuthInstructions: React.FC<AuthInstructionsProps> = ({
  platform,
  visible,
  onClose
}) => {
  return (
    <Modal
      title={`${platform}登录说明`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        {/* 根据不同平台显示不同的登录说明 */}
        {platform === 'wechat' && (
          <p>请在微信中打开并完成授权</p>
        )}
        {/* ... 其他平台的说明 */}
      </div>
    </Modal>
  );
};

export default AuthInstructions; 