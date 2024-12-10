// MongoDB Schema 更新
const SchemaUpdates = {
  // 社区数据集合
  community: {
    posts: {
      userId: ObjectId,
      type: String,
      content: Mixed,
      interactions: {
        likes: Number,
        comments: Array,
        shares: Number
      },
      createdAt: Date
    }
  },
  
  // 设备数据集合
  devices: {
    configurations: {
      userId: ObjectId,
      deviceId: String,
      type: String,
      settings: Mixed,
      lastSync: Date
    },
    healthData: {
      deviceId: String,
      userId: ObjectId,
      metrics: Mixed,
      timestamp: Date
    }
  },
  
  // 紧急救助集合
  emergency: {
    contacts: {
      userId: ObjectId,
      contacts: Array,
      lastUpdated: Date
    },
    events: {
      userId: ObjectId,
      type: String,
      location: {
        coordinates: [Number],
        address: String
      },
      status: String,
      timestamp: Date
    }
  }
}; 