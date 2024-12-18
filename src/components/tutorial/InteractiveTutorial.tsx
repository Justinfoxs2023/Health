import React from 'react';

import { Tour } from 'antd';

export const InteractiveTutorial: React.FC = () => {
  const steps = [
    {
      title: '欢迎使用',
      description: '让我们开始健康之旅吧！',
      target: () => document.querySelector('.welcome-section'),
    },
    // ... 其他引导步骤
  ];

  return <Tour steps={steps} />;
};
