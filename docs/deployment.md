# 健康管理平台开发部署文档

## 目录
1. [环境要求](#环境要求)
2. [依赖管理](#依赖管理)
3. [环境设置](#环境设置)
4. [部署步骤](#部署步骤)
5. [常见问题](#常见问题)

## 环境要求

### 系统要求
- Python 3.8 或更高版本
- 磁盘空间：至少 10GB（包含AI模型）
- 内存：建议 8GB 或更高
- 操作系统：支持 Linux、macOS 和 Windows

### 基础软件
- Git
- Python 虚拟环境
- pip 包管理器
- MongoDB 4.4+
- Redis 6.0+

## 依赖管理

项目采用分层的依赖管理结构，便于按需安装和维护：

### 依赖结构
```
requirements/
├── base.txt     # 基础依赖
├── ai.txt       # AI和机器学习相关
├── health.txt   # 健康和医疗相关
└── dev.txt      # 开发和测试工具
```

### 依赖说明

1. **基础依赖** (base.txt)
   - Web框架：FastAPI, Uvicorn
   - 数据库：MongoDB, Redis
   - 认证和安全：JWT, Cryptography
   - 基础工具：Python-dotenv, YAML
   - 监控和日志：Prometheus, Sentry
   - 性能优化：orjson, msgpack
   - 异步和并发：httpx, Celery

2. **AI相关依赖** (ai.txt)
   - 机器学习：NumPy, Pandas, Scikit-learn
   - 深度学习：PyTorch, TensorFlow
   - 自然语言处理：Transformers, NLTK, Spacy
   - 数据可视化：Matplotlib, Seaborn
   - AI服务：OpenAI

3. **健康相关依赖** (health.txt)
   - 健康数据：statsmodels, lifelines
   - 图像处理：Pillow, OpenCV
   - 医疗影像：pydicom, nibabel
   - 存储服务：boto3, minio

4. **开发工具依赖** (dev.txt)
   - 测试：pytest, pytest-cov
   - 代码质量：black, pylint, mypy
   - 开发工具：jupyter, ipython
   - 调试工具：debugpy, ipdb

## 环境设置

### Linux/macOS 环境设置

1. **基础安装**
```bash
# 仅安装基础依赖
./scripts/setup_env.sh

# 安装AI模块
./scripts/setup_env.sh ai

# 安装健康模块
./scripts/setup_env.sh health

# 安装开发工具
./scripts/setup_env.sh dev

# 完整安装
./scripts/setup_env.sh full
```

2. **激活虚拟环境**
```bash
source venv/bin/activate
```

### Windows 环境设置

1. **基础安装**
```batch
# 仅安装基础依赖
scripts\setup_env.bat

# 安装AI模块
scripts\setup_env.bat ai

# 安装健康模块
scripts\setup_env.bat health

# 安装开发工具
scripts\setup_env.bat dev

# 完整安装
scripts\setup_env.bat full
```

2. **激活虚拟环境**
```batch
venv\Scripts\activate.bat
```

### 开发环境推荐配置

1. **前端开发环境**
```bash
./scripts/setup_env.sh base
```

2. **AI开发环境**
```bash
./scripts/setup_env.sh ai
```

3. **健康模块开发环境**
```bash
./scripts/setup_env.sh health
```

4. **完整开发环境**
```bash
./scripts/setup_env.sh full
```

## 部署步骤

1. **克隆代码库**
```bash
git clone <repository-url>
cd health-platform
```

2. **环境设置**
```bash
# Linux/macOS
./scripts/setup_env.sh full

# Windows
scripts\setup_env.bat full
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，设置必要的环境变量
```

4. **初始化数据库**
```bash
python manage.py init-db
```

5. **启动服务**
```bash
python manage.py runserver
```

## 常见问题

### 1. 依赖安装失败

**问题**: 安装某些包时出现编译错误
**解决方案**:
- 确保系统已安装必要的编译工具
- 使用预编译的轮子包
- 检查Python版本兼容性

### 2. GPU支持

**问题**: 无法使用GPU加速
**解决方案**:
- 安装CUDA和cuDNN
- 安装GPU版本的PyTorch/TensorFlow
- 检查GPU驱动版本

### 3. 内存不足

**问题**: 安装或运行时内存不足
**解决方案**:
- 增加系统虚拟内存
- 分步安装大型依赖
- 使用较小的模型版本

### 4. 模型下载失败

**问题**: AI模型下载失败
**解决方案**:
- 使用稳定的网络连接
- 配置国内镜像源
- 手动下载模型文件

## 维护和更新

### 依赖更新
```bash
# 更新所有依赖
pip install -r requirements.txt --upgrade

# 更新特定模块依赖
pip install -r requirements/ai.txt --upgrade
```

### 环境清理
```bash
# 删除虚拟环境
rm -rf venv/  # Linux/macOS
rmdir /s /q venv  # Windows

# 重新创建环境
./scripts/setup_env.sh full  # Linux/macOS
scripts\setup_env.bat full   # Windows
``` 