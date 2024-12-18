# 修复依赖的 PowerShell 脚本

Write-Host "开始安装依赖..." -ForegroundColor Cyan

# 1. 安装主要依赖
$dependencies = @(
    "antd@4.24.0",
    "@ant-design/icons@4.8.0",
    "react@18.2.0",
    "react-dom@18.2.0",
    "react-i18next@12.2.0",
    "rxjs@7.8.0",
    "@tensorflow/tfjs@4.10.0",
    "@tensorflow/tfjs-backend-webgl@4.10.0",
    "uuid@9.0.0",
    "mongoose@7.0.0"
)

# 2. 安装开发依赖
$devDependencies = @(
    "@types/react@18.2.0",
    "@types/react-dom@18.2.0",
    "@types/uuid@9.0.0",
    "@types/jest@29.5.0",
    "typescript@4.9.5"
)

# 3. 安装依赖
Write-Host "安装主要依赖..." -ForegroundColor Yellow
foreach ($dep in $dependencies) {
    npm install $dep --save --legacy-peer-deps
}

Write-Host "安装开发依赖..." -ForegroundColor Yellow
foreach ($dep in $devDependencies) {
    npm install $dep --save-dev --legacy-peer-deps
}

# 4. 清理缓存并重新构建
Write-Host "清理缓存并重新构建..." -ForegroundColor Yellow
npm cache clean --force
npm run build

Write-Host "依赖安装完成!" -ForegroundColor Green
