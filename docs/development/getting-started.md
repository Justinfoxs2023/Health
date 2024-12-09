# 开发环境搭建指南

## 1. 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0
- React Native CLI
- Android Studio / Xcode
- MongoDB >= 4.4
- Redis >= 6.0

## 2. 开发环境搭建

### 2.1 基础环境安装
```bash
# 安装 Node.js
brew install node

# 安装 React Native CLI
npm install -g react-native-cli

# 安装 MongoDB
brew install mongodb-community

# 安装 Redis
brew install redis
```

### 2.2 项目设置
```bash
# 克隆项目
git clone https://github.com/your-org/health-platform.git
cd health-platform

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
```

### 2.3 启动开发服务
```bash
# 启动 MongoDB
mongod --config /usr/local/etc/mongod.conf

# 启动 Redis
redis-server /usr/local/etc/redis.conf

# 启动前端开发服务
npm run start

# 运行 Android
npm run android

# 运行 iOS
npm run ios
```

## 3. 开发工具配置

### 3.1 VSCode 推荐配置
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 3.2 推荐的 VSCode 插件
- ESLint
- Prettier
- React Native Tools
- TypeScript Vue Plugin
- GitLens

## 4. 开发规范
请参考[代码规范](./code-style.md)和[工作流程](./workflow.md)文档。 