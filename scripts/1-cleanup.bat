@echo off
echo Starting cleanup process...

REM 创建备份目录
set BACKUP_DIR=backup_%date:~0,4%%date:~5,2%%date:~8,2%
mkdir %BACKUP_DIR%

REM 备份现有文件
echo Backing up existing files...
xcopy /E /I /Y src\* %BACKUP_DIR%\src\
xcopy /E /I /Y config\* %BACKUP_DIR%\config\

REM 清理现有目录
echo Cleaning up existing directories...
if exist src\ rmdir /S /Q src
if exist temp\ rmdir /S /Q temp

echo Cleanup completed!
exit /b 0 