/**
 * @fileoverview TS 文件 useHealthData.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康数据聚合Hook
export const useHealthData = (userId: string) => {
  const [data, setData] = useState<AggregatedHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/integration/health-data/${userId}`);
        setData(response.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, loading, refetch: fetchData };
};
