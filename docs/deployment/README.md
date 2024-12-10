# 部署文档

## 1. 环境要求

### 1.1 硬件要求
- CPU: 4核心及以上
- 内存: 8GB及以上
- 存储: 50GB及以上SSD
- 网络: 100Mbps及以上带宽

### 1.2 软件要求
- 操作系统: Ubuntu 20.04 LTS或更高版本
- Docker: 20.10或更高版本
- Docker Compose: 2.0或更高版本
- Node.js: 18.0.0或更高版本（仅用于开发环境）
- MongoDB: 5.0或更高版本
- Redis: 6.0或更高版本

### 1.3 网络要求
- 开放端口:
  - 3000: 应用服务
  - 27017: MongoDB
  - 6379: Redis
  - 9090: Prometheus
  - 3001: Grafana

## 2. 部署步骤

### 2.1 准备工作

#### 2.1.1 安装Docker和Docker Compose
```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2.1.2 配置系统参数
```bash
# 配置系统参数
cat << EOF | sudo tee -a /etc/sysctl.conf
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=65535
net.ipv4.tcp_syncookies=1
vm.overcommit_memory=1
EOF

# 应用系统参数
sudo sysctl -p
```

### 2.2 部署应用

#### 2.2.1 克隆代码
```bash
git clone https://github.com/your-org/health-management-system.git
cd health-management-system
```

#### 2.2.2 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env

# 配置以下必要参数
APP_NAME=Health Management System
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_PORT=3000

# 数据库配置
DB_HOST=mongodb
DB_PORT=27017
DB_NAME=health_platform
DB_USER=prod_user
DB_PASS=your-secure-password

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d

# AI服务配置
AI_SERVICE_KEY=your-ai-service-key
OPENAI_API_KEY=your-openai-api-key
```

#### 2.2.3 配置SSL证书
```bash
# 创建证书目录
mkdir -p ./ssl

# 复制SSL证书
cp /path/to/your/certificate.crt ./ssl/
cp /path/to/your/private.key ./ssl/
```

#### 2.2.4 启动服务
```bash
# 构建并启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 2.3 配置Nginx反向代理

#### 2.3.1 安装Nginx
```bash
sudo apt update
sudo apt install nginx
```

#### 2.3.2 配置Nginx
```nginx
# /etc/nginx/sites-available/health-app.conf

upstream health_app {
    server localhost:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://health_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态文件缓存
    location /static/ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        proxy_pass http://health_app;
    }

    # 健康检查端点
    location /health {
        access_log off;
        proxy_pass http://health_app;
    }
}
```

#### 2.3.3 启用配置
```bash
sudo ln -s /etc/nginx/sites-available/health-app.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 3. 监控配置

### 3.1 Prometheus配置

#### 3.1.1 配置告警规则
```yaml
# prometheus/rules/health_app.yml

groups:
  - name: health_app_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          description: "Error rate is {{ $value }} for the last 5 minutes"

      - alert: HighLatency
        expr: http_request_duration_seconds{quantile="0.9"} > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High latency detected
          description: "90th percentile latency is {{ $value }}s"

      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total[5m]) * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High CPU usage detected
          description: "CPU usage is {{ $value }}%"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / node_memory_MemTotal_bytes * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High memory usage detected
          description: "Memory usage is {{ $value }}%"
```

### 3.2 Grafana配置

#### 3.2.1 配置数据源
1. 访问Grafana (http://your-domain:3001)
2. 登录（默认用户名/密码：admin/admin）
3. 添加Prometheus数据源:
   - URL: http://prometheus:9090
   - Access: Server (default)

#### 3.2.2 导入仪表板
1. 创建新的仪表板
2. 添加以下面板:
   - 请求率
   - 错误率
   - 响应时间
   - CPU使用率
   - 内存使用率
   - 健康检查状态
   - AI模型性能指标
   - 缓存命中率

## 4. 备份策略

### 4.1 数据库备份

#### 4.1.1 MongoDB备份
```bash
#!/bin/bash
# /usr/local/bin/backup-mongodb.sh

BACKUP_DIR="/backup/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="health_platform_$TIMESTAMP"

# 创建备份
docker exec mongodb mongodump \
  --db health_platform \
  --out /data/backup/$BACKUP_NAME

# 压缩备份
cd $BACKUP_DIR
tar czf $BACKUP_NAME.tar.gz $BACKUP_NAME

# 删除30天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

#### 4.1.2 配置定时备份
```bash
# 编辑crontab
crontab -e

# 添加定时任务（每天凌晨2点执行备份）
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

### 4.2 日志备份

#### 4.2.1 配置日志轮转
```
# /etc/logrotate.d/health-app

/var/log/health-app/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        [ -s /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endscript
}
```

## 5. 运维指南

### 5.1 日常维护

#### 5.1.1 检查服务状态
```bash
# 检查所有容器状态
docker-compose ps

# 检查服务日志
docker-compose logs -f [service_name]

# 检查系统资源使用情况
docker stats
```

#### 5.1.2 性能优化
```bash
# 清理Docker资源
docker system prune -a

# 优化数据库
docker exec -it mongodb mongosh
db.runCommand({ compact: "health_data" })
```

### 5.2 故障处理

#### 5.2.1 常见问题处理流程
1. 服务无响应
```bash
# 重启服务
docker-compose restart [service_name]

# 检查日志
docker-compose logs -f [service_name]
```

2. 数据库连接问题
```bash
# 检查MongoDB状态
docker exec mongodb mongosh --eval "db.serverStatus()"

# 检查Redis状态
docker exec redis redis-cli ping
```

3. 内存溢出
```bash
# 检查内存使用情况
free -m

# 清理系统缓存
echo 3 > /proc/sys/vm/drop_caches
```

### 5.3 扩展指南

#### 5.3.1 水平扩展
1. 修改docker-compose.yml添加更多实例
```yaml
services:
  app:
    deploy:
      replicas: 3
```

2. 更新负载均衡配置
```nginx
upstream health_app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
    least_conn;
}
```

#### 5.3.2 垂直扩展
1. 更新服务资源限制
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

### 5.4 安全维护

#### 5.4.1 定期更新
```bash
# 更新系统包
sudo apt update
sudo apt upgrade

# 更新Docker镜像
docker-compose pull
docker-compose up -d
```

#### 5.4.2 安全检查
```bash
# 检查Docker安全配置
docker info

# 检查容器漏洞
docker scan health-app

# 检查系统日志
sudo journalctl -f
``` 