/**
 * @fileoverview TSX 文件 HealthDataDisplay.tsx 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康数据显示组件
export const HealthDataDisplay: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const websocket = useWebSocket();

  useEffect(() => {
    websocket.on('device_data', (data: HealthData) => {
      setHealthData(data);
      updateHealthMetrics(data);
    });

    return () => {
      websocket.off('device_data');
    };
  }, []);

  return (
    <View style={styles.container}>
      <MetricCard title="心率" value={healthData?.metrics.heartRate} unit="bpm" />
      <MetricCard
        title="血压"
        value={`${healthData?.metrics.bloodPressure?.systolic}/${healthData?.metrics.bloodPressure?.diastolic}`}
        unit="mmHg"
      />
      {/* 其他健康指标... */}
    </View>
  );
};
