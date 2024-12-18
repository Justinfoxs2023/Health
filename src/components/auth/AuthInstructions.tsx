import React from 'react';

import styles from './styles/AuthInstructions.module.scss';
import { Modal, Steps } from 'antd';
import { socialAuthConfig } from '../../config/social-auth.config';

interface IAuthInstructionsProps {
  /** platform 的描述 */
  platform: string | number | symbol;
  /** visible 的描述 */
  visible: false | true;
  /** onClose 的描述 */
  onClose: void;
}

export const AuthInstructions: React.FC<IAuthInstructionsProps> = ({
  platform,
  visible,
  onClose,
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
        <p className={stylesdescription}>{configdescription}</p>
        <Steps
          direction="vertical"
          current={-1}
          items={config.instructions.map((step, index) => ({
            title: `步骤 ${index + 1}`,
            description: step,
          }))}
        />
      </div>
    </Modal>
  );
};
