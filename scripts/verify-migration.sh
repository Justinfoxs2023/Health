#!/bin/bash

# 设置错误时退出
set -e

echo "开始验证迁移结果..."

# 定义颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 验证函数
verify_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓ 文件存在: $1${NC}"
        return 0
    else
        echo -e "${RED}✗ 文件缺失: $1${NC}"
        return 1
    fi
}

verify_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓ 目录存在: $1${NC}"
        return 0
    else
        echo -e "${RED}✗ 目录缺失: $1${NC}"
        return 1
    fi
}

# 验证计数器
total_checks=0
failed_checks=0

# 1. 验证目录结构
echo "检查目录结构..."
directories=(
    "packages/shared/src/config"
    "packages/shared/src/types"
    "packages/shared/src/utils"
    "packages/backend/src/models"
    "packages/backend/src/services"
)

for dir in "${directories[@]}"; do
    total_checks=$((total_checks + 1))
    verify_directory "$dir" || failed_checks=$((failed_checks + 1))
done

# 2. 验证配置文件
echo -e "\n检查配置文件..."
config_files=(
    "packages/shared/src/config/performance.config.ts"
    "packages/shared/src/config/debug.config.ts"
)

for file in "${config_files[@]}"; do
    total_checks=$((total_checks + 1))
    verify_file "$file" || failed_checks=$((failed_checks + 1))
done

# 3. 验证模型文件
echo -e "\n检查模型文件..."
model_files=(
    "packages/backend/src/models/health.model.ts"
)

for file in "${model_files[@]}"; do
    total_checks=$((total_checks + 1))
    verify_file "$file" || failed_checks=$((failed_checks + 1))
done

# 4. 验证服务文件
echo -e "\n检查服务文件..."
service_files=(
    "packages/backend/src/services/offline.service.ts"
    "packages/backend/src/services/ai-optimization.service.ts"
    "packages/backend/src/services/security.service.ts"
    "packages/backend/src/services/debug.service.ts"
    "packages/backend/src/services/config.service.ts"
    "packages/backend/src/services/index.ts"
)

for file in "${service_files[@]}"; do
    total_checks=$((total_checks + 1))
    verify_file "$file" || failed_checks=$((failed_checks + 1))
done

# 5. 验证类型定义
echo -e "\n检查类型定义..."
type_files=(
    "packages/shared/src/types/cache.ts"
    "packages/shared/src/types/ai.ts"
    "packages/shared/src/types/edge.ts"
    "packages/shared/src/types/health.ts"
    "packages/shared/src/types/debug.ts"
    "packages/shared/src/types/config.ts"
    "packages/shared/src/types/index.ts"
)

for file in "${type_files[@]}"; do
    total_checks=$((total_checks + 1))
    verify_file "$file" || failed_checks=$((failed_checks + 1))
done

# 6. 验证工具函数
echo -e "\n检查工具函数..."
util_files=(
    "packages/shared/src/utils/indexeddb.ts"
    "packages/shared/src/utils/localStorage.ts"
    "packages/shared/src/utils/index.ts"
)

for file in "${util_files[@]}"; do
    total_checks=$((total_checks + 1))
    verify_file "$file" || failed_checks=$((failed_checks + 1))
done

# 7. 验证导入路径
echo -e "\n检查导入路径..."
echo "验证 @health/shared 导入..."
if grep -r "@health/shared" packages/*/src/**/*.ts > /dev/null; then
    echo -e "${GREEN}✓ 找到 @health/shared 导入${NC}"
else
    echo -e "${RED}✗ 未找到 @health/shared 导入${NC}"
    failed_checks=$((failed_checks + 1))
fi
total_checks=$((total_checks + 1))

echo "验证 @health/backend 导入..."
if grep -r "@health/backend" packages/*/src/**/*.ts > /dev/null; then
    echo -e "${GREEN}✓ 找到 @health/backend 导入${NC}"
else
    echo -e "${RED}✗ 未找到 @health/backend 导入${NC}"
    failed_checks=$((failed_checks + 1))
fi
total_checks=$((total_checks + 1))

# 8. 验证旧目录是否已清理
echo -e "\n检查旧目录清理情况..."
old_directories=(
    "src/config"
    "src/models"
    "src/services"
    "src/types"
    "src/utils"
)

for dir in "${old_directories[@]}"; do
    total_checks=$((total_checks + 1))
    if [ ! -d "$dir" ]; then
        echo -e "${GREEN}✓ 旧目录已删除: $dir${NC}"
    else
        echo -e "${RED}✗ 旧目录仍存在: $dir${NC}"
        failed_checks=$((failed_checks + 1))
    fi
done

# 输出验证结果
echo -e "\n验证完成！"
echo "总检查项: $total_checks"
echo "失败项数: $failed_checks"
echo "成功率: $(( (total_checks - failed_checks) * 100 / total_checks ))%"

if [ $failed_checks -eq 0 ]; then
    echo -e "${GREEN}迁移验证通过！${NC}"
    exit 0
else
    echo -e "${RED}迁移验证失败，请检查上述错误${NC}"
    exit 1
fi 