#!/bin/bash

# 设置错误时退出
set -e

echo "开始项目重构..."

# 1. 创建新的目录结构
echo "创建新的目录结构..."
mkdir -p packages/{backend,frontend,mobile,admin,shared}/{src,tests,docs}

# 2. 移动和合并重复目录
echo "处理重复目录..."

# 处理middleware
if [ -d "src/middleware" ] && [ -d "src/middlewares" ]; then
    echo "合并middleware目录..."
    cp -r src/middleware/* src/middlewares/
    rm -rf src/middleware
fi

# 处理mobile
if [ -d "src/mobile" ] && [ -d "mobile" ]; then
    echo "整合mobile目录..."
    cp -r src/mobile/* packages/mobile/src/
    cp -r mobile/* packages/mobile/src/
    rm -rf src/mobile mobile
fi

# 处理scripts
if [ -d "src/scripts" ] && [ -d "scripts" ]; then
    echo "整合scripts目录..."
    cp -r src/scripts/* scripts/
    rm -rf src/scripts
fi

# 3. 移动前端相关代码
echo "整理前端代码..."
mv src/components packages/frontend/src/
mv src/pages packages/frontend/src/
mv src/hooks packages/frontend/src/
mv src/store packages/frontend/src/
mv src/styles packages/frontend/src/

# 4. 移动后端���关代码
echo "整理后端代码..."
mv src/controllers packages/backend/src/
mv src/services packages/backend/src/
mv src/models packages/backend/src/
mv src/entities packages/backend/src/
mv src/middlewares packages/backend/src/

# 5. 移动共享代码
echo "整理共享代码..."
mv src/types packages/shared/src/
mv src/utils packages/shared/src/
mv src/constants packages/shared/src/
mv src/interfaces packages/shared/src/

# 6. 移动配置文件
echo "整理配置文件..."
mkdir -p config
mv src/config/* config/
rm -rf src/config

# 7. 更新package.json
echo "更新package.json..."
cat > package.json << EOL
{
  "name": "health-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "lerna run build",
    "test": "lerna run test",
    "lint": "lerna run lint",
    "start": "lerna run start",
    "dev": "lerna run dev"
  },
  "devDependencies": {
    "lerna": "^4.0.0"
  }
}
EOL

# 8. 创建lerna.json
echo "创建lerna配置..."
cat > lerna.json << EOL
{
  "packages": [
    "packages/*"
  ],
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true
}
EOL

# 9. 更新tsconfig.json
echo "更新TypeScript配置..."
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@health/shared/*": ["packages/shared/src/*"],
      "@health/backend/*": ["packages/backend/src/*"],
      "@health/frontend/*": ["packages/frontend/src/*"],
      "@health/mobile/*": ["packages/mobile/src/*"],
      "@health/admin/*": ["packages/admin/src/*"]
    },
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOL

# 10. 创建各个包的package.json
echo "创建子包配置..."

# Frontend package.json
cat > packages/frontend/package.json << EOL
{
  "name": "@health/frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "@health/shared": "1.0.0"
  }
}
EOL

# Backend package.json
cat > packages/backend/package.json << EOL
{
  "name": "@health/backend",
  "version": "1.0.0",
  "dependencies": {
    "@nestjs/common": "^8.0.0",
    "@nestjs/core": "^8.0.0",
    "@health/shared": "1.0.0"
  }
}
EOL

# Shared package.json
cat > packages/shared/package.json << EOL
{
  "name": "@health/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
EOL

# Mobile package.json
cat > packages/mobile/package.json << EOL
{
  "name": "@health/mobile",
  "version": "1.0.0",
  "dependencies": {
    "react-native": "^0.67.0",
    "@health/shared": "1.0.0"
  }
}
EOL

# Admin package.json
cat > packages/admin/package.json << EOL
{
  "name": "@health/admin",
  "version": "1.0.0",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "@health/shared": "1.0.0"
  }
}
EOL

echo "目录重构完成！"
echo "请运行 'npm install' 安装依赖" 