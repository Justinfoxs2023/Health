import React from 'react';
import { Box } from '@mui/material';

interface FamilyTreeProps {
  data: Family.DiseaseHistory[];
  onMemberSelect: (memberId: string) => void;
  highlightRisks?: boolean;
}

export const FamilyTree: React.FC<FamilyTreeProps> = ({
  data,
  onMemberSelect,
  highlightRisks
}) => {
  // 实现家族树组件
  return <Box>Family Tree Component</Box>;
}; 