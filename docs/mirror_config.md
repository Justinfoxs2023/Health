# Python包镜像源配置指南

## 配置pip镜像源

### 方法一：临时使用

在安装包时使用 `-i` 参数：

```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 方法二：永久配置

1. **Linux/macOS**

创建或修改 `~/.pip/pip.conf` 文件：

```bash
mkdir -p ~/.pip
cat > ~/.pip/pip.conf << EOF
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host = pypi.tuna.tsinghua.edu.cn
EOF
```

2. **Windows**

创建或修改 `%APPDATA%\pip\pip.ini` 文件：

```ini
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host = pypi.tuna.tsinghua.edu.cn
```

## 常用镜像源列表

1. **清华大学镜像源**
```
https://pypi.tuna.tsinghua.edu.cn/simple
```

2. **阿里云镜像源**
```
https://mirrors.aliyun.com/pypi/simple
```

3. **中国科技大学镜像源**
```
https://pypi.mirrors.ustc.edu.cn/simple
```

4. **华中科技大学镜像源**
```
https://pypi.hustunique.com/simple
```

5. **豆瓣镜像源**
```
https://pypi.douban.com/simple
```

## 模型下载镜像

### Hugging Face模型��像
使用镜像下载Transformers模型：

```python
from transformers import AutoModel

# 使用镜像下载模型
model = AutoModel.from_pretrained(
    "bert-base-chinese",
    mirror="tuna"  # 使用清华镜像
)
```

### PyTorch模型镜像
在代码中设置PyTorch下载源：

```python
import torch

# 设置PyTorch镜像源
torch.hub.set_dir("~/.cache/torch/hub")  # 设置缓存目录
torch.hub._download_url_to_file = lambda url, dst, hash_prefix, progress: ...  # 自定义下载函数
```

### TensorFlow模型镜像
配置TensorFlow模型下载：

```python
import tensorflow as tf
import os

# 设置环境变量
os.environ['TFHUB_CACHE_DIR'] = '/path/to/tfhub_cache'
os.environ['TFHUB_MODEL_LOAD_FORMAT'] = 'COMPRESSED'
```

## 加速下载配置

### 1. 配置全局代理

如果有代理服务器，可以配置环境变量：

```bash
# Linux/macOS
export HTTP_PROXY="http://proxy.example.com:port"
export HTTPS_PROXY="http://proxy.example.com:port"

# Windows
set HTTP_PROXY=http://proxy.example.com:port
set HTTPS_PROXY=http://proxy.example.com:port
```

### 2. 使用下载工具

对于大文件，可以使用专门的下载工具：

```bash
# 使用aria2
aria2c -x 16 <download-url>

# 使用wget
wget -c <download-url>
```

### 3. 断点续传配置

pip配置断点��传：

```ini
[global]
download-cache = ~/.pip/cache
no-cache-dir = false
```

## 常见问题

### 1. SSL证书错误

如果遇到SSL证书验证错误，可以：

1. 更新证书：
```bash
pip install --upgrade certifi
```

2. 临时忽略证书（不推荐）：
```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org <package-name>
```

### 2. 下载超时

如果遇到下载超时，可以：

1. 设置更长的超时时间：
```bash
pip install --timeout 1000 <package-name>
```

2. 使用镜像源重试：
```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple <package-name>
```

### 3. 依赖冲突

如果遇到依赖冲突，可以：

1. 使用虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate.bat # Windows
```

2. 清理缓存：
```bash
pip cache purge
```

## 最佳实践

1. **使用虚拟环境**
   - 避免全局安装
   - 隔离项目依赖
   - 便于环境管理

2. **定期更新缓存**
   ```bash
   pip cache purge  # 清理缓存
   pip cache list   # 查看缓存
   ```

3. **保存下载的包**
   ```bash
   pip download -r requirements.txt -d ./pip_packages
   pip install --no-index --find-links=./pip_packages -r requirements.txt
   ```

4. **使用requirements.txt**
   ```bash
   pip freeze > requirements.txt  # 导出依赖
   pip install -r requirements.txt  # 安装依赖
   ``` 