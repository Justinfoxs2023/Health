#!/bin/bash

echo "开始设置Python虚拟环境..."

# 检查Python版本
python --version
if [ $? -ne 0 ]; then
    echo "错误: 未找到Python"
    exit 1
fi

# 创建虚拟环境
echo "创建虚拟环境..."
python -m venv venv

# 激活虚拟环境
echo "激活虚拟环境..."
source venv/bin/activate

# 升级pip
echo "升级pip..."
python -m pip install --upgrade pip

# 安装依赖
echo "安装项目依赖..."

# 安装基础依赖
echo "安装基础依赖..."
pip install -r requirements/base.txt

# 根据参数安装其他依赖
if [ "$1" = "full" ] || [ "$1" = "ai" ]; then
    echo "安装AI相关依赖..."
    pip install -r requirements/ai.txt
fi

if [ "$1" = "full" ] || [ "$1" = "health" ]; then
    echo "安装健康相关依赖..."
    pip install -r requirements/health.txt
fi

if [ "$1" = "full" ] || [ "$1" = "dev" ]; then
    echo "安装开发工具依赖..."
    pip install -r requirements/dev.txt
fi

# 下载必要的模型和数据
if [ "$1" = "full" ] || [ "$1" = "ai" ]; then
    echo "下载必要的模型和数据..."
    python -m spacy download zh_core_web_sm
    python -m nltk.downloader punkt
    python -m nltk.downloader wordnet
fi

# 初始化开发环境配置
echo "初始化开发环境配置..."
if [ ! -f .env ]; then
    cp .env.example .env
fi

if [ ! -f .env.development ]; then
    cp .env.example .env.development
fi

# 创建必要的目录
echo "创建必要的目录..."
mkdir -p data/raw
mkdir -p data/processed
mkdir -p models/saved
mkdir -p logs
mkdir -p temp

echo "环境设置完成！"
echo "使用 'source venv/bin/activate' 激活虚拟环境"

# 显示使用说明
echo "
使用说明：
1. 仅安装基础依赖：./setup_env.sh
2. 安装AI相关依赖：./setup_env.sh ai
3. 安装健康相关依赖：./setup_env.sh health
4. 安装开发工具：./setup_env.sh dev
5. 安装所有依赖：./setup_env.sh full
" 