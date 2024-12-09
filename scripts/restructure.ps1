# 设置错误处理
$ErrorActionPreference = "Stop"

# 添加日志函数
function Write-Log {
    param (
        [string]$message,
        [string]$type = "Info"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $type : $message"
    Write-Host $logMessage
    Add-Content -Path "restructure.log" -Value $logMessage
}

Write-Log "开始项目重构..." "Start"

# 创建目录函数
function Create-Directory {
    param (
        [string]$path
    )
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Log "创建目录: $path" "Create"
    }
}

# 复制文件函数
function Copy-Files {
    param (
        [string]$source,
        [string]$destination,
        [string]$module
    )
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $destination -Recurse -Force
        Write-Log "复制 $module 文件: $source -> $destination" "Copy"
    } else {
        Write-Log "源文件不存在: $source" "Warning"
    }
}

# 验证目录函数
function Verify-Directory {
    param (
        [string]$path
    )
    if (-not (Test-Path $path)) {
        Write-Log "目录验证失败: $path" "Error"
        throw "目录不存在: $path"
    }
}

try {
    # 创建主要包目录
    $directories = @(
        # 前端核心目录
        "packages/frontend/src/core/auth",          # 认证相关
        "packages/frontend/src/core/api",           # API调用
        "packages/frontend/src/core/store",         # 状态管理
        "packages/frontend/src/core/hooks",         # 通用Hooks
        "packages/frontend/src/core/utils",         # 工具函数
        
        # 前端功能模块
        "packages/frontend/src/modules/health",     # 健康管理模块
        "packages/frontend/src/modules/ai",         # AI功能模块
        "packages/frontend/src/modules/social",     # 社交功能模块
        
        # 前端UI组件
        "packages/frontend/src/components/base",    # 基础组件
        "packages/frontend/src/components/charts",  # 图表组件
        "packages/frontend/src/components/forms",   # 表单组件
        
        # 后端核心目录
        "packages/backend/src/core/auth",          # 认证中心
        "packages/backend/src/core/database",      # 数据库连接
        "packages/backend/src/core/cache",         # 缓存管理
        "packages/backend/src/core/queue",         # 消息队列
        
        # 后端功能模块
        "packages/backend/src/modules/health",     # 健康管理模块
        "packages/backend/src/modules/ai",         # AI服务模块
        "packages/backend/src/modules/social",     # 社交服务模块
        
        # 后端通用服务
        "packages/backend/src/services/logger",    # 日志服务
        "packages/backend/src/services/mailer",    # 邮件服务
        "packages/backend/src/services/storage",   # 存储服务
        
        # 共享模块
        "packages/shared/src/types",              # 类型定义
        "packages/shared/src/constants",          # 常量定义
        "packages/shared/src/utils",              # 共享工具
        "packages/shared/src/models",             # 数据模型
        
        # AI服务模块
        "packages/ai-service/src/vision",         # 计算机视觉
        "packages/ai-service/src/nlp",           # 自然语言处理
        "packages/ai-service/src/ml"             # 机器学习
    )

    foreach ($dir in $directories) {
        Create-Directory $dir
    }

    # 验证源目录
    Verify-Directory "src"
    Verify-Directory "frontend"
    Verify-Directory "backend"

    Write-Log "开始复制前端核心文件..." "Progress"
    Copy-Files "frontend/src/core/*" "packages/frontend/src/core/" "frontend-core"
    
    Write-Log "开始复制前端模块文件..." "Progress"
    Copy-Files "frontend/src/modules/*" "packages/frontend/src/modules/" "frontend-modules"
    
    Write-Log "开始复制前端组件..." "Progress"
    Copy-Files "frontend/src/components/*" "packages/frontend/src/components/" "frontend-components"
    
    Write-Log "开始复制后端核心文件..." "Progress"
    Copy-Files "backend/src/core/*" "packages/backend/src/core/" "backend-core"
    
    Write-Log "开始复制后端模块..." "Progress"
    Copy-Files "backend/src/modules/*" "packages/backend/src/modules/" "backend-modules"
    
    Write-Log "开始复制后端服务..." "Progress"
    Copy-Files "backend/src/services/*" "packages/backend/src/services/" "backend-services"
    
    Write-Log "开始复制共享文件..." "Progress"
    Copy-Files "shared/types/*" "packages/shared/src/types/" "shared-types"
    Copy-Files "shared/constants/*" "packages/shared/src/constants/" "shared-constants"
    Copy-Files "shared/utils/*" "packages/shared/src/utils/" "shared-utils"
    Copy-Files "shared/models/*" "packages/shared/src/models/" "shared-models"
    
    Write-Log "开始复制AI服务文件..." "Progress"
    Copy-Files "ai-service/src/*" "packages/ai-service/src/" "ai-services"

    Write-Log "开始复制配置文件..." "Progress"
    Copy-Files "package.json" "packages/frontend/" "frontend-package"
    Copy-Files "package.json" "packages/backend/" "backend-package"
    Copy-Files "package.json" "packages/shared/" "shared-package"
    Copy-Files "package.json" "packages/ai-service/" "ai-package"
    
    Copy-Files "tsconfig.json" "packages/frontend/" "frontend-tsconfig"
    Copy-Files "tsconfig.json" "packages/backend/" "backend-tsconfig"
    Copy-Files "tsconfig.json" "packages/shared/" "shared-tsconfig"
    Copy-Files "tsconfig.json" "packages/ai-service/" "ai-tsconfig"

    Write-Log "更新依赖配置..." "Progress"
    node scripts/update-package-json.js

    Write-Log "安装依赖..." "Progress"
    Set-Location packages/shared
    npm install --legacy-peer-deps
    Set-Location ../backend
    npm install --legacy-peer-deps
    Set-Location ../frontend
    npm install --legacy-peer-deps
    Set-Location ../ai-service
    npm install --legacy-peer-deps
    Set-Location ../..

    Write-Log "构建共享模块..." "Progress"
    Set-Location packages/shared
    npm run build
    Set-Location ../..

    Write-Log "项目重构完成！" "Success"
} catch {
    Write-Log "错误: $_" "Error"
    exit 1
}