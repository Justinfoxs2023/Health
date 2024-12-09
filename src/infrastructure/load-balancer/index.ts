// src/infrastructure/load-balancer/index.ts
export interface ServerNode {
    host: string;
    port: number;
    weight: number;
    connections: number;
  }
  
  export interface LoadBalancerConfig {
    algorithm: 'round-robin' | 'least-connections' | 'weighted-round-robin';
    healthCheck: boolean;
    failover: boolean;
  }
  
  export class LoadBalancer {
    private servers: ServerNode[];
    private currentIndex: number;
    private config: LoadBalancerConfig;
  
    constructor(config: LoadBalancerConfig) {
      this.servers = [];
      this.currentIndex = 0;
      this.config = config;
    }
  
    addServer(server: ServerNode): void {
      this.servers.push(server);
    }
  
    removeServer(host: string, port: number): void {
      this.servers = this.servers.filter(
        server => server.host !== host || server.port !== port
      );
    }
  
    async getServer(): Promise<ServerNode> {
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
  
    private roundRobin(): ServerNode {
      const server = this.servers[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.servers.length;
      return server;
    }
  
    private leastConnections(): ServerNode {
      return this.servers.reduce((min, server) => 
        server.connections < min.connections ? server : min
      );
    }
  
    private weightedRoundRobin(): ServerNode {
      // 实现加权轮询算法
      return this.servers[0];
    }
  }