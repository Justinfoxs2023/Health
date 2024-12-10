import React from 'react';
import { IHealthData, HealthDataType } from '../../types';
import { formatDate, formatHealthData } from '../../utils';

export interface HealthDataCardProps {
  /** 健康数据 */
  data: IHealthData;
  /** 点击事件 */
  onClick?: (data: IHealthData) => void;
  /** 自定义类名 */
  className?: string;
}

/** 健康数据展示卡片 */
export const HealthDataCard: React.FC<HealthDataCardProps> = ({
  data,
  onClick,
  className = ''
}) => {
  const getIcon = (type: HealthDataType) => {
    switch (type) {
      case HealthDataType.BLOOD_PRESSURE:
        return '🫀';
      case HealthDataType.HEART_RATE:
        return '💓';
      case HealthDataType.BLOOD_SUGAR:
        return '🩸';
      case HealthDataType.BODY_TEMPERATURE:
        return '🌡️';
      case HealthDataType.WEIGHT:
        return '⚖️';
      case HealthDataType.HEIGHT:
        return '📏';
      case HealthDataType.STEPS:
        return '👣';
      default:
        return '📊';
    }
  };

  const getStatusColor = (type: HealthDataType, value: number): string => {
    // 这里可以根据不同类型的健康数据设置不同的阈值
    // 目前使用简单的判断逻辑
    if (value > 100) return 'text-red-500';
    if (value < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={() => onClick?.(data)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getIcon(data.type)}</span>
          <h3 className="text-lg font-medium text-gray-800">
            {data.type.replace(/_/g, ' ')}
          </h3>
        </div>
        <span className={`text-lg font-bold ${getStatusColor(data.type, data.value)}`}>
          {formatHealthData(data)}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatDate(data.timestamp)}</span>
        {data.note && (
          <span className="truncate ml-2" title={data.note}>
            {data.note}
          </span>
        )}
      </div>
    </div>
  );
}; 