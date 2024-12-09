module.exports = {
  redis: {
    cluster: [
      {
        port: 6379,
        host: 'redis-node-1'
      },
      {
        port: 6379,
        host: 'redis-node-2'
      },
      {
        port: 6379,
        host: 'redis-node-3'
      }
    ],
    options: {
      maxRetriesPerRequest: 3,
      retryStrategy: function (times) {
        return Math.min(times * 50, 2000);
      }
    },
    
    // 缓存配置
    caching: {
      // 用户Token缓存
      userToken: {
        ttl: 7 * 24 * 60 * 60, // 7天
        prefix: 'user:token:'
      },
      // 健康数据缓存
      healthData: {
        ttl: 5 * 60, // 5分钟
        prefix: 'health:data:'
      }
    }
  }
}; 