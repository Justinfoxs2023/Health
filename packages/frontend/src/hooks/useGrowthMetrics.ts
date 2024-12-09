import { useState, useEffect } from 'react';
import { GrowthMetrics } from '@/types/growth.types';
import { message } from 'antd';

export function useGrowthMetrics() {
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return { metrics, loading, refetch: fetchMetrics };
} 