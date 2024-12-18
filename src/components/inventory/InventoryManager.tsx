import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import styles from './InventoryManager.module.css';
import { CapacityIndicator } from './CapacityIndicator';
import { EnhancedInventoryService } from '../../services/inventory/enhanced-inventory.service';
import { InventoryCapacity } from '../../types/showcase.types';
import { InventoryItem } from '../../types/inventory.types';
import { ItemCard } from './ItemCard';
import { ItemFilter } from './ItemFilter';
import { Row, Col, Card, Empty, Spin, message, Tabs } from 'antd';
import { TradeModal } from './TradeModal';
import { UserInventoryService } from '../../services/inventory/user-inventory.service';
import { useInjection } from '../../hooks/useInjection';

interface IProps {
  /** userId 的描述 */
  userId: string;
}

const StyledRow = styled(Row)`
  &.inventory-header {
    margin-bottom: 16px;
  }

  &.inventory-grid {
    margin: 0 -8px;
  }
`;

export const InventoryManager: React.FC<IProps> = ({ userId }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [capacity, setCapacity] = useState<InventoryCapacity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [filter, setFilter] = useState({ type: 'all', status: 'all' });

  const inventoryService = useInjection(UserInventoryService);
  const enhancedService = useInjection(EnhancedInventoryService);

  useEffect(() => {
    loadInventoryData();
  }, [userId, filter]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const [userItems, userCapacity] = await Promise.all([
        inventoryService.getUserInventory(userId),
        enhancedService.getInventoryCapacity(userId),
      ]);

      const filteredItems = filterItems(userItems);
      setItems(filteredItems);
      setCapacity(userCapacity);
    } catch (error) {
      message.error('加载仓库数据失败');
      console.error('Error in InventoryManager.tsx:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = (items: InventoryItem[]) => {
    return items.filter(item => {
      const typeMatch = filter.type === 'all' || item.type === filter.type;
      const statusMatch = filter.status === 'all' || item.status === filter.status;
      return typeMatch && statusMatch;
    });
  };

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowTradeModal(true);
  };

  const handleTrade = async (tradeOptions: any) => {
    try {
      await inventoryService.listItemForSale(userId, selectedItem!.id, tradeOptions);
      message.success('物品上架成功');
      await loadInventoryData();
      setShowTradeModal(false);
    } catch (error) {
      message.error('上架失败');
      console.error('Error in InventoryManager.tsx:', error);
    }
  };

  if (loading) {
    return <Spin size="large" tip="加载中..." />;
  }

  return (
    <Card className="inventory-container">
      <StyledRow
        gutter={[16, 16]}
        justify="space-between"
        align="middle"
        className="inventory-header"
      >
        <Col span={12}>
          <CapacityIndicator capacity={capacity!} />
        </Col>
        <Col span={12}>
          <ItemFilter value={filter} onChange={setFilter} />
        </Col>
      </StyledRow>

      <Tabs defaultActiveKey="grid">
        <Tabs.TabPane tab="网格视图" key="grid">
          <Row gutter={[16, 16]} className={styles.inventoryGrid}>
            {items.length > 0 ? (
              items.map(item => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <ItemCard item={item} onSelect={() => handleItemSelect(item)} />
                </Col>
              ))
            ) : (
              <Empty description="暂无物品" />
            )}
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="列表视图" key="list">
          <div></div>
        </Tabs.TabPane>
      </Tabs>

      {showTradeModal && selectedItem && (
        <TradeModal
          item={selectedItem}
          onConfirm={handleTrade}
          onClose={() => setShowTradeModal(false)}
        />
      )}
    </Card>
  );
};
