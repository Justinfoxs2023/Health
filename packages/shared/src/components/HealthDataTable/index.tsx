import React from 'react';

import { IHealthData } from '../../types';
import { Table, ITableColumn } from '../Table';
import { formatDate, formatHealthData } from '../../utils';

export interface IHealthDataTableProps {
  /** 数据源 */
  dataSource: IHealthData[];
  /** 加载状态 */
  loading?: boolean;
  /** 选中的数据 */
  selectedData?: IHealthData[];
  /** 选择改变回调 */
  onSelectChange?: (data: IHealthData[]) => void;
  /** 编辑回调 */
  onEdit?: (data: IHealthData) => void;
  /** 删除回调 */
  onDelete?: (data: IHealthData) => void;
  /** 自定义类名 */
  className?: string;
}

/** 健康数据表格 */
export const HealthDataTable: React.FC<IHealthDataTableProps> = ({
  dataSource,
  loading = false,
  selectedData = [],
  onSelectChange,
  onEdit,
  onDelete,
  className,
}) => {
  const columns: ITableColumn<IHealthData>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      render: value => value.replace(/_/g, ' '),
      sortable: true,
    },
    {
      title: '数值',
      dataIndex: 'value',
      render: (value, record) => formatHealthData(record),
      sortable: true,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      render: value => formatDate(value),
      sortable: true,
    },
    {
      title: '备注',
      dataIndex: 'note',
      render: value => value || '-',
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 120,
      render: (_, record) => (
        <div className="flex space-x-2">
          {onEdit && (
            <button
              className="text-primary-600 hover:text-primary-700"
              onClick={() => onEdit(record)}
            >
              编辑
            </button>
          )}
          {onDelete && (
            <button className="text-red-600 hover:text-red-700" onClick={() => onDelete(record)}>
              删除
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table<IHealthData>
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      loading={loading}
      selectable={!!onSelectChange}
      selectedRowKeys={selectedData?.map(item => item.id)}
      onSelectChange={keys => {
        const selected = dataSource.filter(item => keys.includes(item.id));
        onSelectChange?.(selected);
      }}
      className={className}
    />
  );
};
