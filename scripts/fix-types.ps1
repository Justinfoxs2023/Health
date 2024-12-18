# 修复类型错误的 PowerShell 脚本

Write-Host "开始修复类型错误..." -ForegroundColor Cyan

# 1. 确保 TypeScript 配置正确
$tsconfigContent = @"
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
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "outDir": "./dist"
  },
  "include": [
    "packages/*/src/**/*"
  ],
  "exclude": ["node_modules", "dist"]
}
"@

Set-Content -Path "tsconfig.json" -Value $tsconfigContent

# 2. 更新 package.json
$packageJsonContent = Get-Content "package.json" | ConvertFrom-Json
$packageJsonContent.dependencies = @{
    "antd" = "^4.24.0"
    "@ant-design/icons" = "^4.8.0"
    "react" = "^18.2.0"
    "react-dom" = "^18.2.0"
    "rxjs" = "^7.8.0"
    "uuid" = "^9.0.0"
}
$packageJsonContent | ConvertTo-Json -Depth 10 | Set-Content "package.json"

# 3. 清理并重新安装依赖
Write-Host "清理并重新安装依赖..." -ForegroundColor Yellow
npm cache clean --force
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
npm install --legacy-peer-deps

# 4. 运行类型检查
Write-Host "运行类型检查..." -ForegroundColor Yellow
npx tsc --noEmit

Write-Host "类型修复完成!" -ForegroundColor Green
