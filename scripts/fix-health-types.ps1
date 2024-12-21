# 修复健康数据类型的 PowerShell 脚本

Write-Host "开始修复健康数据类型..." -ForegroundColor Cyan

# 1. 创建类型定义文件
$healthTypesContent = @"
import { IHealthData } from '../../types/base';

export interface HealthData extends IHealthData {
  [key: string]: any;
}

export interface HealthThreshold {
  MIN: number;
  MAX: number;
  WARNING_LOW?: number;
  WARNING_HIGH?: number;
}

export interface HealthThresholds {
  [key: string]: HealthThreshold;
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  type: string;
  path: string[];
  condition: 'gt' | 'lt' | 'eq' | 'between';
  threshold: number | [number, number];
  level: 'info' | 'warning' | 'error' | 'critical';
  cooldown?: number;
}

export interface RiskAlert {
  id: string;
  ruleId: string;
  userId: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  data: any;
  timestamp: Date;
  handled?: boolean;
  handledBy?: string;
  handledAt?: Date;
}

export interface HealthAnalysis {
  score: number;
  status: 'normal' | 'warning' | 'critical';
  details: Array<{
    type: string;
    value: number;
    threshold: HealthThreshold;
    status: 'normal' | 'warning' | 'critical';
    suggestion?: string;
  }>;
}

export interface HealthTrend {
  type: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
  analysis: {
    trend: 'up' | 'down' | 'stable';
    change: number;
    suggestion?: string;
  };
}
"@

# 2. 确保目录存在
$typesPath = "packages/shared/src/services/health"
if (-not (Test-Path $typesPath)) {
    New-Item -ItemType Directory -Path $typesPath -Force
}

# 3. 写入类型定义文件
Set-Content -Path "$typesPath/types.ts" -Value $healthTypesContent

Write-Host "健康数据类型修复完成!" -ForegroundColor Green
