# 健康管理系统文档

## 系统架构

### 1. 前端架构
- Mobile App (React Native)
- Web Admin (React)
- Design System (共享组件库)

### 2. 后端架构
- API Services (Express + TypeScript)
- AI Services (Python + FastAPI)
- Data Services (MongoDB + Redis)

### 3. 核心服务

#### 3.1 运动服务 (ExerciseService)
- 运动计划生成
- 运动记录管理
- 运动数据分析
- 计划动态调整

#### 3.2 营养服务 (NutritionService)
- 营养计划制定
- 饮食记录管理
- 营养状况分析
- 饮食建议生成

#### 3.3 支付服务 (PaymentService)
- 支付处理
- 发票管理
- 退款处理
- 交易记录

## 开发规范

### 1. 类型定义
所有类型定义必须放在 `src/types` 目录下：
```typescript
// 示例: src/types/exercise.d.ts
export interface ExercisePlan {
  id: string;
  userId: string;
  goals: ExerciseGoal[];
  // ...
}
```

### 2. 服务实现
所有服务实现必须：
- 继承 BaseService
- 实现错误处理
- 包含完整日志
- 提供类型定义

### 3. 测试要求
- 单元测试覆盖率 > 80%
- 集成测试覆盖主要流程
- E2E测试覆盖关键场景

## 部署架构

### 1. 开发环境
```bash
npm run dev        # 启动所有服务
npm run dev:front  # 仅启动前端
npm run dev:back   # 仅启动后端
npm run dev:ai     # 仅启动AI服务
```

### 2. 生产环境
```bash
npm run build      # 构建所有服务
npm run deploy     # 部署到生产环境
```

## API文档

### 1. 运动相关API
- POST /api/exercise/plan - 创建运动计划
- PUT /api/exercise/session - 记录运动会话
- GET /api/exercise/analysis - 获取运动分析

### 2. 营养相关API
- POST /api/nutrition/plan - 创建营养计划
- PUT /api/nutrition/meal - 记录饮食情况
- GET /api/nutrition/analysis - 获取营养分析

### 3. 支付相关API
- POST /api/payment/process - 处理支付
- POST /api/payment/refund - 处理退款
- GET /api/payment/history - 获取交易历史
