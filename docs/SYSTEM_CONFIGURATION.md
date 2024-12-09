# 系统配置文档

## 1. 配置管理

### 1.1 配置项
- 系统设置
- 服务配置
- 特性开关
- 环境变量

### 1.2 配置层级
1. 默认配置
2. 环境配置
3. 运行时配置
4. 用户配置

## 2. 系统初始化

### 2.1 初始化流程
1. 系统状态检查
2. 配置初始化
3. 缓存初始化
4. 服务连接初始化
5. 数据加载

### 2.2 健康检查
- 数据库连接检查
- Redis连接检查
- 服务状态检查
- 系统资源检查

## 3. 配置项说明

### 3.1 安全配置
```json
{
  "security": {
    "passwordPolicy": {
      "minLength": 8,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "requireUppercase": true,
      "maxLoginAttempts": 5
    },
    "sessionTimeout": 3600,
    "tokenExpiry": {
      "access": 3600,
      "refresh": 604800
    }
  }
}
```

### 3.2 通知配置
```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "provider": "smtp",
      "from": "noreply@health-app.com"
    },
    "push": {
      "enabled": true,
      "provider": "firebase"
    },
    "sms": {
      "enabled": false,
      "provider": "aliyun"
    }
  }
}
```

### 3.3 存储配置
```json
{
  "storage": {
    "provider": "s3",
    "maxFileSize": 10485760,
    "allowedTypes": ["image/jpeg", "image/png", "image/gif"]
  }
}
```

### 3.4 AI配置
```json
{
  "ai": {
    "imageRecognition": {
      "enabled": true,
      "minConfidence": 0.8
    },
    "healthAssessment": {
      "enabled": true,
      "updateFrequency": "daily"
    }
  }
}
```

## 4. 特性开关

### 4.1 配置方式
```json
{
  "features": {
    "socialLogin": {
      "google": true,
      "apple": true,
      "wechat": true
    },
    "healthTracking": {
      "steps": true,
      "heartRate": true,
      "sleep": true,
      "nutrition": true
    }
  }
}
```

### 4.2 使用方法
```typescript
// 检查特性是否启用
const isEnabled = await configManager.isFeatureEnabled('socialLogin.google');
```