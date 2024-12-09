import { api } from '../utils';

export interface HealthTrend {
  date: string;
  bmi: number;
  healthScore: number;
  exerciseScore: number;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
}

// 获取健康趋势数据
export const getHealthTrends = async (): Promise<HealthTrend[]> => {
  try {
    const response = await api.get('/api/health/trends');
    return response.data.data;
  } catch (error) {
    console.error('获取健康趋势数据失败:', error);
    throw error;
  }
};

// 获取历史数据
export const getHistoricalData = async (dates: string[]): Promise<HealthMetric[]> => {
  try {
    const response = await api.get('/api/health/history', {
      params: { dates }
    });
    return response.data.data;
  } catch (error) {
    console.error('获取历史数据失败:', error);
    throw error;
  }
}; 