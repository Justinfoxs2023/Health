# 开发环境配置指南

## 1. 基础环境要求

### 1.1 开发工具
```bash
# 必需工具
- Node.js >= 16.0.0
- Python >= 3.8
- MongoDB >= 4.4
- Redis >= 6.0
- Docker >= 20.10
- Kubernetes >= 1.20

# IDE推荐
- VSCode
  - Extensions:
    - ESLint
    - Prettier
    - Docker
    - Kubernetes
    - Python
    - MongoDB

# 版本控制
- Git >= 2.30
```

### 1.2 环境变量配置
```bash
# 开发环境变量示例(.env.development)
# API配置
API_BASE_URL=http://localhost:3000
API_VERSION=v1
API_TIMEOUT=5000

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/health_dev
REDIS_URI=redis://localhost:6379

# AI服务配置
AI_SERVICE_URL=http://localhost:5000
MODEL_PATH=/path/to/models

# 安全配置
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```
