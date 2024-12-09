# 健康管理系统

## 项目概述
智能健康管理平台，通过AI技术提供个性化健康服务，实现用户健康数据的全生命周期管理。

## 技术栈
- 前端：React Native + Redux + TypeScript
- 后端：Node.js + Express + TypeScript
- 数据库：MongoDB + Redis + Elasticsearch
- AI：TensorFlow + PyTorch + OpenCV
- DevOps：Docker + Kubernetes

## 开发环境搭建

### 1. 环境要求
- Node.js >= 14.0.0
- MongoDB >= 4.4
- Redis >= 6.0
- Python >= 3.8 (AI服务)
- Docker >= 20.10
- Kubernetes >= 1.20

### 2. 安装依赖
```bash
# 安装项目依赖
npm install

# 安装AI服务依赖
cd ai-services
pip install -r requirements.txt
```

### 3. 环境配置
```bash
# 复制环境配置文件
cp .env.example .env

# 修改配置文件
vim .env
```

### 4. 启动开发服务
```bash
# 启动后端服务
npm run dev:server

# 启动前端开发服务
npm run dev:client

# 启动AI服务
npm run dev:ai
```

## 开发调试指南

### 1. 调试环境配置
```bash
# 1. 设置环境变量
export NODE_ENV=development
export DEBUG=true
export API_MOCK=true

# 2. 安装调试���具
npm install --save-dev @nestjs/cli @types/node

# 3. 启动调试模式
npm run start:debug
```

### 2. 使用调试服务
```typescript
import { DebugService } from '../services/debug.service';

@Injectable()
export class YourService {
  constructor(private readonly debugService: DebugService) {}

  async someMethod() {
    // 开始性能监控
    this.debugService.startPerfMonitor('someMethod');

    try {
      // 你的业务逻辑
      await this.doSomething();
    } catch (error) {
      // 错误追踪
      this.debugService.trackError(error);
    } finally {
      // 结束性能监控
      this.debugService.endPerfMonitor('someMethod');
    }
  }
}
```

### 3. 日志系统
```typescript
// 使用调试服务记录日志
debugService.log(LogLevel.INFO, '操作信息', { userId: '123' });
debugService.log(LogLevel.ERROR, '错误信息', { error });
debugService.log(LogLevel.DEBUG, '调试信息', { data });
```

### 4. 性能监控
```typescript
// 监控函数执行时间
debugService.startPerfMonitor('operationName');
// ... 执行操作 ...
const duration = debugService.endPerfMonitor('operationName');

// 检查性能警告
debugService.checkPerformanceWarnings();
```

### 5. 错误追踪
```typescript
try {
  // 可能出错的代码
} catch (error) {
  debugService.trackError(error, {
    component: 'UserService',
    method: 'createUser',
    userId: user.id
  });
}
```

### 6. 调试会话管理
```typescript
// 启动调试会话
debugService.startDebugSession();

// 结束调试会话
debugService.endDebugSession();
```

### 7. 开发工具使用

#### Chrome DevTools
1. 启动应用时添加调试参数：
```bash
node --inspect src/main.ts
```

2. 在Chrome中打开：
```
chrome://inspect
```

3. 点击"Open dedicated DevTools for Node"

#### VS Code 调试
1. 创建 launch.json 配置：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "sourceMaps": true,
      "envFile": "${workspaceFolder}/.env",
      "cwd": "${workspaceRoot}",
      "console": "integratedTerminal"
    }
  ]
}
```

2. 设置断点并启动调试

### 8. 性能分析

#### 内存分析
```typescript
// 生成内存快照
await debugService.takeMemorySnapshot();

// 生成火焰图
await debugService.generateFlamegraph();
```

#### 性能监控
```typescript
// 检查调试工具状态
const status = debugService.checkDebugToolsStatus();
console.log('Debug tools status:', status);
```

### 9. API调试

#### 模拟API
1. 在 `src/mocks` 目录下创建模拟数据
2. 设置环境变量：`API_MOCK=true`
3. 配置模拟延迟：`API_MOCK_DELAY=1000`

#### API测试
使用Postman或Swagger进行API测试：
- Swagger UI: http://localhost:3000/api
- API文档: http://localhost:3000/api-docs

### 10. 调试最佳实践

1. **日志记录**
   - 使用适当的日志级别
   - 包含上下文信息
   - 避免敏感信息

2. **性能监控**
   - 监控关键操作
   - 设置合理的警告阈值
   - 定期检查性能指标

3. **错误处理**
   - 捕获所有可能的错误
   - 提供详细的错误上下文
   - 实现优雅的降级策略

4. **内存管理**
   - 定期检查内存使用
   - 及时清理未使用的资源
   - 避免内存泄漏

5. **调试工具使用**
   - 合理使用断点
   - 利用条件断点
   - 使用日志点代替console.log

## 部署指南

### 1. 构建
```bash
# 构建前端
npm run build:client

# 构建后端
npm run build:server

