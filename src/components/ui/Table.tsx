import React, { useState } from 'react';
import { theme } from '../../styles/theme';

interface Column<T> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: { text: string; value: any }[];
  onFilter?: (value: any, record: T) => boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey: string | ((record: T) => string);
  loading?: boolean;
  bordered?: boolean;
  striped?: boolean;
  size?: 'small' | 'medium' | 'large';
  scroll?: { x?: number | string; y?: number | string };
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
}

export function Table<T extends object>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  bordered = false,
  striped = false,
  size = 'medium',
  scroll,
  onRow
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState<Record<string, any[]>>({});

  const handleSort = (column: Column<T>) => {
    if (!column.sorter) return;

    const newOrder = sortColumn === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column.key);
    setSortOrder(newOrder);
  };

  const handleFilter = (column: Column<T>, values: any[]) => {
    setFilters(prev => ({ ...prev, [column.key]: values }));
  };

  const getSortedAndFilteredData = () => {
    let result = [...dataSource];

    // Apply filters
    Object.entries(filters).forEach(([key, values]) => {
      const column = columns.find(col => col.key === key);
      if (column?.onFilter && values.length > 0) {
        result = result.filter(record => 
          values.some(value => column.onFilter!(value, record))
        );
      }
    });

    // Apply sorting
    if (sortColumn) {
      const column = columns.find(col => col.key === sortColumn);
      if (column?.sorter) {
        const sorter = typeof column.sorter === 'function'
          ? column.sorter
          : (a: T, b: T) => {
              const aValue = column.dataIndex ? a[column.dataIndex as keyof T] : null;
              const bValue = column.dataIndex ? b[column.dataIndex as keyof T] : null;
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            };

        result.sort((a, b) => {
          const result = sorter(a, b);
          return sortOrder === 'desc' ? -result : result;
        });
      }
    }

    return result;
  };

  const getRowKey = (record: T, index: number) => {
    return typeof rowKey === 'function' ? rowKey(record) : record[rowKey as keyof T];
  };

  return (
    <div className="table-container">
      <div className="table-scroll" style={scroll}>
        <table className={`table ${bordered ? 'bordered' : ''} ${striped ? 'striped' : ''} ${size}`}>
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={column.fixed ? `fixed-${column.fixed}` : ''}
                >
                  <div className="th-content">
                    <span>{column.title}</span>
                    {column.sorter && (
                      <span
                        className={`sort-icon ${sortColumn === column.key ? sortOrder : ''}`}
                        onClick={() => handleSort(column)}
                      >
                        ⇅
                      </span>
                    )}
                    {column.filters && (
                      <div className="filter-dropdown">
                        {/* Filter dropdown content */}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="loading-cell">
                  加载中...
                </td>
              </tr>
            ) : (
              getSortedAndFilteredData().map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  {...(onRow ? onRow(record, index) : {})}
                >
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className={column.fixed ? `fixed-${column.fixed}` : ''}
                    >
                      {column.render
                        ? column.render(
                            column.dataIndex ? record[column.dataIndex as keyof T] : null,
                            record,
                            index
                          )
                        : column.dataIndex
                        ? record[column.dataIndex as keyof T]
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          width: 100%;
          overflow: hidden;
          border-radius: ${theme.borderRadius.medium};
          background: ${theme.colors.background.paper};
        }

        .table-scroll {
          overflow: auto;
          max-height: ${scroll?.y || 'auto'};
          max-width: ${scroll?.x || 'auto'};
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table.bordered th,
        .table.bordered td {
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .table.striped tbody tr:nth-child(odd) {
          background: rgba(0, 0, 0, 0.02);
        }

        .table.small th,
        .table.small td {
          padding: ${theme.spacing(1)};
          font-size: ${theme.typography.body2.fontSize};
        }

        .table.medium th,
        .table.medium td {
          padding: ${theme.spacing(1.5)};
          font-size: ${theme.typography.body1.fontSize};
        }

        .table.large th,
        .table.large td {
          padding: ${theme.spacing(2)};
          font-size: ${theme.typography.h3.fontSize};
        }

        th {
          background: ${theme.colors.background.default};
          font-weight: 500;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: ${theme.spacing(1)};
        }

        .sort-icon {
          cursor: pointer;
          opacity: 0.5;
          transition: opacity ${theme.transitions.short};
        }

        .sort-icon:hover {
          opacity: 1;
        }

        .sort-icon.asc {
          transform: rotate(180deg);
        }

        .fixed-left {
          position: sticky;
          left: 0;
          background: inherit;
          z-index: 1;
        }

        .fixed-right {
          position: sticky;
          right: 0;
          background: inherit;
          z-index: 1;
        }

        .loading-cell {
          text-align: center;
          padding: ${theme.spacing(4)};
          color: ${theme.colors.text.secondary};
        }
      `}</style>
    </div>
  );
} 