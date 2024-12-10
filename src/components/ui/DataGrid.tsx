import React, { useState } from 'react';
import { theme } from '../../styles/theme';

interface Column {
  field: string;
  headerName: string;
  width?: number;
  flex?: number;
  renderCell?: (value: any) => React.ReactNode;
}

interface DataGridProps {
  columns: Column[];
  rows: any[];
  pageSize?: number;
  loading?: boolean;
  onRowClick?: (row: any) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  rows,
  pageSize = 10,
  loading = false,
  onRowClick
}) => {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="data-grid">
      <div className="grid-header">
        {columns.map(column => (
          <div
            key={column.field}
            className="grid-cell header-cell"
            style={{ width: column.width, flex: column.flex }}
            onClick={() => handleSort(column.field)}
          >
            {column.headerName}
            {sortField === column.field && (
              <span className="sort-icon">
                {sortDirection === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid-body">
        {loading ? (
          <div className="loading-state">加载中...</div>
        ) : (
          rows
            .slice(page * pageSize, (page + 1) * pageSize)
            .map((row, index) => (
              <div
                key={index}
                className="grid-row"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(column => (
                  <div
                    key={column.field}
                    className="grid-cell"
                    style={{ width: column.width, flex: column.flex }}
                  >
                    {column.renderCell
                      ? column.renderCell(row[column.field])
                      : row[column.field]}
                  </div>
                ))}
              </div>
            ))
        )}
      </div>

      <div className="grid-pagination">
        <button
          onClick={() => setPage(prev => Math.max(0, prev - 1))}
          disabled={page === 0}
        >
          上一页
        </button>
        <span>第 {page + 1} 页</span>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={(page + 1) * pageSize >= rows.length}
        >
          下一页
        </button>
      </div>

      <style jsx>{`
        .data-grid {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: ${theme.borderRadius.medium};
          overflow: hidden;
        }

        .grid-header {
          display: flex;
          background: ${theme.colors.background.default};
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .header-cell {
          font-weight: bold;
          cursor: pointer;
          user-select: none;
        }

        .header-cell:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .grid-cell {
          padding: ${theme.spacing(1.5)};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .grid-row {
          display: flex;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: background ${theme.transitions.short};
        }

        .grid-row:hover {
          background: rgba(0, 0, 0, 0.02);
        }

        .grid-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: ${theme.spacing(2)};
          padding: ${theme.spacing(2)};
          background: ${theme.colors.background.default};
        }

        .loading-state {
          padding: ${theme.spacing(4)};
          text-align: center;
          color: ${theme.colors.text.secondary};
        }
      `}</style>
    </div>
  );
}; 