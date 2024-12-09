@echo off
echo 开始创建优化后的目录结构...

:: 创建基础包目录
mkdir packages 2>nul

:: 前端结构
echo 创建前端目录结构...
:: 核心模块
mkdir packages\frontend\src\core\auth 2>nul
mkdir packages\frontend\src\core\api 2>nul
mkdir packages\frontend\src\core\store 2>nul
mkdir packages\frontend\src\core\utils 2>nul

:: 健康管理模块（合并运动、营养等相关功能）
mkdir packages\frontend\src\modules\health-management 2>nul
mkdir packages\frontend\src\modules\health-management\components 2>nul
mkdir packages\frontend\src\modules\health-management\services 2>nul
mkdir packages\frontend\src\modules\health-management\hooks 2>nul
mkdir packages\frontend\src\modules\health-management\store 2>nul

:: AI功能模块
mkdir packages\frontend\src\modules\ai-features 2>nul
mkdir packages\frontend\src\modules\ai-features\components 2>nul
mkdir packages\frontend\src\modules\ai-features\services 2>nul

:: 通用组件
mkdir packages\frontend\src\components\common 2>nul
mkdir packages\frontend\src\components\charts 2>nul
mkdir packages\frontend\src\components\forms 2>nul
mkdir packages\frontend\src\components\layouts 2>nul

:: 后端结构
echo 创建后端目录结构...
:: 核心模块
mkdir packages\backend\src\core\auth 2>nul
mkdir packages\backend\src\core\database 2>nul
mkdir packages\backend\src\core\security 2>nul
mkdir packages\backend\src\core\utils 2>nul

:: 健康管理模块
mkdir packages\backend\src\modules\health-management 2>nul
mkdir packages\backend\src\modules\health-management\controllers 2>nul
mkdir packages\backend\src\modules\health-management\services 2>nul
mkdir packages\backend\src\modules\health-management\repositories 2>nul
mkdir packages\backend\src\modules\health-management\models 2>nul

:: AI功能模块
mkdir packages\backend\src\modules\ai-features 2>nul
mkdir packages\backend\src\modules\ai-features\controllers 2>nul
mkdir packages\backend\src\modules\ai-features\services 2>nul
mkdir packages\backend\src\modules\ai-features\models 2>nul

:: 基础服务
mkdir packages\backend\src\services\logger 2>nul
mkdir packages\backend\src\services\mailer 2>nul
mkdir packages\backend\src\services\storage 2>nul

:: 共享模块
echo 创建共享模块目录结构...
mkdir packages\shared\src\types 2>nul
mkdir packages\shared\src\constants 2>nul
mkdir packages\shared\src\utils 2>nul
mkdir packages\shared\src\models 2>nul
mkdir packages\shared\src\interfaces 2>nul
mkdir packages\shared\src\validators 2>nul

:: AI服务
echo 创建AI服务目录结构...
mkdir packages\ai-service\src\core 2>nul
mkdir packages\ai-service\src\core\config 2>nul
mkdir packages\ai-service\src\core\utils 2>nul

:: 视觉分析
mkdir packages\ai-service\src\vision 2>nul
mkdir packages\ai-service\src\vision\analyzers 2>nul
mkdir packages\ai-service\src\vision\models 2>nul

:: 自然语言处理
mkdir packages\ai-service\src\nlp 2>nul
mkdir packages\ai-service\src\nlp\processors 2>nul
mkdir packages\ai-service\src\nlp\models 2>nul

:: 机器学习
mkdir packages\ai-service\src\ml 2>nul
mkdir packages\ai-service\src\ml\models 2>nul
mkdir packages\ai-service\src\ml\trainers 2>nul

echo 目录结构创建完成！ 