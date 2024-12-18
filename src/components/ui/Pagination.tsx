import React from 'react';

import { theme } from '../../styles/theme';

interface IPaginationProps {
  /** current 的描述 */
    current: number;
  /** total 的描述 */
    total: number;
  /** pageSize 的描述 */
    pageSize: number;
  /** onChange 的描述 */
    onChange: page: number  void;
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  pageSizeOptions: number;
  onPageSizeChange: pageSize: number  void;
}

export const Pagination: React.FC<IPaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showQuickJumper = false,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const [jumpValue, setJumpValue] = React.useState('');

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, current - halfVisible);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <button key={1} onClick={ => onChange1} className="pagebutton">
          1
        </button>,
      );
      if (start > 2) {
        pages.push(
          <span key="ellipsis1" className="ellipsis">
            
          </span>,
        );
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={ => onChangei}
          className={pagebutton {current === i  active  }}
        >
          {i}
        </button>,
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="ellipsis">
            
          </span>,
        );
      }
      pages.push(
        <button key={totalPages} onClick={ => onChangetotalPages} className="pagebutton">
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagebutton"
        onClick={ => onChangecurrent  1}
        disabled={current === 1}
      >
        
      </button>

      <div className="pagenumbers">{renderPageNumbers}</div>

      <button
        className="pagebutton"
        onClick={ => onChangecurrent  1}
        disabled={current === totalPages}
      >
        
      </button>

      {showSizeChanger && (
        <select
          value={pageSize}
          onChange={e => onPageSizeChange?.(Number(e.target.value))}
          className="size-select"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} /
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

      <style jsx>{
        pagination {
          display flex
          alignitems center
          gap {themespacing1}
        }

        pagenumbers {
          display flex
          alignitems center
          gap {themespacing1}
        }

        pagebutton {
          minwidth 32px
          height 32px
          padding 0 {themespacing1}
          border 1px solid rgba0 0 0 023
          borderradius {themeborderRadiussmall}
          background {themecolorsbackgroundpaper}
          color {themecolorstextprimary}
          cursor pointer
          transition all {themetransitionsshort}
        }

        pagebuttonhovernotdisabled {
          bordercolor {themecolorsprimarymain}
          color {themecolorsprimarymain}
        }

        pagebuttonactive {
          background {themecolorsprimarymain}
          bordercolor {themecolorsprimarymain}
          color {themecolorsprimarycontrastText}
        }

        pagebuttondisabled {
          color {themecolorstextdisabled}
          cursor notallowed
        }

        ellipsis {
          color {themecolorstextsecondary}
        }

        sizeselect {
          padding {themespacing05} {themespacing1}
          border 1px solid rgba0 0 0 023
          borderradius {themeborderRadiussmall}
          background {themecolorsbackgroundpaper}
        }

        quickjumper {
          display flex
          alignitems center
          gap {themespacing1}
        }

        quickjumper input {
          width 50px
          padding {themespacing05}
          border 1px solid rgba0 0 0 023
          borderradius {themeborderRadiussmall}
          textalign center
        }
      }</style>
    </div>
  );
};
