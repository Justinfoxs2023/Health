#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 输出帮助信息
show_help() {
    echo -e "${YELLOW}Git文件恢复工具${NC}"
    echo "用法: $0 [选项] [文件路径]"
    echo ""
    echo "选项:"
    echo "  -l, --list     列出所有可恢复的文件"
    echo "  -r, --recover  恢复指定的文件"
    echo "  -a, --all      恢复所有删除的文件"
    echo "  -h, --help     显示此帮助信息"
}

# 列出所有可恢复的文件
list_deleted_files() {
    echo -e "${GREEN}正在查找可恢复的文件...${NC}"
    git fsck --lost-found | grep "dangling blob" | cut -d " " -f 3 | while read hash; do
        git show $hash > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${YELLOW}Hash: ${hash}${NC}"
            echo -e "内容预览: "
            git show $hash | head -n 5
            echo -e "------------------------"
        fi
    done
}

# 恢复指定hash的文件
recover_file() {
    local hash=$1
    local filename=$2
    
    if [ -z "$filename" ]; then
        filename="recovered_${hash:0:7}"
    fi
    
    echo -e "${GREEN}正在恢复文件 ${filename}...${NC}"
    
    if git show $hash > "$filename" 2>/dev/null; then
        echo -e "${GREEN}文件已恢复到: ${filename}${NC}"
    else
        echo -e "${RED}恢复失败: 无法找到对应的文件内容${NC}"
        return 1
    fi
}

# 恢复所有删除的文件
recover_all_files() {
    echo -e "${GREEN}正在恢复所有删除的文件...${NC}"
    local recover_dir="git_recovered_$(date +%Y%m%d_%H%M%S)"
    mkdir -p $recover_dir
    
    git fsck --lost-found | grep "dangling blob" | cut -d " " -f 3 | while read hash; do
        recover_file $hash "${recover_dir}/recovered_${hash:0:7}"
    done
    
    echo -e "${GREEN}所有文件已恢复到目录: ${recover_dir}${NC}"
}

# 检查git仓库
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}错误: 当前目录不是git仓库${NC}"
        exit 1
    fi
}

# 主程序
main() {
    check_git_repo
    
    case "$1" in
        -l|--list)
            list_deleted_files
            ;;
        -r|--recover)
            if [ -z "$2" ]; then
                echo -e "${RED}错误: 请提供文件hash${NC}"
                exit 1
            fi
            recover_file $2 $3
            ;;
        -a|--all)
            recover_all_files
            ;;
        -h|--help|*)
            show_help
            ;;
    esac
}

# 执行主程序
main "$@" 