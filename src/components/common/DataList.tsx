import React from 'react';

import { List, Empty } from 'antd';

interface IProps<T> {
  /** data 的描述 */
  data: T[];
  /** renderItem 的描述 */
  renderItem: (item: T) => React.ReactNode;
  /** loading 的描述 */
  loading?: undefined | false | true;
  /** emptyText 的描述 */
  emptyText?: undefined | string;
}

export function DataList<T>({
  data,
  renderItem,
  loading,
  emptyText = '暂无数据',
}: IProps<T>): import('D:/Health/node_modules/@types/react/jsx-runtime').JSX.Element {
  if (!data.length) {
    return <Empty description={emptyText} />;
  }

  return <List dataSource={data} renderItem={renderItem} loading={loading} />;
}
