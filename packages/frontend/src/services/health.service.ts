import { api } from '../utils';

export interface IHealthTrend {
  /** date 的描述 */
  date: string;
  /** bmi 的描述 */
  bmi: number;
  /** healthScore 的描述 */
  healthScore: number;
  /** exerciseScore 的描述 */
  exerciseScore: number;
}

export interface IHealthMetric {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** value 的描述 */
  value: number;
  /** unit 的描述 */
  unit: string;
  /** date 的描述 */
  date: string;
}

// 获取健康趋势数据
export const getHealthTrends = async (): Promise<IHealthTrend[]> => {
  try {
    const response = await api.get('/api/health/trends');
    return response.data.data;
  } catch (error) {
    console.error('Error in health.service.ts:', '获取健康趋势数据失败:', error);
    throw error;
  }
};

// 获取历史数据
export const getHistoricalData = async (dates: string[]): Promise<IHealthMetric[]> => {
  try {
    const response = await api.get('/api/health/history', {
      params: { dates },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error in health.service.ts:', '获取历史数据失败:', error);
    throw error;
  }
};
