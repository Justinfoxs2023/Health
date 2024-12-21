/**
 * @fileoverview TS 文件 interfaces.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IAPIData {
  /** name 的描述 */
    name: string;
  /** version 的描述 */
    version: string;
  /** description 的描述 */
    description: string;
  /** type 的描述 */
    type: rest  graphql  websocket;
  endpoint: string;
  auth: {
    type: none  apikey  oauth2;
    config: Recordstring, any;
  };
  rateLimit: {
    requests: number;
    period: number;
  };
  status: 'draft' | 'published' | 'deprecated';
}

export interface IDeveloperData {
  /** name 的描述 */
    name: string;
  /** email 的描述 */
    email: string;
  /** company 的描述 */
    company: string;
  /** website 的描述 */
    website: string;
  /** description 的描述 */
    description: string;
  /** status 的描述 */
    status: pending  active  suspended;
  apiKeys: Array{
    key: string;
    name: string;
    permissions: string;
    createdAt: Date;
    expiresAt: Date;
  }>;
}

export interface ISDKData {
  /** name 的描述 */
    name: string;
  /** version 的描述 */
    version: string;
  /** language 的描述 */
    language: string;
  /** platform 的描述 */
    platform: string;
  /** description 的描述 */
    description: string;
  /** repository 的描述 */
    repository: string;
  /** documentation 的描述 */
    documentation: string;
  /** dependencies 的描述 */
    dependencies: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** examples 的描述 */
    examples: Array{
    name: string;
    description: string;
    code: string;
  }>;
  status: 'draft' | 'published' | 'deprecated';
}

export interface IAPISpecData {
  /** apiId 的描述 */
    apiId: string;
  /** version 的描述 */
    version: string;
  /** format 的描述 */
    format: openapi  graphql  custom;
  spec: Recordstring, any;
  examples: Array{
    name: string;
    request: Recordstring, any;
    response: Recordstring, any;
  }>;
  status: 'draft' | 'published';
}

export interface IAPIUsageData {
  /** apiId 的描述 */
    apiId: string;
  /** developerId 的描述 */
    developerId: string;
  /** period 的描述 */
    period: {
    start: Date;
    end: Date;
  };
  /** metrics 的描述 */
    metrics: {
    totalRequests: number;
    successRequests: number;
    errorRequests: number;
    avgLatency: number;
    p95Latency: number;
    bandwidth: number;
  };
  /** errors 的描述 */
    errors: Array<{
    code: string;
    message: string;
    count: number;
    examples: Array<{
      timestamp: Date;
      request: Record<string, any>;
      response: Record<string, any>;
    }>;
  }>;
}

export interface IRouteConfig {
  /** path 的描述 */
    path: string;
  /** target 的描述 */
    target: string;
  /** methods 的描述 */
    methods: string;
  /** auth 的描述 */
    auth: false | true;
  /** rateLimit 的描述 */
    rateLimit: number;
}

export interface IRateLimitConfig {
  /** path 的描述 */
    path: string;
  /** requestsPerMinute 的描述 */
    requestsPerMinute: number;
}

export interface IGatewayConfig {
  /** routes 的描述 */
    routes: IRouteConfig;
  /** rateLimits 的描述 */
    rateLimits: IRateLimitConfig;
  /** blacklist 的描述 */
    blacklist: string;
}

export interface IGatewayMetrics {
  /** routes 的描述 */
    routes: number;
  /** blacklistedIPs 的描述 */
    blacklistedIPs: number;
  /** rateLimit 的描述 */
    rateLimit: number;
  /** cacheHitRate 的描述 */
    cacheHitRate: number;
  /** errorRate 的描述 */
    errorRate: number;
}

export interface IRouteMetrics {
  /** requests 的描述 */
    requests: number;
  /** errors 的描述 */
    errors: number;
  /** latency 的描述 */
    latency: number;
  /** lastAccessed 的描述 */
    lastAccessed: Date;
}

export interface IRouteStatus {
  /** config 的描述 */
    config: IRouteConfig;
  /** metrics 的描述 */
    metrics: IRouteMetrics;
  /** circuitBreaker 的描述 */
    circuitBreaker: {
    state: open  closed  halfopen;
    failures: number;
    lastFailure: Date;
  };
}

export interface IGatewayRequest {
  /** path 的描述 */
    path: string;
  /** method 的描述 */
    method: string;
  /** headers 的描述 */
    headers: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** query 的描述 */
    query: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** body 的描述 */
    body: any;
  /** ip 的描述 */
    ip: string;
}

export interface IGatewayResponse {
  /** status 的描述 */
    status: number;
  /** headers 的描述 */
    headers: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
  /** body 的描述 */
    body: any;
}

export interface ICacheConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** ttl 的描述 */
    ttl: number;
  /** maxSize 的描述 */
    maxSize: number;
}

export interface ISecurityConfig {
  /** jwt 的描述 */
    jwt: {
    secret: string;
    expiresIn: string;
  };
  /** rateLimit 的描述 */
    rateLimit: {
    windowMs: number;
    max: number;
  };
  /** cors 的描述 */
    cors: {
    origin: string[];
    methods: string[];
  };
}

export interface ICircuitBreakerConfig {
  /** failureThreshold 的描述 */
    failureThreshold: number;
  /** resetTimeout 的描述 */
    resetTimeout: number;
  /** halfOpenRequests 的描述 */
    halfOpenRequests: number;
}

export interface IMetricsConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** interval 的描述 */
    interval: number;
  /** retention 的描述 */
    retention: number;
}

export interface ILogConfig {
  /** level 的描述 */
    level: string;
  /** format 的描述 */
    format: string;
  /** destination 的描述 */
    destination: string;
}

export interface IAPIKeyConfig {
  /** id 的描述 */
    id: string;
  /** key 的描述 */
    key: string;
  /** permissions 的描述 */
    permissions: string;
  /** rateLimit 的描述 */
    rateLimit: number;
  /** createdAt 的描述 */
    createdAt: Date;
  /** lastUsed 的描述 */
    lastUsed: Date;
}

export interface IServiceDiscoveryConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** provider 的描述 */
    provider: string;
  /** refreshInterval 的描述 */
    refreshInterval: number;
}

export interface ILoadBalancerConfig {
  /** algorithm 的描述 */
    algorithm: roundrobin  leastconnections  random;
  healthCheck: {
    enabled: boolean;
    interval: number;
    timeout: number;
    unhealthyThreshold: number;
  };
}

export interface ITransformationConfig {
  /** request 的描述 */
    request: {
    headers: Recordstring, string;
    query: Recordstring, string;
    body: Recordstring, any;
  };
  /** response 的描述 */
    response?: undefined | { headers?: Record<string, string> | undefined; body?: Record<string, any> | undefined; };
}

export interface IValidationConfig {
  /** request 的描述 */
    request: {
    headers: Recordstring, string;
    query: Recordstring, string;
    body: Recordstring, any;
  };
  /** response 的描述 */
    response?: undefined | { headers?: Record<string, string> | undefined; body?: Record<string, any> | undefined; };
}

export interface IMonitoringConfig {
  /** metrics 的描述 */
    metrics: IMetricsConfig;
  /** logging 的描述 */
    logging: ILogConfig;
  /** alerts 的描述 */
    alerts: {
    enabled: boolean;
    channels: string;
    thresholds: Recordstring, number;
  };
}
