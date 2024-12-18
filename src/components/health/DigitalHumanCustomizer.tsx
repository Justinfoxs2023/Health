import React, { useState, useEffect } from 'react';

import { AVATAR_CUSTOMIZATION_CONFIG } from '../../config/avatar-customization.config';
import { AvatarCustomizationService } from '../../services/metahuman/avatar-customization.service';

interface IProps {
  /** userId 的描述 */
    userId: string;
  /** onCustomizationComplete 的描述 */
    onCustomizationComplete: customization: any  void;
}

export const DigitalHumanCustomizer: React.FC<IProps> = ({
  userId,
  onCustomizationComplete
}) => {
  const [availableItems, setAvailableItems] = useState<any>({});
  const [selectedItems, setSelectedItems] = useState<any>({});
  const customizationService = new AvatarCustomizationService();

  useEffect(() => {
    loadAvailableItems();
  }, [userId]);

  const loadAvailableItems = async () => {
    const items = await customizationService.getAvailableCustomizations(userId);
    setAvailableItems(items);
  };

  const handleItemSelect = async (category: string, item: any) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: item
    }));
  };

  const handleApplyCustomization = async () => {
    try {
      await customizationService.applyCustomization(userId, selectedItems);
      onCustomizationComplete(selectedItems);
    } catch (error) {
      console.error('Error in DigitalHumanCustomizer.tsx:', '应用装扮失败', error);
    }
  };

  return (
    <div className="customizer-container">
      <div className="preview-section">
        <canvas id="avatar-preview" />
      </div>
      <div className="customization-options">
        {Object.entries(AVATAR_CUSTOMIZATION_CONFIG.categories).map(([category, items]) => (
          <CategorySelector
            key={category}
            category={category}
            items={items}
            available={availableItems}
            selected={selectedItems[category]}
            onSelect={(item) => handleItemSelect(category, item)}
          />
        ))}
      </div>
      <button 
        className="applybutton"
        onClick={handleApplyCustomization}
      >
        
      </button>
    </div>
  );
}; 