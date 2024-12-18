import React, { useState, useEffect } from 'react';

import {
  dataStatisticsService,
  StatTimeRangeType,
  IStatisticsData,
  IHealthReport,
} from '../../services/statistics';
import { Button } from '../Button';
import { HealthData, HealthMetric } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Loading } from '../Loading';
import { Message } from '../Message';
import { useTranslation } from 'react-i18next';
/** 统

计组件属性 */
export interface IStatisticsProps {
  /** 健康数据 */
  data: HealthData[];
  /** 选中的指标 */
  selectedMetrics?: HealthMetric[];
  /** 时间范围 */
  timeRange?: StatTimeRangeType;
  /** 自定义开始时间 */
  startDate?: Date;
  /** 自定义结束时间 */
  endDate?: Date;
  /** 是否显示报告 */
  showReport?: boolean;
  /** 自定义类名 */
  className?: string;
}

/** 统计数据展示组件 */
export const Statistics: React.FC<IStatisticsProps> = ({
  data,
  selectedMetrics = Object.values(HealthMetric),
  timeRange = 'week',
  startDate,
  endDate,
  showReport = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<Record<HealthMetric, IStatisticsData>>({});
  const [report, setReport] = useState<IHealthReport | null>(null);

  // 计算统计数据
  useEffect(() => {
    setLoading(true);
    try {
      const stats: Record<HealthMetric, IStatisticsData> = {};
      selectedMetrics.forEach(metric => {
        stats[metric] = dataStatisticsService.calculateStatistics(
          data,
          metric,
          timeRange,
          startDate,
          endDate,
        );
      });
      setStatistics(stats);

      if (showReport) {
        const newReport = dataStatisticsService.generateReport(
          data,
          timeRange === 'day'
            ? 'daily'
            : timeRange === 'week'
            ? 'weekly'
            : timeRange === 'month'
            ? 'monthly'
            : 'annual',
        );
        setReport(newReport);
      }
    } catch (error) {
      Message.error(t('statistics.error'));
    } finally {
      setLoading(false);
    }
  }, [data, selectedMetrics, timeRange, startDate, endDate, showReport]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 统计数据卡�� */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedMetrics.map(metric => {
          const stats = statistics[metric];
          if (!stats) return null;

          return (
            <div key={metric} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{t(`metric.${metric}`)}</h3>
              <div className="space-y-2">
                <p>
                  {t('statistics.average')}: {stats.average.toFixed(2)}
                </p>
                <p>
                  {t('statistics.max')}: {stats.max}
                </p>
                <p>
                  {t('statistics.min')}: {stats.min}
                </p>
                <p>
                  {t('statistics.standardDeviation')}: {stats.standardDeviation.toFixed(2)}
                </p>
              </div>

              {/* 趋势图表 */}
              <div className="mt-4">
                <LineChart width={300} height={200} data={stats.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={time => new Date(time).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={label => new Date(label).toLocaleString()} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={t(`metric.${metric}`)}
                    stroke="#8884d8"
                  />
                </LineChart>
              </div>

              {/* 异常数据提示 */}
              {stats.anomalies.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-yellow-500">{t('statistics.anomalies')}</h4>
                  <ul className="list-disc list-inside">
                    {stats.anomalies.map((anomaly, index) => (
                      <li key={index} className="text-sm">
                        {new Date(anomaly.time).toLocaleString()}: {anomaly.value} ({anomaly.reason}
                        )
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 健康报告 */}
      {showReport && report && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{t('statistics.report.title')}</h2>

          {/* 健康建议 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t('statistics.report.recommendations')}</h3>
            <ul className="list-disc list-inside space-y-2">
              {report.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          {/* 健康风险 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{t('statistics.report.risks')}</h3>
            <div className="space-y-2">
              {report.risks.map((risk, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    risk.level === 'high'
                      ? 'bg-red-100 text-red-800'
                      : risk.level === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <span className="font-semibold">
                    {t(`statistics.report.risk.${risk.level}`)}:{' '}
                  </span>
                  {risk.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
