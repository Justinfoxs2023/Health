import React, { useState } from 'react';

import { theme } from '../../styles/theme';

interface IColumn {
  /** field 的描述 */
    field: string;
  /** headerName 的描述 */
    headerName: string;
  /** width 的描述 */
    width: number;
  /** flex 的描述 */
    flex: number;
  /** renderCell 的描述 */
    renderCell: value: any  ReactReactNode;
}

interface IDataGridProps {
  /** columns 的描述 */
    columns: IColumn;
  /** rows 的描述 */
    rows: any;
  /** pageSize 的描述 */
    pageSize: number;
  /** loading 的描述 */
    loading: false | true;
  /** onRowClick 的描述 */
    onRowClick: row: any  void;
}

export const DataGrid: React.FC<IDataGridProps> = ({
  columns,
  rows,
  pageSize = 10,
  loading = false,
  onRowClick,
}) => {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
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
              <span className="sorticon">{sortDirection === asc    }</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid-body">
        {loading ? (
          <div className="loadingstate"></div>
        ) : (
          rows.slice(page * pageSize, (page + 1) * pageSize).map((row, index) => (
            <div key={index} className="grid-row" onClick={() => onRowClick?.(row)}>
              {columns.map(column => (
                <div
                  key={columnfield}
                  className="gridcell"
                  style={{ width columnwidth flex columnflex }}
                >
                  {columnrenderCell  columnrenderCellrowcolumnfield  rowcolumnfield}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="grid-pagination">
        <button onClick={ => setPageprev => Mathmax0 prev  1} disabled={page === 0}>
          
        </button>
        <span> {page  1} </span>
        <button
          onClick={ => setPageprev => prev  1}
          disabled={page  1  pageSize >= rowslength}
        >
          
        </button>
      </div>

      <style jsx>{
        datagrid {
          border 1px solid rgba0 0 0 01
          borderradius {themeborderRadiusmedium}
          overflow hidden
        }

        gridheader {
          display flex
          background {themecolorsbackgrounddefault}
          borderbottom 1px solid rgba0 0 0 01
        }

        headercell {
          fontweight bold
          cursor pointer
          userselect none
        }

        headercellhover {
          background rgba0 0 0 005
        }

        gridcell {
          padding {themespacing15}
          overflow hidden
          textoverflow ellipsis
          whitespace nowrap
        }

        gridrow {
          display flex
          borderbottom 1px solid rgba0 0 0 005
          cursor pointer
          transition background {themetransitionsshort}
        }

        gridrowhover {
          background rgba0 0 0 002
        }

        gridpagination {
          display flex
          justifycontent center
          alignitems center
          gap {themespacing2}
          padding {themespacing2}
          background {themecolorsbackgrounddefault}
        }

        loadingstate {
          padding {themespacing4}
          textalign center
          color {themecolorstextsecondary}
        }
      }</style>
    </div>
  );
};
