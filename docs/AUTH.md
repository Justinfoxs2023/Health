# 认证系统文档

## 1. 认证流程

### 1.1 密码登录
1. 用户输入邮箱和密码
2. 服务器验证凭据
3. 生成访问令牌和刷新令牌
4. 返回令牌和用户信息

### 1.2 OAuth登录
1. 用户选择第三方平台
2. 重定向到授权页面
3. 获取授权码
4. 服务器验证并创建/更新用户
5. 返回令牌和用户信息

### 1.3 Token刷新
1. 访问令牌过期
2. 使用刷新令牌获取新令牌
3. 更新本地存储

## 2. 安全措施

### 2.1 密码安全
- 使用bcrypt加密存储
- 密码强度要求
- 登录失败限制

### 2.2 Token安全
- JWT签名验证
- 令牌过期机制
- 刷新令牌轮换

### 2.3 OAuth安全
- 状态参数验证
- 回调URL白名单
- 授权码一次性使用

## 3. 错误处理

### 3.1 常见错误
- 无效凭据
- 令牌过期
- 刷新令牌无效
- OAuth授权失败

### 3.2 错误响应格式
```json
{
  "code": 401,
  "message": "具体错误信息"
}
```

## 4. API接口

### 4.1 登录接口
POST /api/auth/login
```json
{
  "email": "string",
  "password": "string"
}
```

### 4.2 OAuth接口
POST /api/auth/oauth
```json
{
  "platform": "string",
  "code": "string"
}
```

### 4.3 刷新Token接口
POST /api/auth/refresh
```json
{
  "userId": "string",
  "refreshToken": "string"
}
``` 