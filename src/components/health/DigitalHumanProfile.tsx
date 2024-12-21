import React, { useEffect, useRef } from 'react';

import { DigitalHumanService } from '../../services/metahuman/digital-human.service';
import { IUserHealthProfile } from '../../types/gamification/ai-task.types';
import { METAHUMAN_CONFIG } from '../../config/metahuman.config';

interface IProps {
  /** healthProfile 的描述 */
  healthProfile: IUserHealthProfile;
  /** modelType 的描述 */
  modelType: string;
}

export const DigitalHumanProfile: React.FC<IProps> = ({ healthProfile, modelType = 'default' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const digitalHumanService = new DigitalHumanService();

  useEffect(() => {
    initializeDigitalHuman();
  }, [healthProfile]);

  const initializeDigitalHuman = async () => {
    try {
      const model = await digitalHumanService.initializeDigitalHuman(modelType);
      const presentation = await digitalHumanService.generateHealthProfilePresentation(
        healthProfile,
      );
      renderPresentation(presentation);
    } catch (error) {
      console.error('Error in DigitalHumanProfile.tsx:', '数字人初始化失败', error);
    }
  };

  return (
    <div className="digital-human-container" ref={containerRef}>
      <div className="profile-view">
        <canvas id="digital-human-canvas" />
        <div className="healthmetrics">{/  /}</div>
      </div>
      <div className="interactioncontrols">{/  /}</div>
    </div>
  );
};
