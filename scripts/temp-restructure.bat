@echo off
setlocal enabledelayedexpansion

:: 设置日志文件
set LOG_FILE=restructure_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log
echo [%date% %time%] 开始重构... > %LOG_FILE%

:: 设置错误计数器
set ERROR_COUNT=0

:: 创建基础目录函数
:create_dir
if not exist %1 (
    mkdir %1 2>nul
    if !errorlevel! neq 0 (
        echo [%date% %time%] 错误: 无法创建目录 %1 >> %LOG_FILE%
        set /a ERROR_COUNT+=1
    ) else (
        echo [%date% %time%] 成功: 创建目录 %1 >> %LOG_FILE%
    )
) else (
    echo [%date% %time%] 信息: 目录已存在 %1 >> %LOG_FILE%
)
goto :eof

:: 复制文件函数
:copy_files
echo [%date% %time%] 开始复制: %1 到 %2 >> %LOG_FILE%
xcopy /E /I /Y %1 %2 2>>%LOG_FILE%
if !errorlevel! neq 0 (
    echo [%date% %time%] 错误: 复制失败 %1 >> %LOG_FILE%
    set /a ERROR_COUNT+=1
) else (
    echo [%date% %time%] 成功: 复制完成 %1 >> %LOG_FILE%
)
goto :eof

echo [%date% %time%] 开始创建目录结构... >> %LOG_FILE%

:: 创建前端目录结构
call :create_dir "packages\frontend\src\core\auth"
call :create_dir "packages\frontend\src\core\api"
call :create_dir "packages\frontend\src\core\store"
call :create_dir "packages\frontend\src\core\hooks"
call :create_dir "packages\frontend\src\core\utils"
call :create_dir "packages\frontend\src\core\services"

call :create_dir "packages\frontend\src\modules\health"
call :create_dir "packages\frontend\src\modules\health\components"
call :create_dir "packages\frontend\src\modules\health\services"
call :create_dir "packages\frontend\src\modules\health\hooks"
call :create_dir "packages\frontend\src\modules\ai"
call :create_dir "packages\frontend\src\modules\social"

call :create_dir "packages\frontend\src\components\base"
call :create_dir "packages\frontend\src\components\charts"
call :create_dir "packages\frontend\src\components\forms"
call :create_dir "packages\frontend\src\components\layouts"

:: 创建后端目录结构
call :create_dir "packages\backend\src\core\auth"
call :create_dir "packages\backend\src\core\database"
call :create_dir "packages\backend\src\core\cache"
call :create_dir "packages\backend\src\core\queue"
call :create_dir "packages\backend\src\core\security"

call :create_dir "packages\backend\src\modules\health"
call :create_dir "packages\backend\src\modules\health\controllers"
call :create_dir "packages\backend\src\modules\health\services"
call :create_dir "packages\backend\src\modules\health\repositories"
call :create_dir "packages\backend\src\modules\ai"
call :create_dir "packages\backend\src\modules\social"

call :create_dir "packages\backend\src\services\logger"
call :create_dir "packages\backend\src\services\mailer"
call :create_dir "packages\backend\src\services\storage"
call :create_dir "packages\backend\src\services\notification"

:: 创建共享模块目录
call :create_dir "packages\shared\src\types"
call :create_dir "packages\shared\src\constants"
call :create_dir "packages\shared\src\utils"
call :create_dir "packages\shared\src\models"
call :create_dir "packages\shared\src\interfaces"
call :create_dir "packages\shared\src\validators"

:: 创建AI服务目录
call :create_dir "packages\ai-service\src\vision"
call :create_dir "packages\ai-service\src\vision\models"
call :create_dir "packages\ai-service\src\vision\processors"
call :create_dir "packages\ai-service\src\nlp"
call :create_dir "packages\ai-service\src\nlp\models"
call :create_dir "packages\ai-service\src\nlp\processors"
call :create_dir "packages\ai-service\src\ml"
call :create_dir "packages\ai-service\src\ml\models"
call :create_dir "packages\ai-service\src\ml\trainers"

