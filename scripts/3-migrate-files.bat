@echo off
echo Starting file migration...
set LOG_FILE=migration_%date:~0,4%%date:~5,2%%date:~8,2%.log

REM 创建日志文件
echo File Migration Log - %date% %time% > %LOG_FILE%

REM 迁移核心模块文件
echo Migrating core modules...
echo Migrating core modules... >> %LOG_FILE%

echo Migrating auth module...
xcopy /E /I /Y %BACKUP_DIR%\src\auth\* src\core\auth\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating auth module >> %LOG_FILE%

echo Migrating database module...
xcopy /E /I /Y %BACKUP_DIR%\src\db\* src\core\database\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating database module >> %LOG_FILE%

echo Migrating utils...
xcopy /E /I /Y %BACKUP_DIR%\src\utils\* src\core\utils\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating utils >> %LOG_FILE%

REM 迁移功能模块文件
echo Migrating feature modules...
echo Migrating feature modules... >> %LOG_FILE%

echo Migrating health features...
xcopy /E /I /Y %BACKUP_DIR%\src\health-tracking\* src\features\health\ >> %LOG_FILE% 2>&1
xcopy /E /I /Y %BACKUP_DIR%\src\health-data\* src\features\health\data\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating health features >> %LOG_FILE%

echo Migrating wellness features...
xcopy /E /I /Y %BACKUP_DIR%\src\wellness\* src\features\wellness\ >> %LOG_FILE% 2>&1
xcopy /E /I /Y %BACKUP_DIR%\src\lifestyle\* src\features\wellness\lifestyle\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating wellness features >> %LOG_FILE%

echo Migrating medical features...
xcopy /E /I /Y %BACKUP_DIR%\src\medical-records\* src\features\medical\ >> %LOG_FILE% 2>&1
xcopy /E /I /Y %BACKUP_DIR%\src\prescriptions\* src\features\medical\prescriptions\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating medical features >> %LOG_FILE%

echo Migrating user features...
xcopy /E /I /Y %BACKUP_DIR%\src\user-management\* src\features\user\ >> %LOG_FILE% 2>&1
xcopy /E /I /Y %BACKUP_DIR%\src\profiles\* src\features\user\profiles\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating user features >> %LOG_FILE%

REM 迁移UI组件
echo Migrating UI components...
echo Migrating UI components... >> %LOG_FILE%

echo Migrating components...
xcopy /E /I /Y %BACKUP_DIR%\src\components\* src\ui\components\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating components >> %LOG_FILE%

echo Migrating layouts...
xcopy /E /I /Y %BACKUP_DIR%\src\layouts\* src\ui\layouts\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating layouts >> %LOG_FILE%

echo Migrating styles...
xcopy /E /I /Y %BACKUP_DIR%\src\styles\* src\ui\styles\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating styles >> %LOG_FILE%

REM 迁移共享资源
echo Migrating shared resources...
echo Migrating shared resources... >> %LOG_FILE%

echo Migrating assets...
xcopy /E /I /Y %BACKUP_DIR%\src\assets\* src\shared\assets\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating assets >> %LOG_FILE%

echo Migrating constants...
xcopy /E /I /Y %BACKUP_DIR%\src\constants\* src\shared\constants\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating constants >> %LOG_FILE%

echo Migrating types...
xcopy /E /I /Y %BACKUP_DIR%\src\types\* src\shared\types\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating types >> %LOG_FILE%

REM 迁移API相关文件
echo Migrating API files...
echo Migrating API files... >> %LOG_FILE%

echo Migrating endpoints...
xcopy /E /I /Y %BACKUP_DIR%\src\api\endpoints\* src\api\endpoints\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating endpoints >> %LOG_FILE%

echo Migrating middleware...
xcopy /E /I /Y %BACKUP_DIR%\src\api\middleware\* src\api\middleware\ >> %LOG_FILE% 2>&1
if errorlevel 1 echo Error migrating middleware >> %LOG_FILE%

echo File migration completed!
echo Migration completed at %date% %time% >> %LOG_FILE%
echo Check %LOG_FILE% for detailed migration log.
exit /b 0