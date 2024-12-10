export interface DependencyNode {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'queue';
  dependencies: string[];
}

export interface DependencyEdge {
  source: string;
  target: string;
  type: 'sync' | 'async' | 'event';
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyAnalysis {
  directDependencies: string[];
  indirectDependencies: string[];
  circularDependencies: string[][];
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  dependencies: Array<{
    id: string;
    status: string;
  }>;
} 