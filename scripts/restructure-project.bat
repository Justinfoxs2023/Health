@echo off
echo 开始项目重构流程...

REM 步骤1: 备份当前项目
echo 步骤1: 创建项目备份...
xcopy /E /I /Y .\ ..\health-backup\
if errorlevel 1 (
    echo 备份创建失败，终止重构
    exit /b 1
)

REM 步骤2: 初始化新的项目结构
echo 步骤2: 初始化新项目结构...
call scripts\init-workspace.bat
if errorlevel 1 (
    echo 工作区初始化失败，终止重构
    exit /b 1
)

REM 步骤3: 执行文件迁移
echo 步骤3: 执行文件迁移...
call scripts\migrate-files.bat
if errorlevel 1 (
    echo 文件迁移失败，终止重构
    exit /b 1
)

REM 步骤4: 更新依赖配置
echo 步骤4: 更新依赖配置...
node scripts\update-package-json.js
if errorlevel 1 (
    echo 依赖配置更新失败，终止重构
    exit /b 1
)

REM 步骤5: 安装依赖
echo 步骤5: 安装项目依赖...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo 依赖安装失败，终止重构
    exit /b 1
)

REM 步骤6: 构建项目
echo 步骤6: 构建项目...
call npm run build
if errorlevel 1 (
    echo 项目构建失败，终止重构
    exit /b 1
)

echo 项目重构完成！
echo 请检查 packages 目录下的各个模块是否正确迁移。
echo 如需恢复备份，请使用 ..\health-backup 目录。 