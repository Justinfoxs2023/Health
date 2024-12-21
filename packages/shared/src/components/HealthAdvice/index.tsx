import React, { useEffect, useState } from 'react';

import { Card } from '../Card';
import { IHealthData } from '../../types';
import { Loading } from '../Loading';
import { Message } from '../Message';
import { healthAnalysisService, IHealthAdvice as IHealthAdvice } from '../../services/analysis';
import { useTranslation } from 'react-i18next';

export interface IHealthAdviceProps {
  /** 健康数据 */
  data: IHealthData[];
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/** 健康建议生成组件 */
export const HealthAdvice: React.FC<IHealthAdviceProps> = ({ data, className, style }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<IHealthAdvice[]>([]);

  useEffect(() => {
    const generateAdvice = async () => {
      try {
        setLoading(true);
        const healthAdvice = await healthAnalysisService.generateAdvice(data);
        setAdvice(healthAdvice);
      } catch (error) {
        Message.error(t('advice.error'));
      } finally {
        setLoading(false);
      }
    };

    if (data.length > 0) {
      generateAdvice();
    } else {
      setLoading(false);
    }
  }, [data, t]);

  if (loading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return <div className="text-gray-500">{t('advice.noData')}</div>;
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3:
        return 'border-red-500 bg-red-50';
      case 2:
        return 'border-yellow-500 bg-yellow-50';
      case 1:
      default:
        return 'border-green-500 bg-green-50';
    }
  };

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 3:
        return '⚠️';
      case 2:
        return '⚡';
      case 1:
      default:
        return '✅';
    }
  };

  const getImpactColor = (impact: IHealthAdvice['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const groupedAdvice = advice.reduce<Record<string, IHealthAdvice[]>>((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {});

  return (
    <div className={`health-advice ${className || ''}`} style={style}>
      <h2 className="text-xl font-bold mb-4">{t('advice.title')}</h2>

      {/* 分类建议 */}
      {Object.entries(groupedAdvice).map(([type, items]) => (
        <Card key={type} className="mb-4">
          <h3 className="text-lg font-medium mb-3">{t(`healthData.type.${type}`)}</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className={`p-4 border-l-4 rounded-lg ${getPriorityColor(item.priority)}`}
              >
                <div className="flex items-start">
                  <span className="text-xl mr-2">{getPriorityIcon(item.priority)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {t('advice.priority')}: {item.priority}
                      </div>
                      <div className="text-sm">
                        <span className="mr-2">{t(`advice.category.${item.category}`)}</span>
                        <span className="mr-2">
                          {t('advice.confidence')}: {(item.confidence * 100).toFixed(1)}%
                        </span>
                        <span className={getImpactColor(item.impact)}>
                          {t('advice.impact')}: {t(`advice.impact.${item.impact}`)}
                        </span>
                      </div>
                    </div>
                    <div className="whitespace-pre-line text-gray-600">{item.advice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* 综合建议 */}
      {advice.length > 0 && (
        <Card className="mt-6">
          <h3 className="text-lg font-medium mb-3">{t('advice.comprehensive')}</h3>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <span className="text-xl mr-2">💡</span>
              <div>
                <div className="font-medium mb-2">{t('advice.comprehensiveTitle')}</div>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>{t('advice.lifestyle')}</li>
                  <li>{t('advice.exercise')}</li>
                  <li>{t('advice.diet')}</li>
                  <li>{t('advice.sleep')}</li>
                  <li>{t('advice.stress')}</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
