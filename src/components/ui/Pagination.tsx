import React from 'react';
import { theme } from '../../styles/theme';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showQuickJumper = false,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const [jumpValue, setJumpValue] = React.useState('');

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, current - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <button key={1} onClick={() => onChange(1)} className="page-button">
          1
        </button>
      );
      if (start > 2) {
        pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`page-button ${current === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onChange(totalPages)}
          className="page-button"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        上一页
      </button>

      <div className="page-numbers">{renderPageNumbers()}</div>

      <button
        className="page-button"
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
      >
        下一页
      </button>

      {showSizeChanger && (
        <select
          value={pageSize}
          onChange={e => onPageSizeChange?.(Number(e.target.value))}
          className="size-select"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} 条/页
            </option>
          ))}
        </select>
      )}

      {showQuickJumper && (
        <div className="quick-jumper">
          跳至
          <input
            type="number"
            value={jumpValue}
            onChange={e => setJumpValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const page = Number(jumpValue);
                if (page >= 1 && page <= totalPages) {
                  onChange(page);
                  setJumpValue('');
                }
              }
            }}
          />
          页
        </div>
      )}

      <style jsx>{`
        .pagination {
          display: flex;
          align-items: center;
          gap: ${theme.spacing(1)};
        }

        .page-numbers {
          display: flex;
          align-items: center;
          gap: ${theme.spacing(1)};
        }

        .page-button {
          min-width: 32px;
          height: 32px;
          padding: 0 ${theme.spacing(1)};
          border: 1px solid rgba(0, 0, 0, 0.23);
          border-radius: ${theme.borderRadius.small};
          background: ${theme.colors.background.paper};
          color: ${theme.colors.text.primary};
          cursor: pointer;
          transition: all ${theme.transitions.short};
        }

        .page-button:hover:not(:disabled) {
          border-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.main};
        }

        .page-button.active {
          background: ${theme.colors.primary.main};
          border-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrastText};
        }

        .page-button:disabled {
          color: ${theme.colors.text.disabled};
          cursor: not-allowed;
        }

        .ellipsis {
          color: ${theme.colors.text.secondary};
        }

        .size-select {
          padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
          border: 1px solid rgba(0, 0, 0, 0.23);
          border-radius: ${theme.borderRadius.small};
          background: ${theme.colors.background.paper};
        }

        .quick-jumper {
          display: flex;
          align-items: center;
          gap: ${theme.spacing(1)};
        }

        .quick-jumper input {
          width: 50px;
          padding: ${theme.spacing(0.5)};
          border: 1px solid rgba(0, 0, 0, 0.23);
          border-radius: ${theme.borderRadius.small};
          text-align: center;
        }
      `}</style>
    </div>
  );
}; 