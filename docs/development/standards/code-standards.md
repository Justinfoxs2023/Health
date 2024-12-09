# 编码规范指南

## 1. 代码风格

### 1.1 TypeScript规范
```typescript
// 命名规范
interface NamingConventions {
  // 类名使用 PascalCase
  class: 'UserService';
  
  // 接口名使用 PascalCase
  interface: 'HealthData';
  
  // 方法名使用 camelCase
  method: 'getUserHealth';
  
  // 变量名使用 camelCase
  variable: 'userData';
  
  // 常量使用 UPPER_SNAKE_CASE
  constant: 'MAX_HEART_RATE';
  
  // 枚举使用 PascalCase
  enum: 'HealthMetrics';
}

// 代码组织
interface CodeOrganization {
  fileStructure: {
    models: '/src/models',
    services: '/src/services',
    controllers: '/src/controllers',
    middlewares: '/src/middlewares',
    utils: '/src/utils'
  };
  
  importOrder: [
    'node内置模块',
    '第三方模块',
    '自定义模块',
    '相对路径导入'
  ];
}
```

### 1.2 Python规范
```python
# Python代码风格指南
class PythonStyleGuide:
    """Python代码风格规范类
    
    遵循PEP 8规范，并增加项目特定规则
    """
    
    def __init__(self):
        self.indentation = 4  # 缩进空格数
        self.max_line_length = 88  # 最大行长度
        self.quotes = 'single'  # 字符串引号类型
        
    def naming_conventions(self):
        return {
            'class': 'PascalCase',
            'function': 'snake_case',
            'variable': 'snake_case',
            'constant': 'UPPER_SNAKE_CASE',
            'module': 'snake_case'
        }
```