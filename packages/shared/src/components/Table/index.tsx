import React, { useState, useMemo } from 'react';

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';

export interface ITableColumn<T> {
  /** 列标题 */
  title: React.ReactNode;
  /** 列数据字段名 */
  dataIndex: keyof T;
  /** 列渲染函数 */
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  /** 列宽度 */
  width?: number | string;
  /** 是否可排序 */
  sortable?: boolean;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 固定列 */
  fixed?: 'left' | 'right';
}

export interface ITableProps<T> {
  /** 数据源 */
  dataSource: T[];
  /** 列配置 */
  columns: ITableColumn<T>[];
  /** 行键值 */
  rowKey: keyof T | ((record: T) => string);
  /** 加载状态 */
  loading?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否显示斑马纹 */
  striped?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 选中的行键值数组 */
  selectedRowKeys?: string[];
  /** 选择改变回调 */
  onSelectChange?: (selectedRowKeys: string[]) => void;
  /** 排序改变回调 */
  onSortChange?: (field: keyof T, order: 'asc' | 'desc' | null) => void;
  /** 自定义类名 */
  className?: string;
}

/** 表格组件 */
export function Table<T extends Record<string, any>>({
  dataSource,
  columns,
  rowKey,
  loading = false,
  bordered = false,
  striped = true,
  selectable = false,
  selectedRowKeys = [],
  onSelectChange,
  onSortChange,
  className = '',
}: ITableProps<T>): import('D:/Health/node_modules/@types/react/jsx-runtime').JSX.Element {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const getRowKey = (record: T): string => {
    return typeof rowKey === 'function' ? rowKey(record) : String(record[rowKey]);
  };

  const handleSort = (field: keyof T) => {
    let newOrder: 'asc' | 'desc' | null = 'asc';
    if (sortField === field) {
      if (sortOrder === 'asc') newOrder = 'desc';
      else if (sortOrder === 'desc') newOrder = null;
    }
    setSortField(newOrder ? field : null);
    setSortOrder(newOrder);
    onSortChange?.(field, newOrder);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedKeys = checked ? dataSource.map(getRowKey) : [];
    onSelectChange?.(newSelectedKeys);
  };

  const handleSelectRow = (record: T) => {
    const key = getRowKey(record);
    const newSelectedKeys = selectedRowKeys.includes(key)
      ? selectedRowKeys.filter(k => k !== key)
      : [...selectedRowKeys, key];
    onSelectChange?.(newSelectedKeys);
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortOrder) return dataSource;
    return [...dataSource].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue === bValue) return 0;
      const compareResult = aValue > bValue ? 1 : -1;
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  }, [dataSource, sortField, sortOrder]);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className={`min-w-full divide-y divide-gray-200 ${
          bordered ? 'border border-gray-200' : ''
        }`}
      >
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedRowKeys.length === dataSource.length}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-sm font-medium text-gray-500 tracking-wider ${
                  column.align ? `text-${column.align}` : 'text-left'
                }`}
                style={{ width: column.width }}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {column.sortable && (
                    <button
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => handleSort(column.dataIndex)}
                    >
                      <div className="flex flex-col">
                        <ChevronUpIcon
                          className={`h-3 w-3 ${
                            sortField === column.dataIndex && sortOrder === 'asc'
                              ? 'text-primary-600'
                              : ''
                          }`}
                        />
                        <ChevronDownIcon
                          className={`h-3 w-3 ${
                            sortField === column.dataIndex && sortOrder === 'desc'
                              ? 'text-primary-600'
                              : ''
                          }`}
                        />
                      </div>
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center"
              >
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-gray-500"
              >
                暂无数据
              </td>
            </tr>
          ) : (
            sortedData.map((record, index) => (
              <tr
                key={getRowKey(record)}
                className={`${striped && index % 2 === 1 ? 'bg-gray-50' : ''} ${
                  selectable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={selectable ? () => handleSelectRow(record) : undefined}
              >
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedRowKeys.includes(getRowKey(record))}
                      onChange={() => handleSelectRow(record)}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                      column.align ? `text-${column.align}` : ''
                    }`}
                  >
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
