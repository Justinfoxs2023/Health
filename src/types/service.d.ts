// 服务定义接口
export interface ServiceDefinition {
  name: string;
  version: string;
  endpoints: ServiceEndpoint[];
}

// 服务端点接口
export interface ServiceEndpoint {
  protocol: string;
  host: string;
  port: number;
}

// 服务实例接口
export interface ServiceInstance {
  id: string;
  name: string;
  address: string;
  port: number;
  tags: string[];
}

// 健康状态接口
export interface HealthStatus {
  status: string;
  output: string;
  timestamp: Date;
} 