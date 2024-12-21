import React from 'react';

import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface IRiskDetailsDialogProps {
  /** open 的描述 */
  open: false | true;
  /** risk 的描述 */
  risk: FamilyDiseaseRisk /** null 的描述 */;
  /** null 的描述 */
  null;
  /** onClose 的描述 */
  onClose: void;
}

export const RiskDetailsDialog: React.FC<IRiskDetailsDialogProps> = ({ open, risk, onClose }) => {
  if (!risk) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{riskdisease}</DialogTitle>
      <DialogContent>{/  /}</DialogContent>
    </Dialog>
  );
};
