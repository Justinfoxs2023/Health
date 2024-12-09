# 类型定义文档

## 基础类型

### Logger
```typescript
interface Logger {
  error(message: string, error?: any): void;
  warn(message: string, data?: any): void;
  info(message: string, data?: any): void;
  debug(message: string, data?: any): void;
}
```

### Metrics
```typescript
interface Metrics {
  recordMetric(name: string, value: number): void;
  getMetric(name: string): number;
  incrementMetric(name: string): void;
  setMetric(name: string, value: number): void;
}
```

## 业务类型

### 运动相关
```typescript
interface ExercisePlan {
  id: string;
  userId: string;
  goals: ExerciseGoal[];
  milestones: Milestone[];
  schedule: Schedule[];
  // ...
}

interface WorkoutSession {
  id: string;
  userId: string;
  planId: string;
  type: string;
  // ...
}
```

### 营养相关
```typescript
interface NutritionPlan {
  id: string;
  userId: string;
  requirements: NutritionRequirements;
  meals: MealPlan[];
  // ...
}

interface MealRecord {
  id: string;
  userId: string;
  planId: string;
  items: FoodItem[];
  // ...
}
```

### 支付相关
```typescript
enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  CREDITCARD = 'creditcard',
  BANK = 'bank'
}

interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  // ...
}
``` 