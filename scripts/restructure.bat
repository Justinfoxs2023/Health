@echo off
chcp 65001 > nul
echo [信息] 开始项目重构...

REM 1. 创建目录结构
echo [信息] 创建目录结构...
for %%d in (backend frontend mobile admin shared) do (
    if not exist "packages\%%d\src" (
        mkdir "packages\%%d\src"
        echo [信息] 创建目录: packages\%%d\src
    ) else (
        echo [信息] 目录已存在: packages\%%d\src
    )
    
    if not exist "packages\%%d\tests" (
        mkdir "packages\%%d\tests"
        echo [信息] 创建目录: packages\%%d\tests
    ) else (
        echo [信息] 目录已存在: packages\%%d\tests
    )
    
    if not exist "packages\%%d\docs" (
        mkdir "packages\%%d\docs"
        echo [信息] 创建目录: packages\%%d\docs
    ) else (
        echo [信息] 目录已存在: packages\%%d\docs
    )
)

REM 2. 处理重复目录
echo [信息] 处理重复目录...

REM 处理middleware
if exist "src\middleware" if exist "src\middlewares" (
    echo [信息] 合并middleware目录...
    xcopy /E /I /Y "src\middleware\*" "src\middlewares\" > nul
    rd /S /Q "src\middleware"
)

REM 处理mobile
if exist "src\mobile" if exist "mobile" (
    echo [信息] 整合mobile目录...
    if not exist "packages\mobile\src" mkdir "packages\mobile\src"
    xcopy /E /I /Y "src\mobile\*" "packages\mobile\src\" > nul
    xcopy /E /I /Y "mobile\*" "packages\mobile\src\" > nul
    rd /S /Q "src\mobile" "mobile"
)

REM 处理scripts
if exist "src\scripts" if exist "scripts" (
    echo [信息] 整合scripts目录...
    xcopy /E /I /Y "src\scripts\*" "scripts\" > nul
    rd /S /Q "src\scripts"
)

REM 3. 移动前端相关代码
echo [信息] 整理前端代码...
for %%d in (components pages hooks store styles) do (
    if exist "src\%%d" (
        if not exist "packages\frontend\src\%%d" (
            echo [信息] 移动 src\%%d 到 packages\frontend\src\%%d
            mkdir "packages\frontend\src\%%d"
            xcopy /E /I /Y "src\%%d\*" "packages\frontend\src\%%d\" > nul
            rd /S /Q "src\%%d"
        ) else (
            echo [信息] 目标目录已存在: packages\frontend\src\%%d
        )
    )
)

REM 4. 移动后端相关代码
echo [信息] 整理后端代码...
for %%d in (controllers services models entities middlewares) do (
    if exist "src\%%d" (
        if not exist "packages\backend\src\%%d" (
            echo [信息] 移动 src\%%d 到 packages\backend\src\%%d
            mkdir "packages\backend\src\%%d"
            xcopy /E /I /Y "src\%%d\*" "packages\backend\src\%%d\" > nul
            rd /S /Q "src\%%d"
        ) else (
            echo [信息] 目标目录已存在: packages\backend\src\%%d
        )
    )
)

REM 5. 移动共享代码
echo [信息] 整理共享代码...
for %%d in (types utils constants interfaces) do (
    if exist "src\%%d" (
        if not exist "packages\shared\src\%%d" (
            echo [信息] 移动 src\%%d 到 packages\shared\src\%%d
            mkdir "packages\shared\src\%%d"
            xcopy /E /I /Y "src\%%d\*" "packages\shared\src\%%d\" > nul
            rd /S /Q "src\%%d"
        ) else (
            echo [信息] 目标目录已存在: packages\shared\src\%%d
        )
    )
)

REM 6. 移动配置文件
echo [信息] 整理配置文件...
if exist "src\config" (
    if not exist "config" mkdir "config"
    xcopy /E /I /Y "src\config\*" "config\" > nul
    rd /S /Q "src\config"
)

REM 7. 更新package.json
echo [信息] 更新package.json...
echo {> package.json
echo   "name": "health-platform",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "private": true,>> package.json
echo   "workspaces": [>> package.json
echo     "packages/*">> package.json
echo   ],>> package.json
echo   "scripts": {>> package.json
echo     "build": "npm run build --workspaces",>> package.json
echo     "test": "npm run test --workspaces",>> package.json
echo     "lint": "npm run lint --workspaces",>> package.json
echo     "start": "npm run start --workspaces",>> package.json
echo     "dev": "npm run dev --workspaces">> package.json
echo   },>> package.json
echo   "devDependencies": {>> package.json
echo     "@types/node": "^16.0.0",>> package.json
echo     "typescript": "^4.5.0",>> package.json
echo     "ts-node": "^10.4.0">> package.json
echo   }>> package.json
echo }>> package.json

