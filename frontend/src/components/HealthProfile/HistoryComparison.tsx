import React from 'react';
import { Card, Select, Table } from 'antd';
import { useQuery } from 'react-query';
import { getHistoricalData } from '../../services/health.service';

export const HistoryComparison: React.FC = () => {
  const [selectedDates, setSelectedDates] = React.useState<string[]>([]);
  const { data: historicalData } = useQuery(
    ['healthHistory', selectedDates],
    () => getHistoricalData(selectedDates)
  );

  const columns = [
    {
      title: '指标',
      dataIndex: 'metric',
      key: 'metric',
    },
    ...selectedDates.map(date => ({
      title: date,
      dataIndex: date,
      key: date,
    }))
  ];

  return (
    <Card title="历史数据对比">
      <Select
        mode="multiple"
        placeholder="选择要对比的日期"
        onChange={setSelectedDates}
        style={{ width: '100%', marginBottom: 16 }}
      >
        {/* 日期选项 */}
      </Select>
      <Table 
        columns={columns} 
        dataSource={historicalData} 
        pagination={false}
      />
    </Card>
  );
}; 