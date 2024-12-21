# AI服务集群文档

## 1. 服务架构

### 1.1 服务组件
- 图像识别服务 (port: 5001)
- 健康评估服务 (port: 5002)
- 推荐系统服务 (port: 5003)
- Redis缓存服务 (port: 6379)
- MongoDB数据库 (port: 27017)

### 1.2 网络配置
所有服务运行在 `health-ai-network` 网络下，通过Docker Compose管理。

## 2. 部署说明

### 2.1 环境要求
- Docker >= 20.10
- NVIDIA Docker Runtime (用于GPU支持)
- 至少4GB RAM
- 支持CUDA的GPU (推荐)

### 2.2 部署步骤
```bash
# 1. 构建服务
docker-compose -f docker-compose.ai.yml build

# 2. 启动服务
docker-compose -f docker-compose.ai.yml up -d

# 3. 检查服务状态
docker-compose -f docker-compose.ai.yml ps
```

## 3. API文档

### 3.1 图像识别服务
POST /api/v1/analyze/food
```json
{
  "image": "base64_encoded_image",
  "options": {
    "detailed": true,
    "nutrition": true
  }
}
```

### 3.2 健康评估服务
POST /api/v1/assess/health
```json
{
  "userId": "user_id",
  "data": {
    "vital_signs": {},
    "exercise": {},
    "diet": {}
  }
}
```

### 3.3 推荐系统服务
GET /api/v1/recommend/{type}
```json
{
  "userId": "user_id",
  "context": {
    "time": "2024-01-26T10:00:00Z",
    "location": "home"
  }
}
```

## 4. 监控与维护

### 4.1 日志位置
- 服务日志: `/app/logs/service.log`
- Docker日志: `docker-compose -f docker-compose.ai.yml logs`

### 4.2 监控指标
- 请求计数
- 响应时间
- 错误率
- GPU利用率

### 4.3 常见问题处理
1. 服务无响应
   ```bash
   docker-compose -f docker-compose.ai.yml restart <service_name>
   ```

2. GPU内存不足
   ```bash
   # 调整GPU内存占用
   vim config/service-config.yml
   # 修改 gpu.memory_fraction 值
   ``` 