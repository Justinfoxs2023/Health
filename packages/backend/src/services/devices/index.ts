// 设备服务层实现
class DeviceService {
  constructor(
    private readonly protobuf: ProtocolBuffers,
    private readonly websocket: WebSocket
  ) {}

  // 设备数据同步
  async syncDeviceData(device: Device, data: Buffer) {
    // 使用Protocol Buffers解析数据
    const decodedData = this.protobuf.decode('HealthMetrics', data);
    
    // 通过WebSocket推送实时数据
    this.websocket.broadcast('device_data', {
      deviceId: device.id,
      data: decodedData
    });

    // 存储到MongoDB
    await this.mongoDb.collection('health_data').insertOne({
      ...decodedData,
      timestamp: new Date()
    });
  }
} 