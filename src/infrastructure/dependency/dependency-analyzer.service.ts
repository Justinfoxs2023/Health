import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MetricsService } from '../monitoring/metrics.service';

interface DependencyNode {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'queue';
  dependencies: string[];
}

interface DependencyGraph {
  nodes: DependencyNode[];
  edges: Array<{
    source: string;
    target: string;
    type: 'sync' | 'async' | 'event';
  }>;
}

@Injectable()
export class DependencyAnalyzerService {
  private dependencyGraph: DependencyGraph = { nodes: [], edges: [] };

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService
  ) {}

  // 注册服务依赖
  registerDependency(
    serviceId: string,
    dependencyId: string,
    type: 'sync' | 'async' | 'event' = 'sync'
  ): void {
    // 确保节点存在
    this.ensureNodeExists(serviceId);
    this.ensureNodeExists(dependencyId);

    // 添加依赖边
    this.dependencyGraph.edges.push({
      source: serviceId,
      target: dependencyId,
      type
    });
  }

  // 分析依赖关系
  analyzeDependencies(serviceId: string): {
    directDependencies: string[];
    indirectDependencies: string[];
    circularDependencies: string[][];
  } {
    const directDeps = this.getDirectDependencies(serviceId);
    const indirectDeps = this.getIndirectDependencies(serviceId);
    const circularDeps = this.findCircularDependencies(serviceId);

    return {
      directDependencies: directDeps,
      indirectDependencies: indirectDeps,
      circularDependencies: circularDeps
    };
  }

  // 获取服务健康状态
  async getServiceHealth(serviceId: string): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    dependencies: Array<{ id: string; status: string }>;
  }> {
    const dependencies = this.getDirectDependencies(serviceId);
    const healthStatus = await Promise.all(
      dependencies.map(async (depId) => ({
        id: depId,
        status: await this.checkDependencyHealth(depId)
      }))
    );

    return {
      status: this.evaluateOverallHealth(healthStatus),
      dependencies: healthStatus
    };
  }

  private ensureNodeExists(nodeId: string): void {
    if (!this.dependencyGraph.nodes.find(n => n.id === nodeId)) {
      this.dependencyGraph.nodes.push({
        id: nodeId,
        name: nodeId,
        type: 'service',
        dependencies: []
      });
    }
  }

  private getDirectDependencies(serviceId: string): string[] {
    return this.dependencyGraph.edges
      .filter(edge => edge.source === serviceId)
      .map(edge => edge.target);
  }

  private getIndirectDependencies(serviceId: string): string[] {
    const visited = new Set<string>();
    const indirect = new Set<string>();

    const traverse = (currentId: string) => {
      if (visited.has(currentId)) return;
      visited.add(currentId);

      const directDeps = this.getDirectDependencies(currentId);
      directDeps.forEach(depId => {
        if (depId !== serviceId) {
          indirect.add(depId);
          traverse(depId);
        }
      });
    };

    traverse(serviceId);
    return Array.from(indirect);
  }

  private findCircularDependencies(serviceId: string): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const path: string[] = [];

    const dfs = (currentId: string) => {
      if (path.includes(currentId)) {
        const cycle = path.slice(path.indexOf(currentId));
        cycles.push([...cycle, currentId]);
        return;
      }

      if (visited.has(currentId)) return;
      visited.add(currentId);
      path.push(currentId);

      const dependencies = this.getDirectDependencies(currentId);
      dependencies.forEach(depId => dfs(depId));

      path.pop();
    };

    dfs(serviceId);
    return cycles;
  }

  private async checkDependencyHealth(dependencyId: string): Promise<string> {
    try {
      const metrics = await this.metrics.getServiceMetrics(dependencyId);
      const errorRate = metrics.errors / metrics.total;
      if (errorRate > 0.1) return 'unhealthy';
      if (errorRate > 0.05) return 'degraded';
      return 'healthy';
    } catch (error) {
      return 'unknown';
    }
  }

  private evaluateOverallHealth(
    dependencyHealth: Array<{ id: string; status: string }>
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const unhealthy = dependencyHealth.filter(d => d.status === 'unhealthy').length;
    const degraded = dependencyHealth.filter(d => d.status === 'degraded').length;

    if (unhealthy > 0) return 'unhealthy';
    if (degraded > 0) return 'degraded';
    return 'healthy';
  }
} 