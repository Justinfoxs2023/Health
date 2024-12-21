import React from 'react';

import { Card, Typography } from 'antd';
import { InventoryItem } from '../../types/inventory.types';

interface IProps {
  /** item 的描述 */
  item: InventoryItem;
  /** onSelect 的描述 */
  onSelect: void;
}

export const ItemCard: React.FC<IProps> = ({ item, onSelect }) => {
  return (
    <Card onClick={onSelect}>
      <Typography.Title level={5}>{item.name}</Typography.Title>
      <Typography.Text>{item.description}</Typography.Text>
    </Card>
  );
};
