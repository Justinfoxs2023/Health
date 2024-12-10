import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Popover,
  Button,
  TextField,
  Chip
} from '@mui/material';
import { ProductContentLink } from '../mall/ProductContentLink';

interface AnchorEditorProps {
  content: string;
  anchors: ContentAnchor[];
  products: Product[];
  onChange: (content: string, anchors: ContentAnchor[]) => void;
}

export const AnchorEditor: React.FC<AnchorEditorProps> = ({
  content,
  anchors,
  products,
  onChange
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [anchorPopover, setAnchorPopover] = useState<{
    open: boolean;
    anchorEl: HTMLElement | null;
    position: { start: number; end: number } | null;
  }>({
    open: false,
    anchorEl: null,
    position: null
  });
  
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    
    if (text) {
      setSelectedText(text);
      setAnchorPopover({
        open: true,
        anchorEl: range.commonAncestorContainer as HTMLElement,
        position: {
          start: range.startOffset,
          end: range.endOffset
        }
      });
    }
  };

  const handleCreateAnchor = (productId: string) => {
    if (!anchorPopover.position) return;
    
    const newAnchor: ContentAnchor = {
      id: Date.now().toString(),
      contentId: '', // 将由后端生成
      contentType: 'post',
      productId,
      position: anchorPopover.position,
      text: selectedText,
      clicks: 0,
      conversions: 0,
      revenue: 0
    };
    
    onChange(content, [...anchors, newAnchor]);
    setAnchorPopover({ open: false, anchorEl: null, position: null });
  };

  return (
    <Box className="anchor-editor">
      <div
        className="content-editable"
        contentEditable
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <Popover
        open={anchorPopover.open}
        anchorEl={anchorPopover.anchorEl}
        onClose={() => setAnchorPopover({ open: false, anchorEl: null, position: null })}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box className="anchor-creator" p={2}>
          <Typography variant="subtitle2">为选中文本添加商品链接</Typography>
          <ProductContentLink
            products={products}
            selectedProducts={[]}
            onProductSelect={(productIds) => {
              if (productIds.length > 0) {
                handleCreateAnchor(productIds[0]);
              }
            }}
          />
        </Box>
      </Popover>

      <Box className="anchor-list" mt={2}>
        <Typography variant="subtitle1">已添加的商品链接</Typography>
        {anchors.map(anchor => (
          <Chip
            key={anchor.id}
            label={`${anchor.text} - ${
              products.find(p => p.id === anchor.productId)?.title
            }`}
            onDelete={() => {
              onChange(
                content,
                anchors.filter(a => a.id !== anchor.id)
              );
            }}
            className="anchor-chip"
          />
        ))}
      </Box>
    </Box>
  );
}; 