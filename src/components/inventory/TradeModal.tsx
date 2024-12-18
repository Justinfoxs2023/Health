import React from 'react';

import { InventoryItem } from '../../types/inventory.types';
import { Modal, Form, Input } from 'antd';

interface IProps {
  /** item 的描述 */
    item: InventoryItem;
  /** onConfirm 的描述 */
    onConfirm: values: any  void;
  onClose:   void;
}

export const TradeModal: React.FC<IProps> = ({ item, onConfirm, onClose }) => {
  return (
    <Modal
      title="交易设置"
      visible={true}
      onOk={onConfirm}
      onCancel={onClose}
    >
      <Form>
        <Form.Item label="价格" name="price">
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 