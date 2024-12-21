import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card } from '../Card';
import { INutritionAnalysis, NutrientType } from '../../services/food';
import { Loading } from '../Loading';
import { useTranslation } from 'react-i18next';
ChartJS.r;
egister(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface IProps {
  /** 营养分析数据 */
  data?: INutritionAnalysis;
  /** 加载状态 */
  loading?: boolean;
  /** 错误信息 */
  error?: string;
}

/** 营养分析组件 */
export const NutritionAnalysisComponent: React.FC<IProps> = ({ data, loading, error }) => {
  const { t } = useTranslation();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-red-500">{error}</div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-4">
        <div className="text-gray-500">{t('nutrition.noData')}</div>
      </Card>
    );
  }

  /** 获取营养素状态颜色 */
  const getStatusColor = (status: 'low' | 'normal' | 'high'): string => {
    switch (status) {
      case 'low':
        return '#EF4444'; // red
      case 'normal':
        return '#10B981'; // green
      case 'high':
        return '#F59E0B'; // yellow
      default:
        return '#6B7280'; // gray
    }
  };

  /** 获取营养素名称 */
  const getNutrientName = (type: NutrientType): string => {
    return t(`nutrition.nutrients.${type}`);
  };

  /** 营养素分布数据 */
  const distributionData = {
    labels: data.nutrientDistribution.map(n => getNutrientName(n.type)),
    datasets: [
      {
        label: t('nutrition.distribution'),
        data: data.nutrientDistribution.map(n => n.percentage),
        backgroundColor: data.nutrientDistribution.map(n => getStatusColor(n.status)),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  /** 营养素分布图表选项 */
  const distributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: t('nutrition.distributionTitle'),
      },
    },
  };

  /** 健康评分数据 */
  const scoreData = {
    labels: [t('nutrition.score'), t('nutrition.remaining')],
    datasets: [
      {
        data: [data.healthScore, 100 - data.healthScore],
        backgroundColor: ['#10B981', '#E5E7EB'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 1,
      },
    ],
  };

  /** 健康评分图表选项 */
  const scoreOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('nutrition.scoreTitle'),
      },
    },
    cutout: '70%',
  };

  return (
    <Card className="p-6">
      {/* 总热量 */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4">{t('nutrition.totalCalories')}</h3>
        <div className="text-3xl font-bold text-primary">
          {data.totalCalories} {t('nutrition.units.kcal')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 营养素分布 */}
        <div>
          <Bar data={distributionData} options={distributionOptions} />
        </div>

        {/* 健康评分 */}
        <div className="relative">
          <Doughnut data={scoreData} options={scoreOptions} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl font-bold">{data.healthScore}</div>
            <div className="text-sm text-gray-500">{t('nutrition.score')}</div>
          </div>
        </div>
      </div>

      {/* 营养建议 */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">{t('nutrition.recommendations')}</h3>
        <div className="space-y-4">
          {data.recommendations.map((rec, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 flex items-start">
              <div
                className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                  rec.priority === 3
                    ? 'bg-red-500'
                    : rec.priority === 2
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
              <div>
                <div className="font-medium mb-1">{getNutrientName(rec.type)}</div>
                <div className="text-gray-600">{rec.suggestion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 详细营养素数据 */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">{t('nutrition.details')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.nutrientDistribution.map((nutrient, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{getNutrientName(nutrient.type)}</div>
                <div
                  className={`px-2 py-1 rounded text-sm ${
                    nutrient.status === 'normal'
                      ? 'bg-green-100 text-green-800'
                      : nutrient.status === 'low'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {t(`nutrition.status.${nutrient.status}`)}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {nutrient.value.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {t('nutrition.units.g')}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {t('nutrition.percentage')}: {nutrient.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default NutritionAnalysisComponent;