echo [%date% %time%] 开始复制文件... >> %LOG_FILE%

:: 复制前端文件
call :copy_files "frontend\src\components\common\*" "packages\frontend\src\components\base\"
call :copy_files "frontend\src\components\health\*" "packages\frontend\src\modules\health\components\"
call :copy_files "frontend\src\components\exercise\*" "packages\frontend\src\modules\health\components\"
call :copy_files "frontend\src\components\nutrition\*" "packages\frontend\src\modules\health\components\"
call :copy_files "frontend\src\store\*" "packages\frontend\src\core\store\"
call :copy_files "frontend\src\utils\*" "packages\frontend\src\core\utils\"
call :copy_files "frontend\src\hooks\*" "packages\frontend\src\core\hooks\"
call :copy_files "frontend\src\services\*" "packages\frontend\src\core\services\"

:: 复制后端文件
call :copy_files "backend\src\modules\health\*" "packages\backend\src\modules\health\"
call :copy_files "backend\src\modules\exercise\*" "packages\backend\src\modules\health\"
call :copy_files "backend\src\modules\nutrition\*" "packages\backend\src\modules\health\"
call :copy_files "backend\src\auth\*" "packages\backend\src\core\auth\"
call :copy_files "backend\src\database\*" "packages\backend\src\core\database\"
call :copy_files "backend\src\services\*" "packages\backend\src\services\"

:: 复制共享文件
call :copy_files "src\types\*" "packages\shared\src\types\"
call :copy_files "src\utils\*" "packages\shared\src\utils\"
call :copy_files "src\constants\*" "packages\shared\src\constants\"
call :copy_files "src\models\*" "packages\shared\src\models\"
call :copy_files "src\interfaces\*" "packages\shared\src\interfaces\"
call :copy_files "src\validators\*" "packages\shared\src\validators\"

:: 复制AI服务文件
call :copy_files "ai-services\src\vision\*" "packages\ai-service\src\vision\"
call :copy_files "ai-services\src\nlp\*" "packages\ai-service\src\nlp\"
call :copy_files "ai-services\src\ml\*" "packages\ai-service\src\ml\"

:: 复制配置文件
echo [%date% %time%] 复制配置文件... >> %LOG_FILE%

:: 前端配置
copy /Y "package.json" "packages\frontend\" >> %LOG_FILE%
copy /Y "tsconfig.json" "packages\frontend\" >> %LOG_FILE%
copy /Y ".eslintrc.js" "packages\frontend\" >> %LOG_FILE%
copy /Y ".prettierrc" "packages\frontend\" >> %LOG_FILE%

:: 后端配置
copy /Y "package.json" "packages\backend\" >> %LOG_FILE%
copy /Y "tsconfig.json" "packages\backend\" >> %LOG_FILE%
copy /Y ".env" "packages\backend\" >> %LOG_FILE%
copy /Y ".env.development" "packages\backend\" >> %LOG_FILE%
copy /Y ".env.production" "packages\backend\" >> %LOG_FILE%
copy /Y ".env.example" "packages\backend\" >> %LOG_FILE%
copy /Y ".eslintrc.js" "packages\backend\" >> %LOG_FILE%
copy /Y ".prettierrc" "packages\backend\" >> %LOG_FILE%

:: 共享模块配置
copy /Y "package.json" "packages\shared\" >> %LOG_FILE%
copy /Y "tsconfig.json" "packages\shared\" >> %LOG_FILE%

:: AI服务配置
copy /Y "package.json" "packages\ai-service\" >> %LOG_FILE%
copy /Y "tsconfig.json" "packages\ai-service\" >> %LOG_FILE%

:: 检查错误
if %ERROR_COUNT% gtr 0 (
    echo [%date% %time%] 重构完成，但有 %ERROR_COUNT% 个错误，请查看日志文件 %LOG_FILE% >> %LOG_FILE%
    echo 重构完成，但有 %ERROR_COUNT% 个错误，请查看日志文件 %LOG_FILE%
) else (
    echo [%date% %time%] 重构成功完成！ >> %LOG_FILE%
    echo 重构成功完成！
)

endlocal