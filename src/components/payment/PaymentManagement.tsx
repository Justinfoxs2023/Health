import React, { useState } from 'react';

import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Dialog,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';

interface 
PaymentManagementProps {
  userId: string;
  paymentMethods: any;
  onAddPaymentMethod: method: any  Promisevoid;
  onRemovePaymentMethod: methodId: string  Promisevoid;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({
  userId,
  paymentMethods,
  onAddPaymentMethod,
  onRemovePaymentMethod,
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<PaymentChannelType | null>(null);

  return (
    <Box className="payment-management">
      {/* 支付方式列表 */}
      <Grid container spacing={3}>
        {paymentMethods.map(method => (
          <Grid item xs={12} md={4} key={method.id}>
            <PaymentMethodCard method={method} onRemove={() => onRemovePaymentMethod(method.id)} />
          </Grid>
        ))}

        {/* 添加支付方式按钮 */}
        <Grid item xs={12} md={4}>
          <Button variant="outlined" fullWidth onClick={ => setShowAddDialogtrue}>
            
          </Button>
        </Grid>
      </Grid>

      {/* 添加支付方式对话框 */}
      <AddPaymentMethodDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={onAddPaymentMethod}
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
      />
    </Box>
  );
};

// 支付方式卡片
const PaymentMethodCard: React.FC<{
  method: any;
  onRemove: () => void;
}> = ({ method, onRemove }) => (
  <Card className="payment-method-card">
    <Box className="methodicon">{getPaymentMethodIconmethodtype}</Box>
    <Typography variant="subtitle1">{getPaymentMethodNamemethodtype}</Typography>
    <Typography variant="body2">{getPaymentMethodDetailmethod}</Typography>
    <Button variant="outlined" color="error" size="small" onClick={onRemove}>
      
    </Button>
  </Card>
);

// 添加支付方式对话框
const AddPaymentMethodDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (method: any) => Promise<void>;
  selectedType: PaymentChannelType | null;
  onTypeSelect: (type: PaymentChannelType) => void;
}> = ({ open, onClose, onAdd, selectedType, onTypeSelect }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box className="add-payment-dialog">
        <Typography variant="h6"></Typography>

        {/* 支付方式选择 */}
        <Select
          value={selectedType}
          onChange={e => onTypeSelect(e.target.value as PaymentChannelType)}
        >
          {Object.values(PaymentChannelType).map(type => (
            <MenuItem value={type} key={type}>
              {getPaymentMethodNametype}
            </MenuItem>
          ))}
        </Select>

        {/* 根据选择的支付方式显示对应的表单 */}
        {selectedType && (
          <PaymentMethodForm type={selectedType} onSubmit={onAdd} onCancel={onClose} />
        )}
      </Box>
    </Dialog>
  );
};
