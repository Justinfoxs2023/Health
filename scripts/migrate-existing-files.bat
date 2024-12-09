@echo off
echo [%date% %time%] 开始文件迁移...
echo [%date% %time%] 开始文件迁移... > migrate.log

:: 设置源目录和目标目录
set SOURCE_DIR=.
set TARGET_DIR=packages

:: 创建目录结构
echo [%date% %time%] 创建目录结构...
echo [%date% %time%] 创建目录结构... >> migrate.log

mkdir "%TARGET_DIR%\frontend\src\pages\Health" 2>nul
mkdir "%TARGET_DIR%\frontend\src\pages\Exercise" 2>nul
mkdir "%TARGET_DIR%\frontend\src\pages\Nutrition" 2>nul
mkdir "%TARGET_DIR%\frontend\src\components\common" 2>nul
mkdir "%TARGET_DIR%\frontend\src\components\health" 2>nul
mkdir "%TARGET_DIR%\frontend\src\components\exercise" 2>nul
mkdir "%TARGET_DIR%\frontend\src\components\nutrition" 2>nul
mkdir "%TARGET_DIR%\frontend\src\store" 2>nul
mkdir "%TARGET_DIR%\frontend\src\utils" 2>nul
mkdir "%TARGET_DIR%\frontend\src\hooks" 2>nul
mkdir "%TARGET_DIR%\frontend\src\assets" 2>nul

mkdir "%TARGET_DIR%\backend\src\modules\health\controllers" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\health\services" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\health\entities" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\health\dto" 2>nul

mkdir "%TARGET_DIR%\backend\src\modules\exercise\controllers" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\exercise\services" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\exercise\entities" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\exercise\dto" 2>nul

mkdir "%TARGET_DIR%\backend\src\modules\nutrition\controllers" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\nutrition\services" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\nutrition\entities" 2>nul
mkdir "%TARGET_DIR%\backend\src\modules\nutrition\dto" 2>nul

mkdir "%TARGET_DIR%\shared\src\types" 2>nul
mkdir "%TARGET_DIR%\shared\src\utils" 2>nul
mkdir "%TARGET_DIR%\shared\src\constants" 2>nul
mkdir "%TARGET_DIR%\shared\src\interfaces" 2>nul

:: 复制文件
echo [%date% %time%] 开始复制文件...
echo [%date% %time%] 开始复制文件... >> migrate.log

:: 复制前端文件
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\pages\Health\*" "%TARGET_DIR%\frontend\src\pages\Health\"
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\pages\Exercise\*" "%TARGET_DIR%\frontend\src\pages\Exercise\"
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\pages\Nutrition\*" "%TARGET_DIR%\frontend\src\pages\Nutrition\"
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\components\*" "%TARGET_DIR%\frontend\src\components\"
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\store\*" "%TARGET_DIR%\frontend\src\store\"
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\utils\*" "%TARGET_DIR%\frontend\src\utils\"
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\hooks\*" "%TARGET_DIR%\frontend\src\hooks\"
xcopy /E /I /Y "%SOURCE_DIR%\frontend\src\assets\*" "%TARGET_DIR%\frontend\src\assets\"

:: 复制后端文件
xcopy /E /I /Y "%SOURCE_DIR%\backend\src\modules\health\*" "%TARGET_DIR%\backend\src\modules\health\"
xcopy /E /I /Y "%SOURCE_DIR%\backend\src\modules\exercise\*" "%TARGET_DIR%\backend\src\modules\exercise\"
xcopy /E /I /Y "%SOURCE_DIR%\backend\src\modules\nutrition\*" "%TARGET_DIR%\backend\src\modules\nutrition\"

:: 复制共享文件
xcopy /E /I /Y "%SOURCE_DIR%\shared\types\*" "%TARGET_DIR%\shared\src\types\"
xcopy /E /I /Y "%SOURCE_DIR%\shared\utils\*" "%TARGET_DIR%\shared\src\utils\"
xcopy /E /I /Y "%SOURCE_DIR%\shared\constants\*" "%TARGET_DIR%\shared\src\constants\"
xcopy /E /I /Y "%SOURCE_DIR%\shared\interfaces\*" "%TARGET_DIR%\shared\src\interfaces\"

:: 复制配置文件
copy /Y "%SOURCE_DIR%\package.json" "%TARGET_DIR%\backend\"
copy /Y "%SOURCE_DIR%\package.json" "%TARGET_DIR%\frontend\"
copy /Y "%SOURCE_DIR%\package.json" "%TARGET_DIR%\shared\"
copy /Y "%SOURCE_DIR%\tsconfig.json" "%TARGET_DIR%\backend\"
copy /Y "%SOURCE_DIR%\tsconfig.json" "%TARGET_DIR%\frontend\"
copy /Y "%SOURCE_DIR%\tsconfig.json" "%TARGET_DIR%\shared\"

echo [%date% %time%] 文件迁移完成！
echo [%date% %time%] 文件迁移完成！ >> migrate.log

:: 安装依赖
echo [%date% %time%] 开始安装依赖...
echo [%date% %time%] 开始安装依赖... >> migrate.log

cd "%TARGET_DIR%\shared"
call npm install --legacy-peer-deps
cd ..\backend
call npm install --legacy-peer-deps
cd ..\frontend
call npm install --legacy-peer-deps
cd ..\..

:: 构建共享模块
echo [%date% %time%] 开始构建共享模块...
echo [%date% %time%] 开始构建共享模块... >> migrate.log

cd "%TARGET_DIR%\shared"
call npm run build
cd ..\..

echo [%date% %time%] 所有操作完成！
echo [%date% %time%] 所有操作完成！ >> migrate.log

pause