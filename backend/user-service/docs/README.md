# 用户服务(User Service)开发文档

## 1. 服务概述

### 1.1 服务职责
- 用户账号管理
- 认证授权
- 用户画像管理
- 多平台授权登录

### 1.2 核心功能
- 用户注册/登录
- OAuth2.0集成
- 用户信息管理
- 权限控制
- 用户画像分析

### 1.3 技术栈
- Node.js + Express
- MongoDB
- Redis
- JWT认证
- OAuth2.0

## 2. API接口规范

### 2.1 认证相关
| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|------|------|---------|
| /api/auth/register | POST | 用户注册 | 无 |
| /api/auth/login | POST | 用户登录 | 无 |
| /api/auth/oauth/{platform} | GET | OAuth授权 | 无 |
| /api/auth/refresh | POST | 刷新Token | 需Token |

### 2.2 用户信息
| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|------|------|---------|
| /api/users/profile | GET | 获取用户信息 | 需Token |
| /api/users/profile | PUT | 更新用户信息 | 需Token |
| /api/users/avatar | POST | 更新头像 | 需Token |
| /api/users/password | PUT | 修改密码 | 需Token |

## 3. 数据模型

### 3.1 用户模型(User)
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  status: 'active' | 'inactive' | 'locked';
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  name?: string;
  gender?: string;
  birthDate?: Date;
  avatar?: string;
  height?: number;
  weight?: number;
  healthTags?: string[];
}
```

## 4. 开发规范

### 4.1 代码规范
- 使用TypeScript
- 遵循ESLint规则
- 使用Prettier格式化
- 遵循SOLID原则

### 4.2 错误处理
- 统一错误响应格式
- 错误日志记录
- 请求参数验证
- 异常状态处理

### 4.3 安全规范
- 密码加密存储
- Token验证
- 请求频率限制
- 敏感数据脱敏

## 5. 部署信息

### 5.1 环境要求
- Node.js >= 14
- MongoDB >= 4.4
- Redis >= 6.0

### 5.2 配置说明
- 环境变量配置
- 服务端口配置
- 数据库连接配置
- 缓存配置

### 5.3 监控指标
- API响应时间
- 错误率统计
- 用户活跃度
- 系统资源使用 