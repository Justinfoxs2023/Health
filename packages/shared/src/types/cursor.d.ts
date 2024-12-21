/**
 * @fileoverview TS 文件 cursor.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础类型定义
interface ICursorConfig {
  /** cursor 的描述 */
  cursor: string;
  /** area 的描述 */
  area: string[];
  /** active 的描述 */
  active?: string;
  /** performance 的描述 */
  performance?: IPerformanceConfig;
}

interface IPerformanceConfig {
  /** willChange 的描述 */
  willChange?: string;
  /** gpuAcceleration 的描述 */
  gpuAcceleration?: boolean;
  /** responseTime 的描述 */
  responseTime?: number;
}

// 交互区域类型定义
interface InteractionArea {
  /** type 的描述 */
  type: string;
  /** config 的描述 */
  config: ICursorConfig;
  /** enabled 的描述 */
  enabled: boolean;
}

// 错误处理类型定义
interface IErrorHandling {
  /** fallback 的描述 */
  fallback: string;
  /** recovery 的描述 */
  recovery: () => void;
  /** errorBoundary 的描述 */
  errorBoundary?: React.ComponentType<any>;
}

// 性能监控类型定义
interface IPerformanceMetrics {
  /** responseTime 的描述 */
  responseTime: number;
  /** memoryUsage 的描述 */
  memoryUsage: number;
  /** fps 的描述 */
  fps: number;
  /** loadTime 的描述 */
  loadTime: number;
}
