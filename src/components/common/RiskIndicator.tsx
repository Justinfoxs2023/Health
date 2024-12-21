import React from 'react';

interface IRiskIndicatorProps {
  /** level 的描述 */
    level: low  medium  high;
}

export const RiskIndicator: React.FC<IRiskIndicatorProps> = ({ level }) => {
  // 实现风险指示器组件
  return <div>Risk Level {level}</div>;
};
