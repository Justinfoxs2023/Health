// 配置分片
sh.enableSharding("health_management");

// 用户数据分片
sh.shardCollection(
  "health_management.users",
  { "_id": "hashed" }
);

// 健康数据分片 - 按用户ID和时间分片
sh.shardCollection(
  "health_management.health_records",
  { "userId": 1, "timestamp": 1 }
);

// AI分析结果分片
sh.shardCollection(
  "health_management.ai_analysis",
  { "userId": 1, "createdAt": 1 }
);

// 配置分片区域
sh.addShardToZone("shard1", "zone1");
sh.addShardToZone("shard2", "zone2");

// 配置区域范围
sh.updateZoneKeyRange(
  "health_management.health_records",
  {
    "timestamp": MinKey
  },
  {
    "timestamp": ISODate("2024-01-01")
  },
  "zone1"
);

sh.updateZoneKeyRange(
  "health_management.health_records",
  {
    "timestamp": ISODate("2024-01-01")
  },
  {
    "timestamp": MaxKey
  },
  "zone2"
); 