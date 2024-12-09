@echo off
echo 开始设置Python虚拟环境...

REM 检查Python版本
python --version
if errorlevel 1 (
    echo 错误: 未找到Python
    exit /b 1
)

REM 创建虚拟环境
echo 创建虚拟环境...
python -m venv venv

REM 激活虚拟环境
echo 激活虚拟环境...
call venv\Scripts\activate.bat

REM 升级pip
echo 升级pip...
python -m pip install --upgrade pip

REM 安装依赖
echo 安装项目依赖...

REM 安装基础依赖
echo 安装基础依赖...
pip install -r requirements/base.txt

REM 根据参数安装其他依赖
if "%1"=="full" goto :install_all
if "%1"=="ai" goto :install_ai
if "%1"=="health" goto :install_health
if "%1"=="dev" goto :install_dev
goto :skip_optional

:install_all
echo 安装所有依赖...
pip install -r requirements/ai.txt
pip install -r requirements/health.txt
pip install -r requirements/dev.txt
goto :install_models

:install_ai
echo 安装AI相关依赖...
pip install -r requirements/ai.txt
goto :install_models

:install_health
echo 安装健康相关依赖...
pip install -r requirements/health.txt
goto :skip_models

:install_dev
echo 安装开发工具依赖...
pip install -r requirements/dev.txt
goto :skip_models

:install_models
REM 下载必要的模型和数据
echo 下载必要的模型和数据...
python -m spacy download zh_core_web_sm
python -m nltk.downloader punkt
python -m nltk.downloader wordnet

:skip_models
:skip_optional

REM 初始化开发环境配置
echo 初始化开发环境配置...
if not exist .env (
    copy .env.example .env
)

if not exist .env.development (
    copy .env.example .env.development
)

REM 创建必要的目录
echo 创建必要的目录...
if not exist data\raw mkdir data\raw
if not exist data\processed mkdir data\processed
if not exist models\saved mkdir models\saved
if not exist logs mkdir logs
if not exist temp mkdir temp

echo 环境设置完成！
echo 使用 'venv\Scripts\activate.bat' 激活虚拟环境

REM 显示使用说明
echo.
echo 使用说明：
echo 1. 仅安装基础依赖：setup_env.bat
echo 2. 安装AI相关依赖：setup_env.bat ai
echo 3. 安装健康相关依赖：setup_env.bat health
echo 4. 安装开发工具：setup_env.bat dev
echo 5. 安装所有依赖：setup_env.bat full