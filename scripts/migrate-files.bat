@echo off
echo 开始执行文件迁移...

REM 创建必要的目录结构
echo 创建新的目录结构...
mkdir packages\frontend\src\components 2>nul
mkdir packages\frontend\src\pages 2>nul
mkdir packages\frontend\src\store 2>nul
mkdir packages\frontend\src\utils 2>nul
mkdir packages\backend\src\modules 2>nul
mkdir packages\backend\src\services 2>nul
mkdir packages\backend\src\controllers 2>nul
mkdir packages\shared\src\types 2>nul
mkdir packages\shared\src\utils 2>nul

REM 迁移前端文件
echo 迁移前端文件...
xcopy /E /I /Y frontend\src\components packages\frontend\src\components
xcopy /E /I /Y frontend\src\pages packages\frontend\src\pages
xcopy /E /I /Y frontend\src\store packages\frontend\src\store
xcopy /E /I /Y frontend\src\utils packages\frontend\src\utils
rmdir /S /Q frontend

REM 迁移后端文件
echo 迁移后端文件...
xcopy /E /I /Y backend\src\modules packages\backend\src\modules
xcopy /E /I /Y backend\src\services packages\backend\src\services
xcopy /E /I /Y backend\src\controllers packages\backend\src\controllers
rmdir /S /Q backend

REM 迁移共享文件
echo 迁移共享文件...
xcopy /E /I /Y src\types packages\shared\src\types
xcopy /E /I /Y src\utils packages\shared\src\utils
rmdir /S /Q src

REM 迁移配置文件
echo 迁移配置文件...
copy /Y tsconfig.json packages\frontend\
copy /Y tsconfig.json packages\backend\
copy /Y tsconfig.json packages\shared\
copy /Y .eslintrc.js packages\frontend\
copy /Y .eslintrc.js packages\backend\
copy /Y .eslintrc.js packages\shared\
copy /Y .prettierrc packages\frontend\
copy /Y .prettierrc packages\backend\
copy /Y .prettierrc packages\shared\

REM 迁移环境配置
echo 迁移环境配置...
copy /Y .env.* packages\backend\
mkdir packages\frontend\config 2>nul
xcopy /E /I /Y config\* packages\frontend\config\
rmdir /S /Q config

REM 迁移数据库相关文件
echo 迁移数据库文件...
xcopy /E /I /Y database\* packages\backend\database\
rmdir /S /Q database

REM 迁移AI服务
echo 迁移AI服务...
xcopy /E /I /Y ai-services\* packages\backend\src\modules\ai\
rmdir /S /Q ai-services

REM 迁移工具脚本
echo 迁移工具脚本...
xcopy /E /I /Y tools\* packages\shared\src\utils\tools\
rmdir /S /Q tools

REM 迁移移动端文件
echo 迁移移动端文件...
xcopy /E /I /Y mobile\* packages\mobile\
rmdir /S /Q mobile

REM 清理临时目录
echo 清理临时目录...
rmdir /S /Q dist 2>nul
mkdir logs 2>nul
mkdir storage 2>nul

echo 文件迁移完成！ 