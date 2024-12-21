import React from 'react';

import { Select, Space } from 'antd';

interface IFilterValue {
  /** type 的描述 */
    type: string;
  /** status 的描述 */
    status: string;
}

interface IProps {
  /** value 的描述 */
    value: IFilterValue;
  /** onChange 的描述 */
    onChange: value: FilterValue  void;
}

export const ItemFilter: React.FC<IProps> = ({ value, onChange }) => {
  return (
    <Space className="item-filter">
      <Select
        value={value.type}
        onChange={type => onChange({ ...value, type })}
        style={{ width: 120 }}
      >
        <Select.Option value="all">全部类型</Select.Option>
        <Select.Option value="virtual">虚拟物品</Select.Option>
        <Select.Option value="physical">实物</Select.Option>
      </Select>

      <Select
        value={value.status}
        onChange={status => onChange({ ...value, status })}
        style={{ width: 120 }}
      >
        <Select.Option value="all">全部状态</Select.Option>
        <Select.Option value="available">可用</Select.Option>
        <Select.Option value="on_sale">出售中</Select.Option>
        <Select.Option value="sold">已售出</Select.Option>
      </Select>
    </Space>
  );
}; 