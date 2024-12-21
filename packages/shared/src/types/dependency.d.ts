/**
 * @fileoverview TS 文件 dependency.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IDependencyNode {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: 'service' | 'database' | 'cache' | 'queue';
  /** dependencies 的描述 */
  dependencies: string[];
}

export interface IDependencyEdge {
  /** source 的描述 */
  source: string;
  /** target 的描述 */
  target: string;
  /** type 的描述 */
  type: 'sync' | 'async' | 'event';
}

export interface IDependencyGraph {
  /** nodes 的描述 */
  nodes: IDependencyNode[];
  /** edges 的描述 */
  edges: IDependencyEdge[];
}

export interface IDependencyAnalysis {
  /** directDependencies 的描述 */
  directDependencies: string[];
  /** indirectDependencies 的描述 */
  indirectDependencies: string[];
  /** circularDependencies 的描述 */
  circularDependencies: string[][];
}

export interface IServiceHealth {
  /** status 的描述 */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** dependencies 的描述 */
  dependencies: Array<{
    id: string;
    status: string;
  }>;
}
