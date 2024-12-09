@echo off
echo Starting configuration files migration...
set LOG_FILE=config_migration_%date:~0,4%%date:~5,2%%date:~8,2%.log

REM 创建日志文件
echo Configuration Migration Log - %date% %time% > %LOG_FILE%

REM 创建配置目录
echo Creating configuration directories...
mkdir config 2>nul
mkdir config\env 2>nul
mkdir config\app 2>nul
mkdir config\database 2>nul

REM 复制环境配置文件
echo Copying environment configuration files...
xcopy /Y %BACKUP_DIR%\config\env\*.env config\env\ >> %LOG_FILE% 2>&1
xcopy /Y %BACKUP_DIR%\config\.env* config\env\ >> %LOG_FILE% 2>&1

REM 复制应用配置文件
echo Copying application configuration files...
xcopy /Y %BACKUP_DIR%\config\app\*.json config\app\ >> %LOG_FILE% 2>&1
xcopy /Y %BACKUP_DIR%\config\app\*.yaml config\app\ >> %LOG_FILE% 2>&1

REM 复制数据库配置文件
echo Copying database configuration files...
xcopy /Y %BACKUP_DIR%\config\database\*.json config\database\ >> %LOG_FILE% 2>&1
xcopy /Y %BACKUP_DIR%\config\database\*.yaml config\database\ >> %LOG_FILE% 2>&1

REM 更新配置文件中的路径
echo Updating configuration paths...

REM 更新应用配置文件中的路径
powershell -Command "Get-ChildItem -Path config\app -Recurse -File | ForEach-Object { (Get-Content $_.FullName) -replace 'src/old', 'src/features' | Set-Content $_.FullName }"
powershell -Command "Get-ChildItem -Path config\app -Recurse -File | ForEach-Object { (Get-Content $_.FullName) -replace 'components', 'ui/components' | Set-Content $_.FullName }"

REM 更新数据库配置文件中的路径
powershell -Command "Get-ChildItem -Path config\database -Recurse -File | ForEach-Object { (Get-Content $_.FullName) -replace 'db/', 'core/database/' | Set-Content $_.FullName }"

REM 复制依赖配置文件
echo Copying dependency configuration files...
xcopy /Y %BACKUP_DIR%\package.json .\ >> %LOG_FILE% 2>&1
xcopy /Y %BACKUP_DIR%\package-lock.json .\ >> %LOG_FILE% 2>&1
xcopy /Y %BACKUP_DIR%\tsconfig.json .\ >> %LOG_FILE% 2>&1

REM 更新依赖配置
echo Updating dependency configurations...
powershell -Command "(Get-Content package.json) -replace '\"src/(.+?)\"', '\"src/features/$1\"' | Set-Content package.json"

echo Configuration files migration completed!
echo Check %LOG_FILE% for detailed migration log.
exit /b 0