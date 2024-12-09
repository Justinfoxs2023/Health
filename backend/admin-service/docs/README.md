# 后台管理服务 (Admin Service)

## 1. 服务概述

### 1.1 功能职责
- 用户管理
- 角色权限管理
- 系统配置管理
- 数据统计分析
- 日志审计
- 内容管理

### 1.2 核心功能
- 用户CRUD操作
- 角色权限分配
- 系统参数配置
- 数据报表生成
- 操作日志记录
- 内容审核发布

### 1.3 技术栈
- Node.js + Express
- MongoDB
- Redis
- JWT认证
- RabbitMQ

## 2. API接口规范

### 2.1 用户管理
| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|------|------|---------|
| /api/admin/users | GET | 获取用户列表 | ADMIN |
| /api/admin/users/:id | GET | 获取用户详情 | ADMIN |
| /api/admin/users | POST | 创建用户 | ADMIN |
| /api/admin/users/:id | PUT | 更新用户 | ADMIN |
| /api/admin/users/:id | DELETE | 删除用户 | ADMIN |

### 2.2 角色管理
| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|------|------|---------|
| /api/admin/roles | GET | 获取角色列表 | ADMIN |
| /api/admin/roles/:id/permissions | PUT | 更新角色权限 | ADMIN |

### 2.3 系统配置
| 接口路径 | 方法 | 描述 | 权限要求 |
|---------|------|------|---------|
| /api/admin/config | GET | 获取系统配置 | ADMIN |
| /api/admin/config | PUT | 更新系统配置 | ADMIN |

## 3. 数据模型

### 3.1 系统配置模型
```typescript
interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description: string;
  updatedAt: Date;
  updatedBy: string;
}
```

### 3.2 操作日志模型
```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: any;
  ip: string;
  userAgent: string;
  createdAt: Date;
}
```

## 4. 权限控制

### 4.1 权限级别
- 超级管理员 (SUPER_ADMIN)
- 系统管理员 (ADMIN)
- 内容管理员 (CONTENT_ADMIN)
- 数据分析员 (DATA_ANALYST)

### 4.2 资源权限
- 用户管理权限
- 角色管理权限
- 系统配置权限
- 数据分析权限
- 日志查看权限