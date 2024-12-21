/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// src/infrastructure/load-balancer/index.ts
export interface IServerNode {
  /** host 的描述 */
    host: string;
  /** port 的描述 */
    port: number;
  /** weight 的描述 */
    weight: number;
  /** connections 的描述 */
    connections: number;
}

export interface ILoadBalancerConfig {
  /** algorithm 的描述 */
    algorithm: roundrobin  leastconnections  weightedroundrobin;
  healthCheck: boolean;
  failover: boolean;
}

export class LoadBalancer {
  private servers: IServerNode[];
  private currentIndex: number;
  private config: ILoadBalancerConfig;

  constructor(config: ILoadBalancerConfig) {
    this.servers = [];
    this.currentIndex = 0;
    this.config = config;
  }

  addServer(server: IServerNode): void {
    this.servers.push(server);
  }

  removeServer(host: string, port: number): void {
    this.servers = this.servers.filter(server => server.host !== host || server.port !== port);
  }

  async getServer(): Promise<IServerNode> {
    if (this.servers.length === 0) {
      throw new Error('No available servers');
    }

    switch (this.config.algorithm) {
      case 'round-robin':
        return this.roundRobin();
      case 'least-connections':
        return this.leastConnections();
      case 'weighted-round-robin':
        return this.weightedRoundRobin();
      default:
        return this.roundRobin();
    }
  }

  private roundRobin(): IServerNode {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }

  private leastConnections(): IServerNode {
    return this.servers.reduce((min, server) =>
      server.connections < min.connections ? server : min,
    );
  }

  private weightedRoundRobin(): IServerNode {
    // 实现加权轮询算法
    return this.servers[0];
  }
}
