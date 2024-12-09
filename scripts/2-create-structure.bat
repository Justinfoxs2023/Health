@echo off
echo Creating new directory structure...

REM 创建主要目录
mkdir src
cd src

REM 核心模块
mkdir core
mkdir core\auth
mkdir core\database
mkdir core\utils

REM 功能模块
mkdir features
mkdir features\health
mkdir features\wellness
mkdir features\medical
mkdir features\user

REM 界面模块
mkdir ui
mkdir ui\components
mkdir ui\layouts
mkdir ui\styles

REM 共享资源
mkdir shared
mkdir shared\assets
mkdir shared\constants
mkdir shared\types

REM API接口
mkdir api
mkdir api\endpoints
mkdir api\middleware

cd ..

echo Directory structure created successfully!
exit /b 0 