REM 8. 创建lerna.json
echo [信息] 创建lerna配置...
echo {> lerna.json
echo   "packages": [>> lerna.json
echo     "packages/*">> lerna.json
echo   ],>> lerna.json
echo   "version": "independent",>> lerna.json
echo   "npmClient": "npm",>> lerna.json
echo   "useWorkspaces": true>> lerna.json
echo }>> lerna.json

REM 9. 更新tsconfig.json
echo [信息] 更新TypeScript配置...
echo {> tsconfig.json
echo   "compilerOptions": {>> tsconfig.json
echo     "baseUrl": ".",>> tsconfig.json
echo     "paths": {>> tsconfig.json
echo       "@health/shared/*": ["packages/shared/src/*"],>> tsconfig.json
echo       "@health/backend/*": ["packages/backend/src/*"],>> tsconfig.json
echo       "@health/frontend/*": ["packages/frontend/src/*"],>> tsconfig.json
echo       "@health/mobile/*": ["packages/mobile/src/*"],>> tsconfig.json
echo       "@health/admin/*": ["packages/admin/src/*"]>> tsconfig.json
echo     },>> tsconfig.json
echo     "target": "es2020",>> tsconfig.json
echo     "module": "commonjs",>> tsconfig.json
echo     "strict": true,>> tsconfig.json
echo     "esModuleInterop": true,>> tsconfig.json
echo     "skipLibCheck": true,>> tsconfig.json
echo     "forceConsistentCasingInFileNames": true>> tsconfig.json
echo   }>> tsconfig.json
echo }>> tsconfig.json

REM 10. 创建子包配置
echo [信息] 创建子包配置...

REM Frontend package.json
if not exist "packages\frontend\package.json" (
    echo [信息] 创建 packages\frontend\package.json
    echo {> packages\frontend\package.json
    echo   "name": "@health/frontend",>> packages\frontend\package.json
    echo   "version": "1.0.0",>> packages\frontend\package.json
    echo   "dependencies": {>> packages\frontend\package.json
    echo     "react": "^17.0.2",>> packages\frontend\package.json
    echo     "react-dom": "^17.0.2",>> packages\frontend\package.json
    echo     "@health/shared": "1.0.0">> packages\frontend\package.json
    echo   }>> packages\frontend\package.json
    echo }>> packages\frontend\package.json
)

REM Backend package.json
if not exist "packages\backend\package.json" (
    echo [信息] 创建 packages\backend\package.json
    echo {> packages\backend\package.json
    echo   "name": "@health/backend",>> packages\backend\package.json
    echo   "version": "1.0.0",>> packages\backend\package.json
    echo   "dependencies": {>> packages\backend\package.json
    echo     "@nestjs/common": "^8.0.0",>> packages\backend\package.json
    echo     "@nestjs/core": "^8.0.0",>> packages\backend\package.json
    echo     "@health/shared": "1.0.0">> packages\backend\package.json
    echo   }>> packages\backend\package.json
    echo }>> packages\backend\package.json
)

REM Shared package.json
if not exist "packages\shared\package.json" (
    echo [信息] 创建 packages\shared\package.json
    echo {> packages\shared\package.json
    echo   "name": "@health/shared",>> packages\shared\package.json
    echo   "version": "1.0.0",>> packages\shared\package.json
    echo   "main": "dist/index.js",>> packages\shared\package.json
    echo   "types": "dist/index.d.ts">> packages\shared\package.json
    echo }>> packages\shared\package.json
)

REM Mobile package.json
if not exist "packages\mobile\package.json" (
    echo [信息] 创建 packages\mobile\package.json
    echo {> packages\mobile\package.json
    echo   "name": "@health/mobile",>> packages\mobile\package.json
    echo   "version": "1.0.0",>> packages\mobile\package.json
    echo   "dependencies": {>> packages\mobile\package.json
    echo     "react-native": "^0.67.0",>> packages\mobile\package.json
    echo     "@health/shared": "1.0.0">> packages\mobile\package.json
    echo   }>> packages\mobile\package.json
    echo }>> packages\mobile\package.json
)

REM Admin package.json
if not exist "packages\admin\package.json" (
    echo [信息] 创建 packages\admin\package.json
    echo {> packages\admin\package.json
    echo   "name": "@health/admin",>> packages\admin\package.json
    echo   "version": "1.0.0",>> packages\admin\package.json
    echo   "dependencies": {>> packages\admin\package.json
    echo     "react": "^17.0.2",>> packages\admin\package.json
    echo     "react-dom": "^17.0.2",>> packages\admin\package.json
    echo     "@health/shared": "1.0.0">> packages\admin\package.json
    echo   }>> packages\admin\package.json
    echo }>> packages\admin\package.json
)

echo [信息] 目录重构完成！
echo [信息] 请运行 'npm install' 安装依赖