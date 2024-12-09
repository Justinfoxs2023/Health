# 生产环境部署指南

## 目录
1. [部署准备](#部署准备)
2. [服务器配置](#服务器配置)
3. [应用部署](#应用部署)
4. [性能优化](#性能优化)
5. [监控告警](#监控告警)
6. [安全加固](#安全加固)
7. [备份恢复](#备份恢复)

## 部署准备

### 硬件要求
- CPU: 8核心或以上
- 内存: 16GB或以上
- 磁盘: 100GB SSD
- 网络: 100Mbps带宽

### 软件要求
- 操作系统: Ubuntu 20.04 LTS
- Python 3.8+
- MongoDB 4.4+
- Redis 6.0+
- Nginx 1.18+
- Supervisor 4.2+

### 系统配置
```bash
# 更新系统
apt update && apt upgrade -y

# 安装基础工具
apt install -y build-essential git curl wget

# 配置系统限制
cat >> /etc/security/limits.conf << EOF
*         soft    nofile      65535
*         hard    nofile      65535
*         soft    nproc       65535
*         hard    nproc       65535
EOF

# 配置系统参数
cat >> /etc/sysctl.conf << EOF
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_syncookies = 1
vm.overcommit_memory = 1
EOF

sysctl -p
```

## 服务器配置

### Nginx配置
```nginx
upstream health_backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    keepalive 32;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://health_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        proxy_buffer_size 64k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;
    }
    
    location /static/ {
        alias /path/to/static/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
    
    location /media/ {
        alias /path/to/media/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### Supervisor配置
```ini
[program:health_platform]
directory=/path/to/project
command=/path/to/venv/bin/gunicorn main:app -c gunicorn_config.py
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/supervisor/health_platform.err.log
stdout_logfile=/var/log/supervisor/health_platform.out.log
environment=
    PYTHONPATH="/path/to/project",
    PATH="/path/to/venv/bin:%(ENV_PATH)s"

[program:health_celery]
directory=/path/to/project
command=/path/to/venv/bin/celery -A tasks worker -l info
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/supervisor/health_celery.err.log
stdout_logfile=/var/log/supervisor/health_celery.out.log
environment=
    PYTHONPATH="/path/to/project",
    PATH="/path/to/venv/bin:%(ENV_PATH)s"
```

### Gunicorn配置
```python
# gunicorn_config.py
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
max_requests = 1000
max_requests_jitter = 50
timeout = 300
keepalive = 5

# 日志配置
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
loglevel = "info"

# 进程名
proc_name = "health_platform"

# 优雅重启
graceful_timeout = 30
```

## 应用部署

### 1. 克隆代码
```bash
git clone <repository-url> /path/to/project
cd /path/to/project
```

### 2. 创建虚拟环境
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. 配置环境变量
```bash
cp .env.example .env.production
# 编辑 .env.production 设置生产环境配置
```

### 4. 初始化数据库
```bash
python manage.py migrate
python manage.py collectstatic
```

### 5. 启动服务
```bash
# 启动supervisor
supervisorctl reread
supervisorctl update
supervisorctl start all
```

## 性能优化

### 数据库优化
```bash
# MongoDB优化
echo "
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 4
" >> /etc/mongod.conf

# Redis优化
echo "
maxmemory 4gb
maxmemory-policy allkeys-lru
" >> /etc/redis/redis.conf
```

### 缓存配置
```python
# 配置Redis缓存
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SOCKET_CONNECT_TIMEOUT": 5,
            "SOCKET_TIMEOUT": 5,
            "RETRY_ON_TIMEOUT": True,
            "MAX_CONNECTIONS": 1000,
            "CONNECTION_POOL_KWARGS": {"max_connections": 100},
        }
    }
}
```

## 监控告警

### Prometheus配置
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'health_platform'
    static_configs:
      - targets: ['localhost:8000']
```

### Grafana仪表板
```json
{
  "dashboard": {
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph",
        "datasource": "Prometheus"
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "datasource": "Prometheus"
      }
    ]
  }
}
```

## 安全加固

### 1. 防火墙配置
```bash
# 配置UFW
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

### 2. SSL配置
```bash
# 安装certbot
apt install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d example.com
```

### 3. 安全Headers
```nginx
# Nginx安全头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 备份恢复

### 数据库备份
```bash
#!/bin/bash
# backup_db.sh

BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# MongoDB备份
mongodump --out "$BACKUP_DIR/mongodb_$DATE"

# Redis备份
redis-cli save
cp /var/lib/redis/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# 压缩备份
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" \
    "$BACKUP_DIR/mongodb_$DATE" \
    "$BACKUP_DIR/redis_$DATE.rdb"

# 删除30天前的备份
find "$BACKUP_DIR" -type f -mtime +30 -delete
```

### 自动备份配置
```bash
# 添加到crontab
0 2 * * * /path/to/backup_db.sh
```

## 维护计划

### 日常维护
1. 日志轮转
```bash
# logrotate配置
/var/log/health_platform/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        supervisorctl restart health_platform
    endscript
}
```

2. 监控检查
```bash
# 健康检查脚本
#!/bin/bash
curl -f http://localhost:8000/health || supervisorctl restart health_platform
```

### 更新部署
```bash
# 部署新版本
cd /path/to/project
git pull
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
supervisorctl restart all
``` 