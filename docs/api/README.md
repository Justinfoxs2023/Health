# API接口文档

## 1. RESTful API

### 1.1 健康数据接口
```typescript
// 健康数据上传
POST /api/v1/health/data
Request {
  userId: string;
  dataType: 'heartRate' | 'bloodPressure' | 'bloodOxygen';
  value: number | object;
  timestamp: string;
  deviceId?: string;
}

Response {
  code: 200;
  message: 'success';
  data: {
    id: string;
    status: 'processed' | 'pending';
    analysisResult?: object;
  }
}
```

### 1.2 AI服务接口
```typescript
// 图像识别服务
POST /api/v1/ai/image-recognition
Request {
  image: File;
  type: 'food' | 'exercise' | 'body';
  options?: {
    enhancement: boolean;
    details: boolean;
  }
}

Response {
  code: 200;
  message: 'success';
  data: {
    recognition: {
      category: string;
      confidence: number;
      details: object;
    }
  }
}
```

## 2. 接口规范
### 2.1 请求格式
- 基础URL: `https://api.health-platform.com/v1`
- 请求方法: GET, POST, PUT, DELETE
- 内容类型: application/json

### 2.2 认证方式
所有API请求需要在header中携带token:
```
Authorization: Bearer <token>
```

### 2.3 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 2.4 错误码说明
- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器错误

## 3. 接口目录
- [认证接口](./auth.md)
- [用户接口](./user.md)
- [健康数据接口](./health.md)

## 4. 接口变更日志
### v1.0.0 (2024-01-26)
- 新增用户认证接口
- 新增健康数据接口
- 新增用户信息接口 