# 构建AI服务
npm run build:ai
```

### 2. Docker部署
```bash
# 构建Docker镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 3. Kubernetes部署
```bash
# 部署到Kubernetes
kubectl apply -f k8s/

# 查看服务状态
kubectl get pods
```

## ��码规范

### 1. TypeScript规范
- 使用严格模式
- 必须定义类型
- 使用接口定义数据结构
- 避免使用any

### 2. React规范
- 使用函数组件和Hooks
- 合理拆分组件
- 使用PropTypes或TypeScript类型
- 遵循React最佳实践

### 3. 测试规范
- 单元测试覆盖率 > 80%
- 集成测试覆盖关键流程
- E2E测试覆盖主要功能
- 定期运行性能测试

## 常见问题

### 1. 开发环境问题
Q: 启动失败怎么办？
A: 检查环境配置和依赖安装

Q: 调试工具不显示？
A: 确认开发模式是否启用

### 2. 性能问题
Q: 应用响应慢？
A: 使用性能监控工具分析

Q: 内存占用高？
A: 检查内存泄漏和资源释放

## 更新日志

### v2.0.0 (2023-12-08)
- 添加开发调试功能
- 优化性能监控
- 完善错误追踪
- 增强安全性

### v1.0.0 (2023-11-01)
- 首次发布
- 基础功能实现
- AI服务集成
- 数据同步

## 环境配置管理

### 配置文件结构

项目使用以下配置文件管理不同环境的配置：

- `.env` - 基础配置文件，包含所有环境共享的配置
- `.env.development` - 开发环境特定配置
- `.env.production` - 生产环境特定配置
- `.env.test` - 测试环境特定配置
- `.env.local` - 本地开发配置（不提交到版本控制）

### 配置项说明

1. 应用基础配置
```env
APP_NAME=健康管理平台
APP_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000
SERVICE_NAME=health-platform
SERVICE_VERSION=1.0.0
```

2. 数据库配置
```env
DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_NAME=health_db
DB_USER=admin
DB_PASS=<your-password>
DB_AUTH_SOURCE=admin
DB_SSL=false
```

3. Redis配置
```env
REDIS_CLUSTER_ENABLED=false
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<your-password>
REDIS_KEY_PREFIX=health:
```

4. JWT配置
```env
JWT_SECRET=<your-jwt-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

5. 存储配置
```env
STORAGE_DRIVER=local
FILE_MAX_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
```

6. 监控配置
```env
MONITOR_ENABLED=true
MONITOR_SAMPLE_RATE=100
METRICS_ENABLED=true
METRICS_PREFIX=health_
LOG_LEVEL=info
LOG_CHANNEL=console
```

7. 安全配置
```env
SECURITY_KEY=<your-security-key>
API_RATE_LIMIT=100
API_RATE_WINDOW=900
DDOS_PROTECTION_ENABLED=true
XSS_PROTECTION_ENABLED=true
```

### 配置验证

项目在启动时会自动验证配置的完整性和有效性，包括：

- 必需配置项检查
- 数值范围验证
- URL格式验证
- 枚举值验证
- 安全密钥长度验证

### 配置检查命令

使用以下命令检查不同环境的配置：

```bash
# 检查当前环境配置
npm run check:env

# 检查生产环境配置
npm run check:env:prod

# 检查开发环境配置
npm run check:env:dev

# 检查测试环境配置
npm run check:env:test
```

### 配置最佳实践

1. 安全性
   - 不要在代码中硬编码敏感信息
   - 使用环境变量存储敏感配置
   - 定期轮换密钥和密码
   - 使用足够长度和复杂度的密钥

2. 开发流程
   - 从 `.env.example` 复制创建新的环境配置
   - 本地开发使用 `.env.local` 覆盖配置
   - 提交代码前检查配置完整性
   - 定期审查和更新配置文档

3. 部署流程
   - 使用配置检查脚本验证配置
   - 在CI/CD流程中集成配置检查
   - 使用密钥管理服务存储敏感信息
   - 实施配置变更的审计日志

4. 监控和维护
   - 定期检查配置有效性
   - 监控配置使用情况
   - 及时清理废弃配置
   - 保持配置文档的更新

### 配置服务使用示例

```typescript
// 注入配置服务
constructor(private configService: ConfigService) {}

// 获取应用配置
const appConfig = this.configService.getAppConfig();

// 获取数据库配置
const dbConfig = this.configService.getDatabaseConfig();

// 获取Redis配置
const redisConfig = this.configService.getRedisConfig();

// 检查环境
const isProduction = this.configService.isProduction();
```

### 配置更新流程

1. 添加新配置
   - 在 `.env.example` 添加配置项和说明
   - 在 `config.ts` 添加类型定义
   - 在 `ConfigService` 添加获取方法
   - 更新配置文档

2. 修改配置
   - 在所有环境配置文件中更新
   - 运行配置检查确保有效
   - 更新相关文档
   - 通知团队成员

3. 删除配置
   - 确认配置未被使用
   - 从所有环境配置文件中移除
   - 更新类型定义和文档
   - 在下一个版本发布
