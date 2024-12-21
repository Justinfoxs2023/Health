#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 输出帮助信息的函数
print_help() {
    echo -e "${YELLOW}用法:${NC}"
    echo "  ./git-recover.sh [选项]"
    echo ""
    echo -e "${YELLOW}选项:${NC}"
    echo "  -a, --all     恢复所有被删除的文件"
    echo "  -l, --list    列出所有被删除的文件"
    echo "  -f, --file    恢复指定的文件"
    echo "  -h, --help    显示此帮助信息"
    echo ""
    echo -e "${YELLOW}示例:${NC}"
    echo "  ./git-recover.sh -l"
    echo "  ./git-recover.sh -a"
    echo "  ./git-recover.sh -f path/to/file"
}

# 列出被删除文件的函数
list_deleted_files() {
    echo -e "${YELLOW}正在查找被删除的文件...${NC}"
    git ls-files -d
}

# 恢复单个文件的函数
recover_file() {
    local file=$1
    if [ -z "$file" ]; then
        echo -e "${RED}错误: 未指定文件路径${NC}"
        exit 1
    fi

    echo -e "${YELLOW}正在恢复文件: $file${NC}"
    if git checkout HEAD -- "$file"; then
        echo -e "${GREEN}文件恢复成功: $file${NC}"
    else
        echo -e "${RED}文件恢复失败: $file${NC}"
    fi
}

# 恢复所有被删除文件的函数
recover_all_files() {
    echo -e "${YELLOW}正在恢复所有被删除的文件...${NC}"
    local deleted_files=$(git ls-files -d)
    
    if [ -z "$deleted_files" ]; then
        echo -e "${YELLOW}没有找到被删除的文件${NC}"
        exit 0
    fi

    local success_count=0
    local fail_count=0

    while IFS= read -r file; do
        if git checkout HEAD -- "$file" 2>/dev/null; then
            echo -e "${GREEN}成功恢复: $file${NC}"
            ((success_count++))
        else
            echo -e "${RED}恢复失败: $file${NC}"
            ((fail_count++))
        fi
    done <<< "$deleted_files"

    echo -e "\n${YELLOW}恢复完成${NC}"
    echo -e "${GREEN}成功恢复: $success_count 个文件${NC}"
    if [ $fail_count -gt 0 ]; then
        echo -e "${RED}恢复失败: $fail_count 个文件${NC}"
    fi
}

# 主函数
main() {
    # 检查是否在git仓库中
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo -e "${RED}错误: 当前目录不是git仓库${NC}"
        exit 1
    fi

    # 如果没有参数，显示帮助信息
    if [ $# -eq 0 ]; then
        print_help
        exit 0
    fi

    # 处理命令行参数
    case "$1" in
        -h|--help)
            print_help
            ;;
        -l|--list)
            list_deleted_files
            ;;
        -a|--all)
            recover_all_files
            ;;
        -f|--file)
            if [ -z "$2" ]; then
                echo -e "${RED}错误: --file 选项需要指定文件路径${NC}"
                exit 1
            fi
            recover_file "$2"
            ;;
        *)
            echo -e "${RED}错误: 未知选项 $1${NC}"
            print_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@" 