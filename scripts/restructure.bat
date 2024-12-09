@echo off
echo 开始执行重构过程...

:: 3. 迁移文件
echo 步骤 3/4: 迁移文件...
call scripts\3-migrate-files.bat
if errorlevel 1 (
    echo 文件迁移过程出错，终止重构
    exit /b 1
)

:: 4. 复制配置文件
echo 步骤 4/4: 复制配置文件...
call scripts\4-copy-configs.bat
if errorlevel 1 (
    echo 配置文件复制过程出错，终止重构
    exit /b 1
)

echo 重构过程完成！
echo 请检查日志文件了解详细信息。 