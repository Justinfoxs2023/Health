@echo off
echo Starting software restructuring process...

REM 执行清理
call 1-cleanup.bat
if errorlevel 1 goto error

REM 创建新架构
call 2-create-structure.bat 
if errorlevel 1 goto error

REM 迁移文件
call 3-migrate-files.bat
if errorlevel 1 goto error

REM 复制配置
call 4-copy-configs.bat
if errorlevel 1 goto error

echo Restructuring completed successfully!
goto end

:error
echo An error occurred during restructuring!
pause
exit /b 1

:end
pause
exit /b 0 