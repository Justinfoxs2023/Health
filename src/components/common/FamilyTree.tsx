import React from 'react';

import { Box } from '@mui/material';

interface IFamilyTreeProps {
  /** data 的描述 */
    data: FamilyDiseaseHistory;
  /** onMemberSelect 的描述 */
    onMemberSelect: memberId: string  void;
  highlightRisks: boolean;
}

export const FamilyTree: React.FC<IFamilyTreeProps> = ({ data, onMemberSelect, highlightRisks }) => {
  // 实现家族树组件
  return <Box>Family Tree Component</Box>;
};
