@echo off
echo 开始复制文件...

:: 复制前端文件
xcopy /E /I /Y "frontend\src\components\common\*" "packages\frontend\src\components\base\"
xcopy /E /I /Y "frontend\src\components\health\*" "packages\frontend\src\modules\health\"
xcopy /E /I /Y "frontend\src\components\exercise\*" "packages\frontend\src\modules\health\"
xcopy /E /I /Y "frontend\src\components\nutrition\*" "packages\frontend\src\modules\health\"
xcopy /E /I /Y "frontend\src\store\*" "packages\frontend\src\core\store\"
xcopy /E /I /Y "frontend\src\utils\*" "packages\frontend\src\core\utils\"
xcopy /E /I /Y "frontend\src\hooks\*" "packages\frontend\src\core\hooks\"

:: 复制后端文件
xcopy /E /I /Y "backend\src\modules\health\*" "packages\backend\src\modules\health\"
xcopy /E /I /Y "backend\src\modules\exercise\*" "packages\backend\src\modules\health\"
xcopy /E /I /Y "backend\src\modules\nutrition\*" "packages\backend\src\modules\health\"

:: 复制共享文件
xcopy /E /I /Y "src\types\*" "packages\shared\src\types\"
xcopy /E /I /Y "src\utils\*" "packages\shared\src\utils\"
xcopy /E /I /Y "src\models\*" "packages\shared\src\models\"

:: 复制AI服务文件
xcopy /E /I /Y "ai-services\src\vision\*" "packages\ai-service\src\vision\"
xcopy /E /I /Y "ai-services\src\nlp\*" "packages\ai-service\src\nlp\"
xcopy /E /I /Y "ai-services\src\ml\*" "packages\ai-service\src\ml\"

:: 复制配置文件
copy /Y "package.json" "packages\frontend\"
copy /Y "package.json" "packages\backend\"
copy /Y "package.json" "packages\shared\"
copy /Y "package.json" "packages\ai-service\"

copy /Y "tsconfig.json" "packages\frontend\"
copy /Y "tsconfig.json" "packages\backend\"
copy /Y "tsconfig.json" "packages\shared\"
copy /Y "tsconfig.json" "packages\ai-service\"

echo 文件复制完成！ 