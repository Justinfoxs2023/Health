@echo off
echo 开始迁移已完成的代码文件...

REM 创建必要的目录
mkdir packages\shared\src\config packages\shared\src\types packages\shared\src\utils
mkdir packages\backend\src\models packages\backend\src\services

REM 1. 迁移配置文件
echo 迁移配置文件...
move src\config\performance.config.ts packages\shared\src\config\
move src\config\debug.config.ts packages\shared\src\config\

REM 2. 迁移模型文件
echo 迁移模型文件...
move src\models\health.model.ts packages\backend\src\models\

REM 3. 迁移服务文件
echo 迁移服务文件...
move src\services\offline.service.ts packages\backend\src\services\
move src\services\ai-optimization.service.ts packages\backend\src\services\
move src\services\security.service.ts packages\backend\src\services\
move src\services\debug.service.ts packages\backend\src\services\
move src\services\config.service.ts packages\backend\src\services\

REM 4. 迁移类型定义
echo 迁移类型定义...
move src\types\cache.ts packages\shared\src\types\
move src\types\ai.ts packages\shared\src\types\
move src\types\edge.ts packages\shared\src\types\
move src\types\health.ts packages\shared\src\types\
move src\types\debug.ts packages\shared\src\types\
move src\types\config.ts packages\shared\src\types\

REM 5. 迁移工具函数
echo 迁移工具函数...
move src\utils\indexeddb.ts packages\shared\src\utils\
move src\utils\localStorage.ts packages\shared\src\utils\

REM 6. 更新导入路径
echo 更新导入路径...
powershell -Command "(Get-ChildItem -Path packages -Recurse -Filter *.ts) | ForEach-Object { (Get-Content $_.FullName) -replace '@/types', '@health/shared/types' | Set-Content $_.FullName }"
powershell -Command "(Get-ChildItem -Path packages -Recurse -Filter *.ts) | ForEach-Object { (Get-Content $_.FullName) -replace '@/utils', '@health/shared/utils' | Set-Content $_.FullName }"
powershell -Command "(Get-ChildItem -Path packages -Recurse -Filter *.ts) | ForEach-Object { (Get-Content $_.FullName) -replace '@/config', '@health/shared/config' | Set-Content $_.FullName }"
powershell -Command "(Get-ChildItem -Path packages -Recurse -Filter *.ts) | ForEach-Object { (Get-Content $_.FullName) -replace '@/services', '@health/backend/services' | Set-Content $_.FullName }"
powershell -Command "(Get-ChildItem -Path packages -Recurse -Filter *.ts) | ForEach-Object { (Get-Content $_.FullName) -replace '@/models', '@health/backend/models' | Set-Content $_.FullName }"

REM 7. 创建类型定义索引文件
echo 创建类型定义索引文件...
echo export * from './cache';> packages\shared\src\types\index.ts
echo export * from './ai';>> packages\shared\src\types\index.ts
echo export * from './edge';>> packages\shared\src\types\index.ts
echo export * from './health';>> packages\shared\src\types\index.ts
echo export * from './debug';>> packages\shared\src\types\index.ts
echo export * from './config';>> packages\shared\src\types\index.ts

REM 8. 创建工具函数索引文件
echo 创建工具函数索引文件...
echo export * from './indexeddb';> packages\shared\src\utils\index.ts
echo export * from './localStorage';>> packages\shared\src\utils\index.ts

REM 9. 创建服务索引文件
echo 创建服务索引文件...
echo export * from './offline.service';> packages\backend\src\services\index.ts
echo export * from './ai-optimization.service';>> packages\backend\src\services\index.ts
echo export * from './security.service';>> packages\backend\src\services\index.ts
echo export * from './debug.service';>> packages\backend\src\services\index.ts
echo export * from './config.service';>> packages\backend\src\services\index.ts

echo 文件迁移完成！ 