@echo off
echo 开始项目重构...

REM 1. 创建新的目录结构
echo 创建新的目录结构...
mkdir packages\backend\src packages\backend\tests packages\backend\docs
mkdir packages\frontend\src packages\frontend\tests packages\frontend\docs
mkdir packages\mobile\src packages\mobile\tests packages\mobile\docs
mkdir packages\admin\src packages\admin\tests packages\admin\docs
mkdir packages\shared\src packages\shared\tests packages\shared\docs

REM 2. 移动和合并重复目录
echo 处理重复目录...

REM 处理middleware
if exist src\middleware if exist src\middlewares (
    echo 合并middleware目录...
    xcopy /E /I /Y src\middleware\* src\middlewares\
    rmdir /S /Q src\middleware
)

REM 处理mobile
if exist src\mobile if exist mobile (
    echo 整合mobile目录...
    xcopy /E /I /Y src\mobile\* packages\mobile\src\
    xcopy /E /I /Y mobile\* packages\mobile\src\
    rmdir /S /Q src\mobile mobile
)

REM 处理scripts
if exist src\scripts if exist scripts (
    echo 整合scripts目录...
    xcopy /E /I /Y src\scripts\* scripts\
    rmdir /S /Q src\scripts
)

REM 3. 移动前端相关代码
echo 整理前端代码...
if exist src\components move src\components packages\frontend\src\
if exist src\pages move src\pages packages\frontend\src\
if exist src\hooks move src\hooks packages\frontend\src\
if exist src\store move src\store packages\frontend\src\
if exist src\styles move src\styles packages\frontend\src\

REM 4. 移动后端相关代码
echo 整理后端代码...
if exist src\controllers move src\controllers packages\backend\src\
if exist src\services move src\services packages\backend\src\
if exist src\models move src\models packages\backend\src\
if exist src\entities move src\entities packages\backend\src\
if exist src\middlewares move src\middlewares packages\backend\src\

REM 5. 移动共享代码
echo 整理共享代码...
if exist src\types move src\types packages\shared\src\
if exist src\utils move src\utils packages\shared\src\
if exist src\constants move src\constants packages\shared\src\
if exist src\interfaces move src\interfaces packages\shared\src\

REM 6. 移动配置文件
echo 整理配置文件...
mkdir config
if exist src\config move src\config\* config\
rmdir /S /Q src\config

REM 7. 更新package.json
echo 更新package.json...
echo {> package.json
echo   "name": "health-platform",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "private": true,>> package.json
echo   "workspaces": [>> package.json
echo     "packages/*">> package.json
echo   ],>> package.json
echo   "scripts": {>> package.json
echo     "build": "lerna run build",>> package.json
echo     "test": "lerna run test",>> package.json
echo     "lint": "lerna run lint",>> package.json
echo     "start": "lerna run start",>> package.json
echo     "dev": "lerna run dev">> package.json
echo   },>> package.json
echo   "devDependencies": {>> package.json
echo     "lerna": "^4.0.0">> package.json
echo   }>> package.json
echo }>> package.json

REM 8. 创建lerna.json
echo 创建lerna配置...
echo {> lerna.json
echo   "packages": [>> lerna.json
echo     "packages/*">> lerna.json
echo   ],>> lerna.json
echo   "version": "independent",>> lerna.json
echo   "npmClient": "yarn",>> lerna.json
echo   "useWorkspaces": true>> lerna.json
echo }>> lerna.json

REM 9. 更新tsconfig.json
echo 更新TypeScript配置...
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

REM 10. 创建各个包的package.json
echo 创建子包配置...

REM Frontend package.json
echo {> packages\frontend\package.json
echo   "name": "@health/frontend",>> packages\frontend\package.json
echo   "version": "1.0.0",>> packages\frontend\package.json
echo   "dependencies": {>> packages\frontend\package.json
echo     "react": "^17.0.2",>> packages\frontend\package.json
echo     "react-dom": "^17.0.2",>> packages\frontend\package.json
echo     "@health/shared": "1.0.0">> packages\frontend\package.json
echo   }>> packages\frontend\package.json
echo }>> packages\frontend\package.json

REM Backend package.json
echo {> packages\backend\package.json
echo   "name": "@health/backend",>> packages\backend\package.json
echo   "version": "1.0.0",>> packages\backend\package.json
echo   "dependencies": {>> packages\backend\package.json
echo     "@nestjs/common": "^8.0.0",>> packages\backend\package.json
echo     "@nestjs/core": "^8.0.0",>> packages\backend\package.json
echo     "@health/shared": "1.0.0">> packages\backend\package.json
echo   }>> packages\backend\package.json
echo }>> packages\backend\package.json

REM Shared package.json
echo {> packages\shared\package.json
echo   "name": "@health/shared",>> packages\shared\package.json
echo   "version": "1.0.0",>> packages\shared\package.json
echo   "main": "dist/index.js",>> packages\shared\package.json
echo   "types": "dist/index.d.ts">> packages\shared\package.json
echo }>> packages\shared\package.json

REM Mobile package.json
echo {> packages\mobile\package.json
echo   "name": "@health/mobile",>> packages\mobile\package.json
echo   "version": "1.0.0",>> packages\mobile\package.json
echo   "dependencies": {>> packages\mobile\package.json
echo     "react-native": "^0.67.0",>> packages\mobile\package.json
echo     "@health/shared": "1.0.0">> packages\mobile\package.json
echo   }>> packages\mobile\package.json
echo }>> packages\mobile\package.json

REM Admin package.json
echo {> packages\admin\package.json
echo   "name": "@health/admin",>> packages\admin\package.json
echo   "version": "1.0.0",>> packages\admin\package.json
echo   "dependencies": {>> packages\admin\package.json
echo     "react": "^17.0.2",>> packages\admin\package.json
echo     "react-dom": "^17.0.2",>> packages\admin\package.json
echo     "@health/shared": "1.0.0">> packages\admin\package.json
echo   }>> packages\admin\package.json
echo }>> packages\admin\package.json

echo 目录重构完成！
echo 请运行 'yarn install' 安装依赖 