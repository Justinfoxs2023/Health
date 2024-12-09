const fs = require('fs');
const path = require('path');

class TemplateGenerator {
  static async generateServiceDoc(servicePath, serviceName) {
    const template = `# ${serviceName} 服务文档

## 1. 服务概述
- 服务名称：${serviceName}
- 服务职责：
- API版本：

## 2. API接口
### 2.1 接口列表
| 接口名称 | 请求方法 | 接口路径 | 描述 |
|---------|---------|----------|------|

### 2.2 详细说明

## 3. 数据模型
\`\`\`typescript
// 在此处添加数据模型定义
\`\`\`

## 4. 依赖服务
- 依赖服务1
- 依赖服务2

## 5. 部署信息
### 5.1 环境要求
### 5.2 配置说明
### 5.3 部署步骤

## 6. 变更记录
| 版本 | 日期 | 变更说明 | 作者 |
|------|------|----------|------|
| 1.0.0 | ${new Date().toISOString().split('T')[0]} | 初始版本 | |
`;

    const docPath = path.join(servicePath, 'README.md');
    await fs.promises.writeFile(docPath, template);
  }
} 