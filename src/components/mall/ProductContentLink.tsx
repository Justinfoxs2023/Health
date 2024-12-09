import React, { useState } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Chip,
  Button,
  Dialog,
  Grid 
} from '@mui/material';
import { Product } from '../../types/mall';

interface ProductContentLinkProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (productIds: string[]) => void;
}

export const ProductContentLink: React.FC<ProductContentLinkProps> = ({
  products,
  selectedProducts,
  onProductSelect
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(selectedProducts);

  const handleSelect = (productId: string) => {
    const newSelected = selected.includes(productId)
      ? selected.filter(id => id !== productId)
      : [...selected, productId];
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    onProductSelect(selected);
    setOpen(false);
  };

  return (
    <>
      <Box className="product-link-section">
        <Typography variant="subtitle1">关联商品</Typography>
        <Box className="selected-products">
          {selectedProducts.map(productId => {
            const product = products.find(p => p.id === productId);
            return product && (
              <Chip
                key={product.id}
                label={product.title}
                onDelete={() => handleSelect(product.id)}
                className="product-chip"
              />
            );
          })}
        </Box>
        <Button 
          variant="outlined" 
          onClick={() => setOpen(true)}
        >
          选择关联商品
        </Button>
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box className="product-selector">
          <Grid container spacing={2}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card 
                  className={`product-card ${
                    selected.includes(product.id) ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(product.id)}
                >
                  <img src={product.images[0]} alt={product.title} />
                  <Box className="product-info">
                    <Typography variant="subtitle2">{product.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      ¥{product.price}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box className="dialog-actions">
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button 
              variant="contained" 
              onClick={handleConfirm}
            >
              确认选择
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}; 