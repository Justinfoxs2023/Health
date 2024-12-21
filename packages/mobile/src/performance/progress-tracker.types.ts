/**
 * @fileoverview TS 文件 progress-tracker.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 优化进度类型
export interface IOptimizationProgress {
  /** type 的描述 */
  type: 'memory' | 'performance' | 'network';
  /** current 的描述 */
  current: number;
  /** target 的描述 */
  target: number;
  /** status 的描述 */
  status: 'improved' | 'warning' | 'critical';
}

// 优化历史记录
export interface IOptimizationHistory {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** before 的描述 */
  before: number;
  /** after 的描述 */
  after: number;
  /** improvement 的描述 */
  improvement: number;
  /** details 的描述 */
  details?: {
    action: string;
    impact: string;
    duration: number;
  };
}

// 优化建议
export interface IOptimizationSuggestion {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** priority 的描述 */
  priority: 'high' | 'medium' | 'low';
  /** effort 的描述 */
  effort: 'easy' | 'medium' | 'hard';
  /** impact 的描述 */
  impact: number;
  /** icon 的描述 */
  icon: string;
  /** status 的描述 */
  status: 'pending' | 'in_progress' | 'completed';
}

// 进度追踪配置
export interface IProgressTrackerConfig {
  /** refreshInterval 的描述 */
  refreshInterval: number;
  /** thresholds 的描述 */
  thresholds: {
    warning: number;
    critical: number;
  };
  /** targets 的描述 */
  targets: {
    memory: number;
    performance: number;
    network: number;
  };
}
