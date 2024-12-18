/**
 * @fileoverview TSX 文件 EmergencyButton.tsx 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 紧急求助按钮组件
export const EmergencyButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleEmergency = async () => {
    setLoading(true);
    try {
      await triggerEmergency({
        type: 'medical',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      // 触发成功后的处理
      Alert.alert('紧急求助已发送', '正在通知您的紧急联系人...');
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency} disabled={loading}>
      <Text style={styles.buttonText}>紧急求助</Text>
      {loading && <ActivityIndicator />}
    </TouchableOpacity>
  );
};
