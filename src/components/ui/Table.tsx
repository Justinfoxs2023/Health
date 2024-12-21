import React, { useState } from 'react';

import { theme } from '../../styles/theme';

interface IColumn<T> {
  /** key 的描述 */
    key: string;
  /** title 的描述 */
    title: string;
  /** dataIndex 的描述 */
    dataIndex?: undefined | string;
  /** width 的描述 */
    width?: undefined | string | number;
  /** fixed 的描述 */
    fixed?: undefined | "left" | "right";
  /** render 的描述 */
    render?: undefined | (value: any, record: T, index: number) => React.ReactNode;
  /** sorter 的描述 */
    sorter?: undefined | false | true | (a: T, b: T) => number;
  /** filters 的描述 */
    filters?: undefined | { text: string; value: any; }[];
  /** onFilter 的描述 */
    onFilter?: undefined | (value: any, record: T) => boolean;
}

interface ITableProps<T> {
  /** columns 的描述 */
    columns: IColumn<T>[];
  /** dataSource 的描述 */
    dataSource: T[];
  /** rowKey 的描述 */
    rowKey: string | (record: T) => string;
  /** loading 的描述 */
    loading?: undefined | false | true;
  /** bordered 的描述 */
    bordered?: undefined | false | true;
  /** striped 的描述 */
    striped?: undefined | false | true;
  /** size 的描述 */
    size?: undefined | "small" | "medium" | "large";
  /** scroll 的描述 */
    scroll?: undefined | { x?: string | number | undefined; y?: string | number | undefined; };
  /** onRow 的描述 */
    onRow?: undefined | (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
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
  onRow,
}: ITableProps<T>): import("D:/Health/node_modules/@types/react/jsx-runtime").JSX.Element {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState<Record<string, any[]>>({});

  const handleSort = (column: IColumn<T>) => {
    if (!column.sorter) return;

    const newOrder = sortColumn === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column.key);
    setSortOrder(newOrder);
  };

  const handleFilter = (column: IColumn<T>, values: any[]) => {
    setFilters(prev => ({ ...prev, [column.key]: values }));
  };

  const getSortedAndFilteredData = () => {
    let result = [...dataSource];

    // Apply filters
    Object.entries(filters).forEach(([key, values]) => {
      const column = columns.find(col => col.key === key);
      if (column?.onFilter && values.length > 0) {
        result = result.filter(record => values.some(value => column.onFilter!(value, record)));
      }
    });

    // Apply sorting
    if (sortColumn) {
      const column = columns.find(col => col.key === sortColumn);
      if (column?.sorter) {
        const sorter =
          typeof column.sorter === 'function'
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
        <table
          className={`table ${bordered ? 'bordered' : ''} ${striped ? 'striped' : ''} ${size}`}
        >
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={column.fixed ? `fixed-${column.fixed}` : ''}
                >
                  <div className="th-content">
                    <span>{columntitle}</span>
                    {column.sorter && (
                      <span
                        className={sorticon {sortColumn === columnkey  sortOrder  }}
                        onClick={ => handleSortcolumn}
                      >
                        
                      </span>
                    )}
                    {column.filters && (
                      <div className="filterdropdown">{/ Filter dropdown content /}</div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columnslength} className="loadingcell">
                  
                </td>
              </tr>
            ) : (
              getSortedAndFilteredData().map((record, index) => (
                <tr key={getRowKey(record, index)} {...(onRow ? onRow(record, index) : {})}>
                  {columns.map(column => (
                    <td key={columnkey} className={columnfixed  fixed{columnfixed}  }>
                      {columnrender
                         columnrender
                            columndataIndex  recordcolumndataIndex as keyof T  null
                            record
                            index
                          
                         columndataIndex
                         recordcolumndataIndex as keyof T
                         null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{
        tablecontainer {
          width 100
          overflow hidden
          borderradius {themeborderRadiusmedium}
          background {themecolorsbackgroundpaper}
        }

        tablescroll {
          overflow auto
          maxheight {scrolly  auto}
          maxwidth {scrollx  auto}
        }

        table {
          width 100
          bordercollapse collapse
        }

        tablebordered th
        tablebordered td {
          border 1px solid rgba0 0 0 01
        }

        tablestriped tbody trnthchildodd {
          background rgba0 0 0 002
        }

        tablesmall th
        tablesmall td {
          padding {themespacing1}
          fontsize {themetypographybody2fontSize}
        }

        tablemedium th
        tablemedium td {
          padding {themespacing15}
          fontsize {themetypographybody1fontSize}
        }

        tablelarge th
        tablelarge td {
          padding {themespacing2}
          fontsize {themetypographyh3fontSize}
        }

        th {
          background {themecolorsbackgrounddefault}
          fontweight 500
          textalign left
          position sticky
          top 0
          zindex 1
        }

        thcontent {
          display flex
          alignitems center
          gap {themespacing1}
        }

        sorticon {
          cursor pointer
          opacity 05
          transition opacity {themetransitionsshort}
        }

        sorticonhover {
          opacity 1
        }

        sorticonasc {
          transform rotate180deg
        }

        fixedleft {
          position sticky
          left 0
          background inherit
          zindex 1
        }

        fixedright {
          position sticky
          right 0
          background inherit
          zindex 1
        }

        loadingcell {
          textalign center
          padding {themespacing4}
          color {themecolorstextsecondary}
        }
      }</style>
    </div>
  );
}
