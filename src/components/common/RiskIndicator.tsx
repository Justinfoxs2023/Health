import React from 'react';

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high';
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ level }) => {
  // 实现风险指示器组件
  return <div>Risk Level: {level}</div>;
}; 