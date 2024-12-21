import React, { useEffect, useState } from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  healthAnalysisService,
  RiskLevel,
  TrendType,
  IRiskAssessment,
  ITrendAnalysis,
  IHealthAdvice,
} from '../../services/analysis';
import { IHealthData, HealthDataType } from '../../types';
import { Loading } from '../Loading';
import { Message } from '../Message';
import { formatDate } from '../../utils';
import { useTranslation } from 'react-i18next';

export interface IHealthAn
alysisProps {
  /** 健康数据 */
  data: IHealthData[];
  /** 数据类型 */
  type: HealthDataType;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

interface IChartDataPoint {
  /** timestamp 的描述 */
    timestamp: string;
  /** value 的描述 */
    value: number;
  /** isPrediction 的描述 */
    isPrediction?: boolean;
  /** isOutlier 的描述 */
    isOutlier?: boolean;
}

interface IDimensionScore {
  /** dimension 的描述 */
    dimension: string;
  /** score 的描述 */
    score: number;
  /** status 的描述 */
    status: string;
}

/** 健康趋势分析组件 */
export const HealthAnalysis: React.FC<HealthAnalysisProps> = ({ data, type, className, style }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [riskAssessment, setRiskAssessment] = useState<IRiskAssessment | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<ITrendAnalysis | null>(null);
  const [advice, setAdvice] = useState<IHealthAdvice[]>([]);
  const [selectedChart, setSelectedChart] = useState<
    'trend' | 'scatter' | 'distribution' | 'radar'
  >('trend');

  useEffect(() => {
    const analyzeData = async () => {
      try {
        setLoading(true);
        // 获取风险评估
        const risk = await healthAnalysisService.assessRisk(data);
        setRiskAssessment(risk);

        // 获取趋势分析
        const trend = await healthAnalysisService.analyzeTrend(data, type);
        setTrendAnalysis(trend);

        // 获取健康建议
        const healthAdvice = await healthAnalysisService.generateAdvice(data);
        setAdvice(healthAdvice);
      } catch (error) {
        Message.error(t('analysis.error'));
      } finally {
        setLoading(false);
      }
    };

    if (data.length > 0) {
      analyzeData();
    } else {
      setLoading(false);
    }
  }, [data, type, t]);

  if (loading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return <div className="text-gray-500">{t('analysis.noData')}</div>;
  }

  if (!riskAssessment || !trendAnalysis) {
    return <div className="text-gray-500">{t('analysis.error')}</div>;
  }

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH:
        return 'text-red-500';
      case RiskLevel.MEDIUM:
        return 'text-yellow-500';
      case RiskLevel.LOW:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendTypeIcon = (type: TrendType) => {
    switch (type) {
      case TrendType.IMPROVING:
        return '📈';
      case TrendType.WORSENING:
        return '📉';
      case TrendType.STABLE:
        return '📊';
      default:
        return '❓';
    }
  };

  // 准备图表数据
  const chartData: IChartDataPoint[] = [
    ...data.map(item => ({
      timestamp: formatDate(item.timestamp),
      value: item.value,
      isOutlier: trendAnalysis.outliers?.some(
        o => o.timestamp.getTime() === item.timestamp.getTime(),
      ),
    })),
    ...trendAnalysis.prediction.map((value, index) => ({
      timestamp: formatDate(
        new Date(data[data.length - 1].timestamp.getTime() + (index + 1) * 24 * 60 * 60 * 1000),
      ),
      value,
      isPrediction: true,
    })),
  ];

  // 准备维度得分数据
  const dimensionScores: IDimensionScore[] = riskAssessment.details.map(detail => ({
    dimension: t(`healthData.type.${detail.type}`),
    score: detail.score,
    status: detail.status,
  }));

  // 渲染趋势图表
  const renderTrendChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={dot => ({
            r: dot.payload.isOutlier ? 6 : 4,
            fill: dot.payload.isOutlier ? '#ff0000' : '#8884d8',
            stroke: dot.payload.isOutlier ? '#ff0000' : '#8884d8',
          })}
          name={t('analysis.actualValue')}
        />
        <Line
          type="monotone"
          dataKey="isPrediction"
          stroke="#82ca9d"
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={{ r: 4 }}
          name={t('analysis.predictedValue')}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // 渲染散点图
  const renderScatterChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" name="时间" />
        <YAxis dataKey="value" name="数值" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter
          name={t('analysis.actualValue')}
          data={chartData.filter(d => !d.isPrediction)}
          fill="#8884d8"
        />
        <Scatter
          name={t('analysis.predictedValue')}
          data={chartData.filter(d => d.isPrediction)}
          fill="#82ca9d"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );

  // 渲染分布图
  const renderDistributionChart = () => {
    const intervals = 10;
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const step = range / intervals;

    const distribution = Array(intervals).fill(0);
    values.forEach(value => {
      const index = Math.min(Math.floor((value - min) / step), intervals - 1);
      distribution[index]++;
    });

    const distributionData = distribution.map((count, i) => ({
      range: `${(min + i * step).toFixed(1)}-${(min + (i + 1) * step).toFixed(1)}`,
      count,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={distributionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name={t('analysis.distribution')} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // 渲染雷达图
  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid />
        <PolarAngleAxis dataKey="dimension" />
        <PolarRadiusAxis angle={30} domain={[0, 5]} />
        <Radar
          name={t('analysis.dimensionScore')}
          dataKey="score"
          data={dimensionScores}
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );

  return (
    <div className={`health-analysis ${className || ''}`} style={style}>
      {/* 风险评估 */}
      <div className="health-analysis__risk mb-6">
        <h3 className="text-lg font-medium mb-2">{t('analysis.riskAssessment')}</h3>
        <div className={`text-xl font-bold mb-2 ${getRiskLevelColor(riskAssessment.level)}`}>
          {t(`analysis.riskLevel.${riskAssessment.level}`)}
        </div>
        {riskAssessment.factors.length > 0 && (
          <div className="mb-2">
            <div className="font-medium mb-1">{t('analysis.riskFactors')}:</div>
            <ul className="list-disc list-inside">
              {riskAssessment.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 趋势分析 */}
      <div className="health-analysis__trend mb-6">
        <h3 className="text-lg font-medium mb-2">{t('analysis.trendAnalysis')}</h3>
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{getTrendTypeIcon(trendAnalysis.type)}</span>
          <span className="font-medium">{t(`analysis.trendType.${trendAnalysis.type}`)}</span>
        </div>
        <div className="mb-4">
          <div>
            {t('analysis.changeRate')}: {(trendAnalysis.changeRate * 100).toFixed(1)}%
          </div>
          <div>
            {t('analysis.confidence')}: {(trendAnalysis.confidence * 100).toFixed(1)}%
          </div>
          {trendAnalysis.seasonality && (
            <div>
              {t('analysis.seasonality')}:{' '}
              {t(`analysis.pattern.${trendAnalysis.seasonality.pattern}`)}(
              {(trendAnalysis.seasonality.strength * 100).toFixed(1)}%)
            </div>
          )}
        </div>

        {/* 图表切换按钮 */}
        <div className="mb-4 flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              selectedChart === 'trend' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedChart('trend')}
          >
            {t('analysis.chart.trend')}
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedChart === 'scatter' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedChart('scatter')}
          >
            {t('analysis.chart.scatter')}
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedChart === 'distribution' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedChart('distribution')}
          >
            {t('analysis.chart.distribution')}
          </button>
          <button
            className={`px-3 py-1 rounded ${
              selectedChart === 'radar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedChart('radar')}
          >
            {t('analysis.chart.radar')}
          </button>
        </div>

        {/* 图表显示区域 */}
        <div className="h-64">
          {selectedChart === 'trend' && renderTrendChart()}
          {selectedChart === 'scatter' && renderScatterChart()}
          {selectedChart === 'distribution' && renderDistributionChart()}
          {selectedChart === 'radar' && renderRadarChart()}
        </div>

        {/* 异常值提示 */}
        {trendAnalysis.outliers && trendAnalysis.outliers.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">{t('analysis.outliers')}</h4>
            <ul className="list-disc list-inside">
              {trendAnalysis.outliers.map((outlier, index) => (
                <li key={index} className="text-red-500">
                  {formatDate(outlier.timestamp)}: {outlier.value}({t('analysis.deviation')}:{' '}
                  {outlier.deviation.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 健康建议 */}
      <div className="health-analysis__advice">
        <h3 className="text-lg font-medium mb-2">{t('analysis.healthAdvice')}</h3>
        {advice.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{t(`healthData.type.${item.type}`)}</div>
              <div className="text-sm text-gray-500">
                {t(`advice.category.${item.category}`)} |{t('advice.confidence')}:{' '}
                {(item.confidence * 100).toFixed(1)}% |{t('advice.impact')}:{' '}
                {t(`advice.impact.${item.impact}`)}
              </div>
            </div>
            <div className="whitespace-pre-line text-gray-600">{item.advice}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
