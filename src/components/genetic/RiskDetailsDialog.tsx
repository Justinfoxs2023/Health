import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface RiskDetailsDialogProps {
  open: boolean;
  risk: Family.DiseaseRisk | null;
  onClose: () => void;
}

export const RiskDetailsDialog: React.FC<RiskDetailsDialogProps> = ({
  open,
  risk,
  onClose
}) => {
  if (!risk) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{risk.disease}风险详情</DialogTitle>
      <DialogContent>
        {/* 实现风险详情内容 */}
      </DialogContent>
    </Dialog>
  );
}; 