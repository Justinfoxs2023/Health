import { useState, useEffect } from 'react';

import { message } from 'antd';

import { GrowthMetrics } from '@/types/growth.types';

export function useGrowthMetrics(): {
  metrics: any;
  loading: boolean;
  refetch: () => Promise<void>;
} {
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const response = await fetch('/api/growth/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      message.error('获取成长数据失败');
      console.error('Error in useGrowthMetrics.ts:', error);
    } finally {
      setLoading(false);
    }
  }

  return { metrics, loading, refetch: fetchMetrics };
}
