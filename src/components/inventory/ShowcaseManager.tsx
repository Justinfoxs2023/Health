import React, { useState, useEffect } from 'react';

import { EnhancedInventoryService } from '../../services/inventory/enhanced-inventory.service';
import { IShowcaseData } from '../../types/showcase.types';
import { ShowcaseItem } from './ShowcaseItem';
import { ShowcaseLayout } from './ShowcaseLayout';
import { ShowcaseStats } from './ShowcaseStats';

interface IProps {
  /** userId 的描述 */
  userId: string;
  /** onUpdate 的描述 */
  onUpdate: void;
}

export const ShowcaseManager: React.FC<IProps> = ({ userId, onUpdate }) => {
  const [showcase, setShowcase] = useState<IShowcaseData | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const inventoryService = new EnhancedInventoryService();

  useEffect(() => {
    loadShowcase();
  }, [userId]);

  const loadShowcase = async () => {
    const data = await inventoryService.getShowcase(userId);
    setShowcase(data);
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      if (prev.length >= showcase?.features.slots!) {
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const handleSaveShowcase = async () => {
    try {
      await inventoryService.manageShowcase(userId, selectedItems);
      await loadShowcase();
      onUpdate?.();
    } catch (error) {
      console.error('Error in ShowcaseManager.tsx:', '保存展示橱窗失败', error);
    }
  };

  if (!showcase) return null;

  return (
    <div className="showcase-container">
      <ShowcaseStats statistics={showcase.statistics} />

      <ShowcaseLayout
        items={showcase.items}
        features={showcase.features}
        onItemSelect={handleItemSelect}
        selectedItems={selectedItems}
      />

      <div className="showcase-items">
        {showcase.items.map(item => (
          <ShowcaseItem
            key={item.id}
            item={item}
            features={showcase.features}
            selected={selectedItems.includes(item.id)}
            onSelect={() => handleItemSelect(item.id)}
          />
        ))}
      </div>

      <button
        className="saveshowcase"
        onClick={handleSaveShowcase}
        disabled={selectedItemslength === 0}
      ></button>
    </div>
  );
};
