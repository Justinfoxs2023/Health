module.exports = {
  // 网关配置
  gateway: {
    port: process.env.GATEWAY_PORT || 3000,
    
    // 服务注册配置
    serviceRegistry: {
      type: 'consul',
      host: process.env.CONSUL_HOST || 'localhost',
      port: process.env.CONSUL_PORT || 8500
    },

    // 路由配置
    routes: {
      user: {
        prefix: '/api/user',
        target: 'http://user-service:4001'
      },
      health: {
        prefix: '/api/health',
        target: 'http://health-data-service:4002'
      },
      ai: {
        prefix: '/api/ai',
        target: 'http://ai-service:4003'
      }
    },

    // 中间件配置
    middleware: {
      cors: true,
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15分钟
        max: 100 // 限制100次请求
      },
      authentication: true
    }
  }
} 