import React from 'react';
import { Modal, Steps } from 'antd';
import { socialAuthConfig } from '../../config/social-auth.config';
import styles from './styles/AuthInstructions.module.scss';

interface AuthInstructionsProps {
  platform: keyof typeof socialAuthConfig;
  visible: boolean;
  onClose: () => void;
}

export const AuthInstructions: React.FC<AuthInstructionsProps> = ({
  platform,
  visible,
  onClose
}) => {
  const config = socialAuthConfig[platform];

  return (
    <Modal
      title={`${config.name}登录指引`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      className={styles.instructionsModal}
    >
      <div className={styles.content}>
        <p className={styles.description}>{config.description}</p>
        <Steps
          direction="vertical"
          current={-1}
          items={config.instructions.map((step, index) => ({
            title: `步骤 ${index + 1}`,
            description: step
          }))}
        />
      </div>
    </Modal>
  );
}; 