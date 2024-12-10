export const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<DeviceConfig[]>([]);
  const [scanning, setScanning] = useState(false);

  // 扫描设备
  const startScan = async () => {
    setScanning(true);
    try {
      const bleManager = new BleManager();
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error);
          return;
        }
        if (device) {
          setDevices(prev => [...prev, {
            id: device.id,
            name: device.name || 'Unknown Device',
            type: 'BLE'
          }]);
        }
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View>
      <Button 
        title={scanning ? "停止扫描" : "扫描设备"} 
        onPress={scanning ? stopScan : startScan}
      />
      <DeviceList devices={devices} onConnect={handleConnect} />
    </View>
  );
}; 