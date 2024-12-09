#!/bin/bash

# 设置错误时退出
set -e

echo "开始迁移已完成的代码文件..."

# 创建必要的目录
mkdir -p packages/shared/src/{config,types,utils}
mkdir -p packages/backend/src/{models,services}

# 1. 迁移配置文件
echo "迁移配置文件..."
mv src/config/performance.config.ts packages/shared/src/config/
mv src/config/debug.config.ts packages/shared/src/config/

# 2. 迁移模型文件
echo "迁移模型文件..."
mv src/models/health.model.ts packages/backend/src/models/

# 3. 迁移服务文件
echo "迁移服务文件..."
mv src/services/offline.service.ts packages/backend/src/services/
mv src/services/ai-optimization.service.ts packages/backend/src/services/
mv src/services/security.service.ts packages/backend/src/services/
mv src/services/debug.service.ts packages/backend/src/services/
mv src/services/config.service.ts packages/backend/src/services/

# 4. 迁移类型定义
echo "迁移类型定义..."
mv src/types/cache.ts packages/shared/src/types/
mv src/types/ai.ts packages/shared/src/types/
mv src/types/edge.ts packages/shared/src/types/
mv src/types/health.ts packages/shared/src/types/
mv src/types/debug.ts packages/shared/src/types/
mv src/types/config.ts packages/shared/src/types/

# 5. 迁移工具函数
echo "迁移工具函数..."
mv src/utils/indexeddb.ts packages/shared/src/utils/
mv src/utils/localStorage.ts packages/shared/src/utils/

# 6. 更新导入路径
echo "更新导入路径..."
find packages -type f -name "*.ts" -exec sed -i 's|@/types|@health/shared/types|g' {} +
find packages -type f -name "*.ts" -exec sed -i 's|@/utils|@health/shared/utils|g' {} +
find packages -type f -name "*.ts" -exec sed -i 's|@/config|@health/shared/config|g' {} +
find packages -type f -name "*.ts" -exec sed -i 's|@/services|@health/backend/services|g' {} +
find packages -type f -name "*.ts" -exec sed -i 's|@/models|@health/backend/models|g' {} +

# 7. 创建类型定义索引文件
echo "创建类型定义索引文件..."
cat > packages/shared/src/types/index.ts << EOL
export * from './cache';
export * from './ai';
export * from './edge';
export * from './health';
export * from './debug';
export * from './config';
EOL

# 8. 创建工具函数索引文件
echo "创建工具函数索引文件..."
cat > packages/shared/src/utils/index.ts << EOL
export * from './indexeddb';
export * from './localStorage';
EOL

# 9. 创建服务索引文件
echo "创建服务索引文件..."
cat > packages/backend/src/services/index.ts << EOL
export * from './offline.service';
export * from './ai-optimization.service';
export * from './security.service';
export * from './debug.service';
export * from './config.service';
EOL

echo "文件迁移完成！" 