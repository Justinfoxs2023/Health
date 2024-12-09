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