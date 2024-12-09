@echo off
echo 开始验证迁移结果...

set total_checks=0
set failed_checks=0

REM 1. 验证目录结构
echo 检查目录结构...
set directories=^
    packages\shared\src\config ^
    packages\shared\src\types ^
    packages\shared\src\utils ^
    packages\backend\src\models ^
    packages\backend\src\services

for %%d in (%directories%) do (
    set /a total_checks+=1
    if exist "%%d" (
        echo [√] 目录存在: %%d
    ) else (
        echo [×] 目录缺失: %%d
        set /a failed_checks+=1
    )
)

REM 2. 验证配置文件
echo.
echo 检查配置文件...
set config_files=^
    packages\shared\src\config\performance.config.ts ^
    packages\shared\src\config\debug.config.ts

for %%f in (%config_files%) do (
    set /a total_checks+=1
    if exist "%%f" (
        echo [√] 文件存在: %%f
    ) else (
        echo [×] 文件缺失: %%f
        set /a failed_checks+=1
    )
)

REM 3. 验证模型文件
echo.
echo 检查模型文件...
set model_files=^
    packages\backend\src\models\health.model.ts

for %%f in (%model_files%) do (
    set /a total_checks+=1
    if exist "%%f" (
        echo [√] 文件存在: %%f
    ) else (
        echo [×] 文件缺失: %%f
        set /a failed_checks+=1
    )
)

REM 4. 验证服务文件
echo.
echo 检查服务文件...
set service_files=^
    packages\backend\src\services\offline.service.ts ^
    packages\backend\src\services\ai-optimization.service.ts ^
    packages\backend\src\services\security.service.ts ^
    packages\backend\src\services\debug.service.ts ^
    packages\backend\src\services\config.service.ts ^
    packages\backend\src\services\index.ts

for %%f in (%service_files%) do (
    set /a total_checks+=1
    if exist "%%f" (
        echo [√] 文件存在: %%f
    ) else (
        echo [×] 文件缺失: %%f
        set /a failed_checks+=1
    )
)

REM 5. 验证类型定义
echo.
echo 检查类型定义...
set type_files=^
    packages\shared\src\types\cache.ts ^
    packages\shared\src\types\ai.ts ^
    packages\shared\src\types\edge.ts ^
    packages\shared\src\types\health.ts ^
    packages\shared\src\types\debug.ts ^
    packages\shared\src\types\config.ts ^
    packages\shared\src\types\index.ts

for %%f in (%type_files%) do (
    set /a total_checks+=1
    if exist "%%f" (
        echo [√] 文件存在: %%f
    ) else (
        echo [×] 文件缺失: %%f
        set /a failed_checks+=1
    )
)

REM 6. 验证工具函数
echo.
echo 检查工具函数...
set util_files=^
    packages\shared\src\utils\indexeddb.ts ^
    packages\shared\src\utils\localStorage.ts ^
    packages\shared\src\utils\index.ts

for %%f in (%util_files%) do (
    set /a total_checks+=1
    if exist "%%f" (
        echo [√] 文件存在: %%f
    ) else (
        echo [×] 文件缺失: %%f
        set /a failed_checks+=1
    )
)

REM 7. 验证导入路径
echo.
echo 检查导入路径...
echo 验证 @health/shared 导入...
set /a total_checks+=1
powershell -Command "if (Select-String -Path 'packages\*\src\**\*.ts' -Pattern '@health/shared' -Quiet) { exit 0 } else { exit 1 }"
if %errorlevel% equ 0 (
    echo [√] 找到 @health/shared 导入
) else (
    echo [×] 未找到 @health/shared 导入
    set /a failed_checks+=1
)

echo 验证 @health/backend 导入...
set /a total_checks+=1
powershell -Command "if (Select-String -Path 'packages\*\src\**\*.ts' -Pattern '@health/backend' -Quiet) { exit 0 } else { exit 1 }"
if %errorlevel% equ 0 (
    echo [√] 找到 @health/backend 导入
) else (
    echo [×] 未找到 @health/backend 导入
    set /a failed_checks+=1
)

REM 8. 验证旧目录是否已清理
echo.
echo 检查旧目录清理情���...
set old_directories=^
    src\config ^
    src\models ^
    src\services ^
    src\types ^
    src\utils

for %%d in (%old_directories%) do (
    set /a total_checks+=1
    if not exist "%%d" (
        echo [√] 旧目录已删除: %%d
    ) else (
        echo [×] 旧目录仍存在: %%d
        set /a failed_checks+=1
    )
)

REM 输出验证结果
echo.
echo 验证完成！
echo 总检查项: %total_checks%
echo 失败项数: %failed_checks%
set /a success_rate=(%total_checks%-%failed_checks%)*100/%total_checks%
echo 成功率: %success_rate%%%

if %failed_checks% equ 0 (
    echo 迁移验证通过！
    exit /b 0
) else (
    echo 迁移验证失败，请检查上述错误
    exit /b 1
) 