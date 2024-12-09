@echo off
echo 初始化项目工作区...

REM 清理现有的node_modules
echo 清理node_modules...
rmdir /s /q node_modules
rmdir /s /q packages\frontend\node_modules
rmdir /s /q packages\backend\node_modules
rmdir /s /q packages\shared\node_modules

REM 安装根目录依赖
echo 安装根目录依赖...
call npm install --legacy-peer-deps

REM 初始化工作区
echo 初始化工作区...
call npm run bootstrap

REM 构建共享包
echo 构建共享包...
cd packages\shared
call npm run build
cd ..\..

REM 构建后端
echo 构建后端...
cd packages\backend
call npm run build
cd ..\..

REM 构建前端
echo 构建前端...
cd packages\frontend
call npm run build
cd ..\..

echo 工作区初始化完成！ 